import { injectable, inject } from 'tsyringe';
import {
  Controller,
  Get,
  Param,
} from 'routing-controllers';
import {
  GetAllProvincesQueryHandler,
  GetCitiesByProvinceCodeQueryHandler,
  GetBarangaysByCityCodeQueryHandler,
  AddressMapper,
  TOKENS,
  AddressValidationService,
  ProvinceCodeSchema,
  CityCodeSchema,
} from '@nx-starter/application-shared';
import {
  ProvinceListResponse,
  CityListResponse,
  BarangayListResponse,
} from '@nx-starter/application-shared';
import { ApiResponseBuilder } from '../dto/ApiResponse';

/**
 * REST API Controller for Address operations
 * Provides Philippine address data (provinces, cities, barangays)
 * Follows Clean Architecture - Controllers are part of the presentation layer
 */
@Controller('/address')
@injectable()
export class AddressController {
  constructor(
    @inject(TOKENS.GetAllProvincesQueryHandler)
    private getAllProvincesQueryHandler: GetAllProvincesQueryHandler,
    @inject(TOKENS.GetCitiesByProvinceCodeQueryHandler)
    private getCitiesByProvinceCodeQueryHandler: GetCitiesByProvinceCodeQueryHandler,
    @inject(TOKENS.GetBarangaysByCityCodeQueryHandler)
    private getBarangaysByCityCodeQueryHandler: GetBarangaysByCityCodeQueryHandler,
    @inject(TOKENS.AddressValidationService)
    private validationService: AddressValidationService
  ) {}

  /**
   * GET /api/address/provinces - Get all provinces in the Philippines
   */
  @Get('/provinces')
  async getProvinces(): Promise<ProvinceListResponse> {
    const provinces = await this.getAllProvincesQueryHandler.execute();
    const provinceDtos = AddressMapper.provincesToDtoArray(provinces);

    return ApiResponseBuilder.success(provinceDtos);
  }

  /**
   * GET /api/address/cities/:provinceCode - Get cities/municipalities by province
   */
  @Get('/cities/:provinceCode')
  async getCities(@Param('provinceCode') provinceCode: string): Promise<CityListResponse> {
    // Validate the province code parameter
    const validatedProvinceCode = ProvinceCodeSchema.parse(provinceCode);
    
    // Validate using the validation service
    const validatedData = this.validationService.validateGetCitiesQuery({ 
      provinceCode: validatedProvinceCode 
    });
    
    const cities = await this.getCitiesByProvinceCodeQueryHandler.execute(validatedData.provinceCode);
    const cityDtos = AddressMapper.citiesToDtoArray(cities);

    return ApiResponseBuilder.success(cityDtos);
  }

  /**
   * GET /api/address/barangays/:cityCode - Get barangays by city/municipality
   */
  @Get('/barangays/:cityCode')
  async getBarangays(@Param('cityCode') cityCode: string): Promise<BarangayListResponse> {
    // Validate the city code parameter
    const validatedCityCode = CityCodeSchema.parse(cityCode);
    
    // Validate using the validation service
    const validatedData = this.validationService.validateGetBarangaysQuery({
      cityCode: validatedCityCode
    });
    
    const barangays = await this.getBarangaysByCityCodeQueryHandler.execute(validatedData.cityCode);
    const barangayDtos = AddressMapper.barangaysToDtoArray(barangays);

    return ApiResponseBuilder.success(barangayDtos);
  }
}