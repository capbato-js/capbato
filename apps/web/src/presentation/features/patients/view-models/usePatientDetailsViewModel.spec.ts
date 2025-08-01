import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { usePatientDetailsViewModel } from './usePatientDetailsViewModel';
import type { PatientDto } from '@nx-starter/application-shared';

// Mock the patient store
const mockPatientStore = {
  getIsLoadingPatientDetails: vi.fn(() => false),
  getPatientDetailsError: vi.fn(() => null),
  getPatientDetails: vi.fn(() => undefined),
  loadPatientById: vi.fn(),
  clearPatientDetailsError: vi.fn(),
  patientDetails: {}
};

vi.mock('../../../../infrastructure/state/PatientStore', () => ({
  usePatientStore: () => mockPatientStore
}));

const mockPatientDto: PatientDto = {
  id: '1',
  patientNumber: 'P001',
  firstName: 'Maria',
  lastName: 'Santos',
  middleName: undefined,
  dateOfBirth: '1990-05-15',
  age: 34,
  gender: 'Female',
  contactNumber: '+63 912 345 6789',
  houseNumber: '123',
  streetName: 'Rizal Street',
  province: 'Metro Manila',
  cityMunicipality: 'Quezon City',
  barangay: 'Barangay 123',
  address: '123 Rizal Street, Quezon City, Metro Manila',
  guardianName: 'Roberto Santos',
  guardianGender: 'Male',
  guardianRelationship: 'Father',
  guardianContactNumber: '9171234567',
  guardianHouseNumber: '123',
  guardianStreetName: 'Rizal Street',
  guardianProvince: 'Metro Manila',
  guardianCityMunicipality: 'Quezon City',
  guardianBarangay: 'Barangay 123',
  guardianAddress: '123 Rizal Street, Quezon City, Metro Manila',
  createdAt: '2024-01-15T09:00:00.000Z',
  updatedAt: '2024-12-15T14:30:00.000Z'
};

describe('usePatientDetailsViewModel', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset mock functions
    mockPatientStore.getIsLoadingPatientDetails.mockReturnValue(false);
    mockPatientStore.getPatientDetailsError.mockReturnValue(null);
    mockPatientStore.getPatientDetails.mockReturnValue(undefined);
    mockPatientStore.loadPatientById.mockResolvedValue(undefined);
  });

  it('should initialize with loading state when patient ID is provided and no cached data', () => {
    mockPatientStore.getIsLoadingPatientDetails.mockReturnValue(true);

    const { result } = renderHook(() => usePatientDetailsViewModel('1'));

    expect(result.current.isLoading).toBe(true);
    expect(result.current.patient).toBeUndefined();
    expect(result.current.error).toBe(null);
    expect(result.current.hasPatient).toBe(false);
    expect(result.current.hasError).toBe(false);
  });

  it('should load patient details successfully from cache', async () => {
    mockPatientStore.getPatientDetails.mockReturnValue(mockPatientDto);

    const { result } = renderHook(() => usePatientDetailsViewModel('1'));

    await waitFor(() => {
      expect(result.current.patient).toBeDefined();
    });

    expect(result.current.patient?.id).toBe('1');
    expect(result.current.patient?.patientNumber).toBe('P001');
    expect(result.current.patient?.fullName).toBe('Maria Santos');
    expect(result.current.patient?.guardian?.fullName).toBe('Roberto Santos');
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(result.current.hasPatient).toBe(true);
    expect(result.current.hasError).toBe(false);
  });

  it('should handle patient not found error', async () => {
    mockPatientStore.getPatientDetailsError.mockReturnValue('Patient with ID "999" not found');

    const { result } = renderHook(() => usePatientDetailsViewModel('999'));

    await waitFor(() => {
      expect(result.current.hasError).toBe(true);
    });

    expect(result.current.patient).toBeUndefined();
    expect(result.current.error).toBe('Patient with ID "999" not found');
    expect(result.current.hasPatient).toBe(false);
    expect(result.current.hasError).toBe(true);
  });

  it('should handle missing patient ID', async () => {
    const { result } = renderHook(() => usePatientDetailsViewModel(undefined));

    await waitFor(() => {
      expect(result.current.hasError).toBe(true);
    });

    expect(result.current.patient).toBeUndefined();
    expect(result.current.error).toBe('Patient ID is required');
    expect(result.current.hasPatient).toBe(false);
    expect(result.current.hasError).toBe(true);
  });

  it('should clear error', async () => {
    mockPatientStore.getPatientDetailsError.mockReturnValue('Some error');

    const { result } = renderHook(() => usePatientDetailsViewModel('1'));

    await waitFor(() => {
      expect(result.current.hasError).toBe(true);
    });

    result.current.clearError();

    expect(mockPatientStore.clearPatientDetailsError).toHaveBeenCalledWith('1');
  });

  it('should refresh patient details', async () => {
    const { result } = renderHook(() => usePatientDetailsViewModel('1'));

    await result.current.refreshPatientDetails();

    expect(mockPatientStore.loadPatientById).toHaveBeenCalledWith('1');
  });

  it('should load from API when not cached', async () => {
    mockPatientStore.getPatientDetails.mockReturnValue(undefined);

    const { result } = renderHook(() => usePatientDetailsViewModel('1'));

    await waitFor(() => {
      expect(mockPatientStore.loadPatientById).toHaveBeenCalledWith('1');
    });
  });
});