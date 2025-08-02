import { beforeEach, describe, expect, it, vi } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { container } from 'tsyringe';
import { useAddressSelector } from './useAddressSelector';
import type { IAddressApiService } from '../../infrastructure/api/AddressApiService';
import type { ProvinceDto, CityDto, BarangayDto } from '@nx-starter/application-shared';

// Mock the container and API service
vi.mock('tsyringe');
const mockContainer = container as any;

// Mock data
const mockProvinces: ProvinceDto[] = [
  { code: 'province1', name: 'Province 1' },
  { code: 'province2', name: 'Province 2' },
];

const mockCities: CityDto[] = [
  { code: 'city1', name: 'City 1' },
  { code: 'city2', name: 'City 2' }, 
];

const mockBarangays: BarangayDto[] = [
  { code: 'barangay1', name: 'Barangay 1' },
  { code: 'barangay2', name: 'Barangay 2' },
];

// Mock API service
const mockAddressApiService = {
  getProvinces: vi.fn(),
  getCitiesByProvince: vi.fn(),
  getBarangaysByCity: vi.fn(),
};

describe('useAddressSelector', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockContainer.resolve = vi.fn().mockReturnValue(mockAddressApiService);
    
    // Setup default successful responses
    mockAddressApiService.getProvinces.mockResolvedValue(mockProvinces);
    mockAddressApiService.getCitiesByProvince.mockResolvedValue(mockCities);
    mockAddressApiService.getBarangaysByCity.mockResolvedValue(mockBarangays);
  });

  it('should initialize with correct default state', () => {
    const { result } = renderHook(() => useAddressSelector());

    expect(result.current.provinces).toEqual([]);
    expect(result.current.cities).toEqual([]);
    expect(result.current.barangays).toEqual([]);
    expect(result.current.selectedProvince).toBe('');
    expect(result.current.selectedCity).toBe('');
    expect(result.current.selectedBarangay).toBe('');
    expect(result.current.isLoadingProvinces).toBe(true);
    expect(result.current.isLoadingCities).toBe(false);
    expect(result.current.isLoadingBarangays).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should load provinces on mount', async () => {
    const { result } = renderHook(() => useAddressSelector());

    await waitFor(() => {
      expect(result.current.isLoadingProvinces).toBe(false);
    });

    expect(result.current.provinces).toEqual(mockProvinces);
    expect(mockAddressApiService.getProvinces).toHaveBeenCalledTimes(1);
  });

  it('should handle province selection and load cities', async () => {
    const { result } = renderHook(() => useAddressSelector());

    // Wait for initial provinces to load
    await waitFor(() => {
      expect(result.current.isLoadingProvinces).toBe(false);
    });

    // Select a province
    await act(async () => {
      await result.current.selectProvince('province1');
    });

    await waitFor(() => {
      expect(result.current.isLoadingCities).toBe(false);
    });

    expect(result.current.selectedProvince).toBe('province1');
    expect(result.current.cities).toEqual(mockCities);
    expect(mockAddressApiService.getCitiesByProvince).toHaveBeenCalledWith('province1');
  });

  it('should handle city selection and load barangays', async () => {
    const { result } = renderHook(() => useAddressSelector());

    // Wait for initial load
    await waitFor(() => {
      expect(result.current.isLoadingProvinces).toBe(false);
    });

    // Select province first
    await act(async () => {
      await result.current.selectProvince('province1');
    });

    await waitFor(() => {
      expect(result.current.isLoadingCities).toBe(false);
    });

    // Now select city
    await act(async () => {
      await result.current.selectCity('city1');
    });

    await waitFor(() => {
      expect(result.current.isLoadingBarangays).toBe(false);
    });

    expect(result.current.selectedCity).toBe('city1');
    expect(result.current.barangays).toEqual(mockBarangays);
    expect(mockAddressApiService.getBarangaysByCity).toHaveBeenCalledWith('city1');
  });

  it('should handle barangay selection', async () => {
    const { result } = renderHook(() => useAddressSelector());

    // Wait for initial load
    await waitFor(() => {
      expect(result.current.isLoadingProvinces).toBe(false);
    });

    act(() => {
      result.current.selectBarangay('barangay1');
    });

    expect(result.current.selectedBarangay).toBe('barangay1');
  });

  it('should clear dependent selections when province changes', async () => {
    const { result } = renderHook(() => useAddressSelector());

    // Wait for initial load
    await waitFor(() => {
      expect(result.current.isLoadingProvinces).toBe(false);
    });

    // Select province and city first
    await act(async () => {
      await result.current.selectProvince('province1');
    });

    await waitFor(() => {
      expect(result.current.isLoadingCities).toBe(false);
    });

    await act(async () => {
      await result.current.selectCity('city1');
    });

    // Select different province - this should clear cities and barangays temporarily
    await act(async () => {
      await result.current.selectProvince('province2');
    });

    // Wait for the new cities to load
    await waitFor(() => {
      expect(result.current.isLoadingCities).toBe(false);
    });

    expect(result.current.selectedProvince).toBe('province2');
    expect(result.current.selectedCity).toBe('');
    expect(result.current.selectedBarangay).toBe('');
    // Cities should be loaded for the new province, not empty
    expect(result.current.cities).toEqual(mockCities);
    expect(result.current.barangays).toEqual([]);
  });

  it('should handle API errors gracefully', async () => {
    mockAddressApiService.getProvinces.mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useAddressSelector());

    await waitFor(() => {
      expect(result.current.isLoadingProvinces).toBe(false);
    });

    expect(result.current.error).toBe('Network error');
    expect(result.current.provinces).toEqual([]);
  });

  it('should clear all selections', async () => {
    const { result } = renderHook(() => useAddressSelector());

    // Wait for initial load and make selections
    await waitFor(() => {
      expect(result.current.isLoadingProvinces).toBe(false);
    });

    await act(async () => {
      await result.current.selectProvince('province1');
    });

    await waitFor(() => {
      expect(result.current.isLoadingCities).toBe(false);
    });

    await act(async () => {
      await result.current.selectCity('city1');
    });

    act(() => {
      result.current.selectBarangay('barangay1');
    });

    // Clear all selections
    act(() => {
      result.current.clearSelection();
    });

    expect(result.current.selectedProvince).toBe('');
    expect(result.current.selectedCity).toBe('');
    expect(result.current.selectedBarangay).toBe('');
    expect(result.current.cities).toEqual([]);
    expect(result.current.barangays).toEqual([]);
  });

  it('should generate formatted address text', async () => {
    const { result } = renderHook(() => useAddressSelector());

    // Wait for initial load
    await waitFor(() => {
      expect(result.current.isLoadingProvinces).toBe(false);
    });

    // Make full selection
    await act(async () => {
      await result.current.selectProvince('province1');
    });

    await waitFor(() => {
      expect(result.current.isLoadingCities).toBe(false);
    });

    await act(async () => {
      await result.current.selectCity('city1');
    });

    await waitFor(() => {
      expect(result.current.isLoadingBarangays).toBe(false);
    });

    act(() => {
      result.current.selectBarangay('barangay1');
    });

    const addressText = result.current.getSelectedAddressText();
    expect(addressText).toBe('Barangay 1, City 1, Province 1');
  });

  it('should provide correct enabled states', async () => {
    const { result } = renderHook(() => useAddressSelector());

    // Initially only provinces should be enabled after loading
    await waitFor(() => {
      expect(result.current.isLoadingProvinces).toBe(false);
    });

    expect(result.current.isProvincesEnabled).toBe(true);
    expect(result.current.isCitiesEnabled).toBe(false);
    expect(result.current.isBarangaysEnabled).toBe(false);

    // After selecting province, cities should be enabled
    await act(async () => {
      await result.current.selectProvince('province1');
    });

    await waitFor(() => {
      expect(result.current.isLoadingCities).toBe(false);
    });

    expect(result.current.isCitiesEnabled).toBe(true);
    expect(result.current.isBarangaysEnabled).toBe(false);

    // After selecting city, barangays should be enabled
    await act(async () => {
      await result.current.selectCity('city1');
    });

    await waitFor(() => {
      expect(result.current.isLoadingBarangays).toBe(false);
    });

    expect(result.current.isBarangaysEnabled).toBe(true);
  });
});