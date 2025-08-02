import { useState, useCallback, useEffect } from 'react';
import { container } from 'tsyringe';
import { TOKENS } from '@nx-starter/application-shared';
import { IAddressApiService } from '../../infrastructure/api/AddressApiService';
import type { ProvinceDto, CityDto, BarangayDto } from '@nx-starter/application-shared';

/**
 * Address Selection State Interface
 */
export interface AddressSelectionState {
  provinces: ProvinceDto[];
  cities: CityDto[];
  barangays: BarangayDto[];
  
  selectedProvince: string;
  selectedCity: string;
  selectedBarangay: string;
  
  isLoadingProvinces: boolean;
  isLoadingCities: boolean;
  isLoadingBarangays: boolean;
  
  error: string | null;
}

/**
 * Address Selector Hook Interface
 */
export interface IUseAddressSelector {
  // State
  provinces: ProvinceDto[];
  cities: CityDto[];
  barangays: BarangayDto[];
  
  selectedProvince: string;
  selectedCity: string;
  selectedBarangay: string;
  
  isLoadingProvinces: boolean;
  isLoadingCities: boolean;
  isLoadingBarangays: boolean;
  
  error: string | null;
  
  // Actions
  selectProvince: (provinceCode: string) => Promise<void>;
  selectCity: (cityCode: string) => Promise<void>;
  selectBarangay: (barangayCode: string) => void;
  clearSelection: () => void;
  clearError: () => void;
  
  // Utilities
  getSelectedAddressText: () => string;
  isProvincesEnabled: boolean;
  isCitiesEnabled: boolean;
  isBarangaysEnabled: boolean;
}

/**
 * Custom hook for managing Philippine address selection with cascading behavior
 * 
 * Provides:
 * - Automatic loading of provinces on mount
 * - Cascading selection: Province → City → Barangay
 * - Loading states for each level
 * - Error handling
 * - Clean state management
 * 
 * Usage:
 * ```tsx
 * const addressSelector = useAddressSelector();
 * 
 * // Handle province selection
 * await addressSelector.selectProvince('province-code');
 * 
 * // Handle city selection  
 * await addressSelector.selectCity('city-code');
 * 
 * // Handle barangay selection
 * addressSelector.selectBarangay('barangay-code');
 * ```
 */
