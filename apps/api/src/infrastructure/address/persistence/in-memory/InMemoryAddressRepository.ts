import { injectable } from 'tsyringe';
import { readFileSync } from 'fs';
import { join } from 'path';
import { Province, City, Barangay } from '@nx-starter/domain';
import type { IAddressRepository } from '@nx-starter/domain';

/**
 * In-memory implementation of IAddressRepository
 * Loads Philippine address data from JSON file
 */
@injectable()
export class InMemoryAddressRepository implements IAddressRepository {
  private philippinesData: any;
  private provinces: Province[] = [];
  private initialized = false;

  constructor() {
    this.initializeData();
  }

  private initializeData(): void {
    if (this.initialized) return;

    try {
      // Load the comprehensive Philippine address data
      // Handle different working directories: project root vs apps/api
      const isInProjectRoot = process.cwd().endsWith('capbato-js-cc');
      const dataPath = isInProjectRoot 
        ? join(process.cwd(), 'apps/api/src/data/philippines-complete.json')
        : join(process.cwd(), 'src/data/philippines-complete.json');
      this.philippinesData = JSON.parse(readFileSync(dataPath, 'utf8'));
      
      // Extract and create provinces
      const provincesMap = new Map<string, Province>();
      
      Object.keys(this.philippinesData).forEach(regionKey => {
        const region = this.philippinesData[regionKey];
        if (region.province_list) {
          Object.keys(region.province_list).forEach(provinceName => {
            const provinceCode = provinceName.replace(/\s+/g, '_').toUpperCase();
            if (!provincesMap.has(provinceCode)) {
              provincesMap.set(provinceCode, Province.create(provinceCode, provinceName));
            }
          });
        }
      });
      
      this.provinces = Array.from(provincesMap.values()).sort((a, b) => a.name.localeCompare(b.name));
      this.initialized = true;
    } catch (error) {
      console.error('Error initializing address data:', error);
      this.provinces = [];
    }
  }

  async getAllProvinces(): Promise<Province[]> {
    this.initializeData();
    return [...this.provinces];
  }

  async getCitiesByProvinceCode(provinceCode: string): Promise<City[]> {
    this.initializeData();
    
    try {
      // Convert province code back to province name for lookup
      const provinceName = provinceCode.replace(/_/g, ' ');
      const cities: City[] = [];
      
      Object.keys(this.philippinesData).forEach(regionKey => {
        const region = this.philippinesData[regionKey];
        if (region.province_list && region.province_list[provinceName]) {
          const municipalities = region.province_list[provinceName].municipality_list;
          Object.keys(municipalities).forEach(municipalityName => {
            const cityCode = municipalityName.replace(/\s+/g, '_').toLowerCase();
            cities.push(City.create(cityCode, municipalityName));
          });
        }
      });
      
      return cities.sort((a, b) => a.name.localeCompare(b.name));
    } catch (error) {
      console.error('Error fetching cities:', error);
      return [];
    }
  }

  async getBarangaysByCityCode(cityCode: string): Promise<Barangay[]> {
    this.initializeData();
    
    try {
      // Convert city code back to city name for lookup
      const cityName = cityCode.replace(/_/g, ' ').toUpperCase();
      let barangays: Barangay[] = [];
      
      Object.keys(this.philippinesData).forEach(regionKey => {
        const region = this.philippinesData[regionKey];
        if (region.province_list) {
          Object.keys(region.province_list).forEach(provinceName => {
            const municipalities = region.province_list[provinceName].municipality_list;
            if (municipalities && municipalities[cityName]) {
              const barangayList = municipalities[cityName].barangay_list;
              barangays = barangayList.map((barangayName: string, index: number) => {
                const barangayCode = `B${(index + 1).toString().padStart(3, '0')}`;
                return Barangay.create(barangayCode, barangayName);
              });
            }
          });
        }
      });
      
      return barangays.sort((a, b) => a.name.localeCompare(b.name));
    } catch (error) {
      console.error('Error fetching barangays:', error);
      return [];
    }
  }
}