import { injectable, inject } from 'tsyringe';
import { 
  ProvinceDto, 
  CityDto, 
  BarangayDto,
  ProvinceListResponse,
  CityListResponse,
  BarangayListResponse,
  TOKENS
} from '@nx-starter/application-shared';
import { IHttpClient } from '../http/IHttpClient';
import { getApiConfig } from './config/ApiConfig';

/**
 * Address API Service Interface
 * Defines contract for Philippine address data operations
 */
export interface IAddressApiService {
  getProvinces(): Promise<ProvinceDto[]>;
  getCitiesByProvince(provinceCode: string): Promise<CityDto[]>;
  getBarangaysByCity(cityCode: string): Promise<BarangayDto[]>;
}

/**
 * Address API Service Implementation
 * Handles communication with Address API endpoints
 * 
 * Following Clean Architecture:
 * - Infrastructure layer implementation
 * - Handles external API communication
 * - Implements interface defined in application layer
 */
@injectable()
export class AddressApiService implements IAddressApiService {
  private readonly apiConfig = getApiConfig();

  constructor(
    @inject(TOKENS.HttpClient) private readonly httpClient: IHttpClient
  ) {}

  /**
   * Get all provinces in the Philippines
   */
  async getProvinces(): Promise<ProvinceDto[]> {
    try {
      const response = await this.httpClient.get<ProvinceListResponse>(
        this.apiConfig.endpoints.address.provinces
      );
      
      if (response.data.success) {
        return response.data.data;
      }
      
      throw new Error('Failed to fetch provinces');
    } catch (error) {
      console.error('Error fetching provinces:', error);
      
      if (error instanceof Error) {
        throw new Error(`Failed to fetch provinces: ${error.message}`);
      }
      
      throw new Error('Failed to fetch provinces: Unknown error');
    }
  }

  /**
   * Get cities/municipalities by province code
   */
  async getCitiesByProvince(provinceCode: string): Promise<CityDto[]> {
    if (!provinceCode) {
      throw new Error('Province code is required');
    }

    try {
      const response = await this.httpClient.get<CityListResponse>(
        this.apiConfig.endpoints.address.cities(provinceCode)
      );
      
      if (response.data.success) {
        return response.data.data;
      }
      
      throw new Error('Failed to fetch cities');
    } catch (error) {
      console.error('Error fetching cities for province:', provinceCode, error);
      
      if (error instanceof Error) {
        throw new Error(`Failed to fetch cities: ${error.message}`);
      }
      
      throw new Error('Failed to fetch cities: Unknown error');
    }
  }

  /**
   * Get barangays by city/municipality code
   */
  async getBarangaysByCity(cityCode: string): Promise<BarangayDto[]> {
    if (!cityCode) {
      throw new Error('City code is required');
    }

    try {
      const response = await this.httpClient.get<BarangayListResponse>(
        this.apiConfig.endpoints.address.barangays(cityCode)
      );
      
      if (response.data.success) {
        return response.data.data;
      }
      
      throw new Error('Failed to fetch barangays');
    } catch (error) {
      console.error('Error fetching barangays for city:', cityCode, error);
      
      if (error instanceof Error) {
        throw new Error(`Failed to fetch barangays: ${error.message}`);
      }
      
      throw new Error('Failed to fetch barangays: Unknown error');
    }
  }
}