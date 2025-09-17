import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AddressApiService } from './AddressApiService';
import { IHttpClient } from '../http/IHttpClient';
import { 
  ProvinceDto, 
  CityDto, 
  BarangayDto,
  TOKENS
} from '@nx-starter/application-shared';

// Mock dependencies
vi.mock('./config/ApiConfig', () => ({
  getApiConfig: () => ({
    endpoints: {
      address: {
        provinces: '/api/address/provinces',
        cities: (provinceCode: string) => `/api/address/cities/${provinceCode}`,
        barangays: (cityCode: string) => `/api/address/barangays/${cityCode}`
      }
    }
  })
}));

describe('AddressApiService', () => {
  let addressService: AddressApiService;
  let mockHttpClient: IHttpClient;

  beforeEach(() => {
    mockHttpClient = {
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      delete: vi.fn()
    };

    addressService = new AddressApiService(mockHttpClient);
  });

  describe('getProvinces', () => {
    it('should fetch provinces successfully', async () => {
      const mockProvinces: ProvinceDto[] = [
        { code: 'ABRA', name: 'ABRA' },
        { code: 'BATAAN', name: 'BATAAN' },
        { code: 'CEBU', name: 'CEBU' }
      ];

      const mockResponse = {
        data: {
          success: true,
          data: mockProvinces
        }
      };

      vi.mocked(mockHttpClient.get).mockResolvedValue(mockResponse);

      const result = await addressService.getProvinces();

      expect(mockHttpClient.get).toHaveBeenCalledWith('/api/address/provinces');
      expect(result).toEqual(mockProvinces);
    });

    it('should throw error when API response is unsuccessful', async () => {
      const mockResponse = {
        data: {
          success: false,
          data: []
        }
      };

      vi.mocked(mockHttpClient.get).mockResolvedValue(mockResponse);

      await expect(addressService.getProvinces()).rejects.toThrow('Failed to fetch provinces');
    });

    it('should handle network errors', async () => {
      const networkError = new Error('Network connection failed');
      vi.mocked(mockHttpClient.get).mockRejectedValue(networkError);

      await expect(addressService.getProvinces()).rejects.toThrow('Failed to fetch provinces: Network connection failed');
    });

    it('should handle unknown errors', async () => {
      vi.mocked(mockHttpClient.get).mockRejectedValue('Unknown error');

      await expect(addressService.getProvinces()).rejects.toThrow('Failed to fetch provinces: Unknown error');
    });
  });

  describe('getCitiesByProvince', () => {
    it('should fetch cities successfully', async () => {
      const provinceCode = 'CEBU';
      const mockCities: CityDto[] = [
        { code: 'CEBU_CITY', name: 'CEBU CITY', provinceCode: 'CEBU' },
        { code: 'MANDAUE', name: 'MANDAUE CITY', provinceCode: 'CEBU' }
      ];

      const mockResponse = {
        data: {
          success: true,
          data: mockCities
        }
      };

      vi.mocked(mockHttpClient.get).mockResolvedValue(mockResponse);

      const result = await addressService.getCitiesByProvince(provinceCode);

      expect(mockHttpClient.get).toHaveBeenCalledWith('/api/address/cities/CEBU');
      expect(result).toEqual(mockCities);
    });

    it('should throw error when province code is empty', async () => {
      await expect(addressService.getCitiesByProvince('')).rejects.toThrow('Province code is required');
    });

    it('should throw error when province code is undefined', async () => {
      await expect(addressService.getCitiesByProvince(undefined as any)).rejects.toThrow('Province code is required');
    });

    it('should throw error when API response is unsuccessful', async () => {
      const mockResponse = {
        data: {
          success: false,
          data: []
        }
      };

      vi.mocked(mockHttpClient.get).mockResolvedValue(mockResponse);

      await expect(addressService.getCitiesByProvince('CEBU')).rejects.toThrow('Failed to fetch cities');
    });

    it('should handle network errors', async () => {
      const networkError = new Error('Network timeout');
      vi.mocked(mockHttpClient.get).mockRejectedValue(networkError);

      await expect(addressService.getCitiesByProvince('CEBU')).rejects.toThrow('Failed to fetch cities: Network timeout');
    });

    it('should handle unknown errors', async () => {
      vi.mocked(mockHttpClient.get).mockRejectedValue(null);

      await expect(addressService.getCitiesByProvince('CEBU')).rejects.toThrow('Failed to fetch cities: Unknown error');
    });
  });

  describe('getBarangaysByCity', () => {
    it('should fetch barangays successfully', async () => {
      const cityCode = 'CEBU_CITY';
      const mockBarangays: BarangayDto[] = [
        { code: 'LAHUG', name: 'LAHUG', cityCode: 'CEBU_CITY' },
        { code: 'CAPITOL_SITE', name: 'CAPITOL SITE', cityCode: 'CEBU_CITY' }
      ];

      const mockResponse = {
        data: {
          success: true,
          data: mockBarangays
        }
      };

      vi.mocked(mockHttpClient.get).mockResolvedValue(mockResponse);

      const result = await addressService.getBarangaysByCity(cityCode);

      expect(mockHttpClient.get).toHaveBeenCalledWith('/api/address/barangays/CEBU_CITY');
      expect(result).toEqual(mockBarangays);
    });

    it('should throw error when city code is empty', async () => {
      await expect(addressService.getBarangaysByCity('')).rejects.toThrow('City code is required');
    });

    it('should throw error when city code is undefined', async () => {
      await expect(addressService.getBarangaysByCity(undefined as any)).rejects.toThrow('City code is required');
    });

    it('should throw error when API response is unsuccessful', async () => {
      const mockResponse = {
        data: {
          success: false,
          data: []
        }
      };

      vi.mocked(mockHttpClient.get).mockResolvedValue(mockResponse);

      await expect(addressService.getBarangaysByCity('CEBU_CITY')).rejects.toThrow('Failed to fetch barangays');
    });

    it('should handle network errors', async () => {
      const networkError = new Error('Connection refused');
      vi.mocked(mockHttpClient.get).mockRejectedValue(networkError);

      await expect(addressService.getBarangaysByCity('CEBU_CITY')).rejects.toThrow('Failed to fetch barangays: Connection refused');
    });

    it('should handle unknown errors', async () => {
      vi.mocked(mockHttpClient.get).mockRejectedValue(42);

      await expect(addressService.getBarangaysByCity('CEBU_CITY')).rejects.toThrow('Failed to fetch barangays: Unknown error');
    });
  });

  describe('integration scenarios', () => {
    it('should handle successful address data flow', async () => {
      // Mock all three requests in sequence
      const mockProvincesResponse = {
        data: { success: true, data: [{ code: 'CEBU', name: 'CEBU' }] }
      };
      const mockCitiesResponse = {
        data: { success: true, data: [{ code: 'CEBU_CITY', name: 'CEBU CITY', provinceCode: 'CEBU' }] }
      };
      const mockBarangaysResponse = {
        data: { success: true, data: [{ code: 'LAHUG', name: 'LAHUG', cityCode: 'CEBU_CITY' }] }
      };

      vi.mocked(mockHttpClient.get)
        .mockResolvedValueOnce(mockProvincesResponse)
        .mockResolvedValueOnce(mockCitiesResponse)
        .mockResolvedValueOnce(mockBarangaysResponse);

      const provinces = await addressService.getProvinces();
      const cities = await addressService.getCitiesByProvince('CEBU');
      const barangays = await addressService.getBarangaysByCity('CEBU_CITY');

      expect(provinces).toHaveLength(1);
      expect(cities).toHaveLength(1);
      expect(barangays).toHaveLength(1);
      expect(mockHttpClient.get).toHaveBeenCalledTimes(3);
    });
  });
});