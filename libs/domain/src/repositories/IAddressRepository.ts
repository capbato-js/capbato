import { Province } from '../entities/Province';
import { City } from '../entities/City';
import { Barangay } from '../entities/Barangay';

/**
 * Repository interface for Address operations
 * Following Clean Architecture - pure interface, no implementation details
 */
export interface IAddressRepository {
  /**
   * Get all provinces in the Philippines
   */
  getAllProvinces(): Promise<Province[]>;

  /**
   * Get cities/municipalities by province code
   */
  getCitiesByProvinceCode(provinceCode: string): Promise<City[]>;

  /**
   * Get barangays by city code  
   */
  getBarangaysByCityCode(cityCode: string): Promise<Barangay[]>;
}