export const useAddressSelector = (): IUseAddressSelector => {
  // Get Address API service
  const addressApiService = container.resolve<IAddressApiService>(TOKENS.AddressApiService);
  
  // State management
  const [state, setState] = useState<AddressSelectionState>({
    provinces: [],
    cities: [],
    barangays: [],
    
    selectedProvince: '',
    selectedCity: '',
    selectedBarangay: '',
    
    isLoadingProvinces: true,
    isLoadingCities: false,
    isLoadingBarangays: false,
    
    error: null,
  });
  
  /**
   * Load all provinces on component mount
   */
  const loadProvinces = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isLoadingProvinces: true, error: null }));
      
      const provinces = await addressApiService.getProvinces();
      
      setState(prev => ({
        ...prev,
        provinces,
        isLoadingProvinces: false,
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load provinces';
      setState(prev => ({
        ...prev,
        isLoadingProvinces: false,
        error: errorMessage,
      }));
    }
  }, [addressApiService]);
  
  /**
   * Load cities for selected province
   */
  const loadCities = useCallback(async (provinceCode: string) => {
    if (!provinceCode) return;
    
    try {
      setState(prev => ({ 
        ...prev, 
        isLoadingCities: true, 
        error: null,
        // Clear cities and barangays when loading new cities
        cities: [],
        barangays: [],
        selectedCity: '',
        selectedBarangay: '',
      }));
      
      const cities = await addressApiService.getCitiesByProvince(provinceCode);
      
      setState(prev => ({
        ...prev,
        cities,
        isLoadingCities: false,
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load cities';
      setState(prev => ({
        ...prev,
        isLoadingCities: false,
        error: errorMessage,
      }));
    }
  }, [addressApiService]);
  
  /**
   * Load barangays for selected city
   */
  const loadBarangays = useCallback(async (cityCode: string) => {
    if (!cityCode) return;
    
    try {
      setState(prev => ({ 
        ...prev, 
        isLoadingBarangays: true, 
        error: null,
        // Clear barangays when loading new ones
        barangays: [],
        selectedBarangay: '',
      }));
      
      const barangays = await addressApiService.getBarangaysByCity(cityCode);
      
      setState(prev => ({
        ...prev,
        barangays,
        isLoadingBarangays: false,
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load barangays';
      setState(prev => ({
        ...prev,
        isLoadingBarangays: false,
        error: errorMessage,
      }));
    }
  }, [addressApiService]);
  
  /**
   * Handle province selection
   */
  const selectProvince = useCallback(async (provinceCode: string) => {
    setState(prev => ({ ...prev, selectedProvince: provinceCode }));
    await loadCities(provinceCode);
  }, [loadCities]);
  
  /**
   * Handle city selection
   */
  const selectCity = useCallback(async (cityCode: string) => {
    setState(prev => ({ ...prev, selectedCity: cityCode }));
    await loadBarangays(cityCode);
  }, [loadBarangays]);
  
  /**
   * Handle barangay selection
   */
  const selectBarangay = useCallback((barangayCode: string) => {
    setState(prev => ({ ...prev, selectedBarangay: barangayCode }));
  }, []);
  
  /**
   * Clear all selections and reset to initial state
   */
  const clearSelection = useCallback(() => {
    setState(prev => ({
      ...prev,
      cities: [],
      barangays: [],
      selectedProvince: '',
      selectedCity: '',
      selectedBarangay: '',
      error: null,
    }));
  }, []);
  
  /**
   * Clear error state
   */
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);
  
  /**
   * Get formatted address text from selections
   */
  const getSelectedAddressText = useCallback((): string => {
    const parts: string[] = [];
    
    if (state.selectedBarangay) {
      const barangay = state.barangays.find(b => b.code === state.selectedBarangay);
      if (barangay) parts.push(barangay.name);
    }
    
    if (state.selectedCity) {
      const city = state.cities.find(c => c.code === state.selectedCity);
      if (city) parts.push(city.name);
    }
    
    if (state.selectedProvince) {
      const province = state.provinces.find(p => p.code === state.selectedProvince);
      if (province) parts.push(province.name);
    }
    
    return parts.join(', ');
  }, [state.provinces, state.cities, state.barangays, state.selectedProvince, state.selectedCity, state.selectedBarangay]);
  
  // Load provinces on mount
  useEffect(() => {
    loadProvinces();
  }, [loadProvinces]);
  
  // Computed properties for UI state
  const isProvincesEnabled = !state.isLoadingProvinces && state.provinces.length > 0;
  const isCitiesEnabled = !state.isLoadingCities && state.cities.length > 0 && state.selectedProvince !== '';
  const isBarangaysEnabled = !state.isLoadingBarangays && state.barangays.length > 0 && state.selectedCity !== '';
  
  return {
    // State
    provinces: state.provinces,
    cities: state.cities,
    barangays: state.barangays,
    
    selectedProvince: state.selectedProvince,
    selectedCity: state.selectedCity,
    selectedBarangay: state.selectedBarangay,
    
    isLoadingProvinces: state.isLoadingProvinces,
    isLoadingCities: state.isLoadingCities,
    isLoadingBarangays: state.isLoadingBarangays,
    
    error: state.error,
    
    // Actions
    selectProvince,
    selectCity,
    selectBarangay,
    clearSelection,
    clearError,
    
    // Utilities
    getSelectedAddressText,
    isProvincesEnabled,
    isCitiesEnabled,
    isBarangaysEnabled,
  };
};