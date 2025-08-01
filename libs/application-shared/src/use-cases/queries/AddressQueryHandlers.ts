import { injectable, inject } from 'tsyringe';
import type { Province, City, Barangay, IAddressRepository } from '@nx-starter/domain';
import { TOKENS } from '../../di/tokens';

/**
 * Query handler for getting all provinces
 */
@injectable()
export class GetAllProvincesQueryHandler {
  constructor(
    @inject(TOKENS.AddressRepository) private addressRepository: IAddressRepository
  ) {}

  async execute(): Promise<Province[]> {
    return await this.addressRepository.getAllProvinces();
  }
}

/**
 * Query handler for getting cities by province code
 */
@injectable()
export class GetCitiesByProvinceCodeQueryHandler {
  constructor(
    @inject(TOKENS.AddressRepository) private addressRepository: IAddressRepository
  ) {}

  async execute(provinceCode: string): Promise<City[]> {
    return await this.addressRepository.getCitiesByProvinceCode(provinceCode);
  }
}

/**
 * Query handler for getting barangays by city code
 */
@injectable()
export class GetBarangaysByCityCodeQueryHandler {
  constructor(
    @inject(TOKENS.AddressRepository) private addressRepository: IAddressRepository
  ) {}

  async execute(cityCode: string): Promise<Barangay[]> {
    return await this.addressRepository.getBarangaysByCityCode(cityCode);
  }
}