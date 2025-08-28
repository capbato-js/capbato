import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAddLabTestFormViewModel } from './useAddLabTestFormViewModel';
import { useLaboratoryStore } from '../../../../infrastructure/state/LaboratoryStore';

// Mock the laboratory store
vi.mock('../../../../infrastructure/state/LaboratoryStore');

// Mock react-router-dom
const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

describe('useAddLabTestFormViewModel', () => {
  let mockCreateLabRequest: ReturnType<typeof vi.fn>;
  let mockFetchAllLabRequests: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockCreateLabRequest = vi.fn();
    mockFetchAllLabRequests = vi.fn();

    (useLaboratoryStore as any).mockReturnValue({
      createLabRequest: mockCreateLabRequest,
      fetchAllLabRequests: mockFetchAllLabRequests,
    });

    // Reset the navigate mock
    mockNavigate.mockClear();
  });

  it('should initialize with correct default values', () => {
    const { result } = renderHook(() => useAddLabTestFormViewModel());

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(typeof result.current.handleFormSubmit).toBe('function');
    expect(typeof result.current.handleCancel).toBe('function');
  });

  it('should handle form submission successfully', async () => {
    mockCreateLabRequest.mockResolvedValue(true);
    const { result } = renderHook(() => useAddLabTestFormViewModel());

    const formData = {
      patientName: 'test-patient-id',
      ageGender: '30/M',
      requestDate: '2024-01-01',
      selectedTests: ['routine_cbc_with_platelet', 'blood_chemistry_fbs', 'serology_dengue_ns1'],
      otherTests: 'Additional tests',
    };

    await act(async () => {
      await result.current.handleFormSubmit(formData);
    });

    expect(mockCreateLabRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        patientId: 'test-patient-id',
        requestDate: new Date('2024-01-01'),
        others: 'Additional tests',
        routine: {
          cbcWithPlatelet: true,
        },
        bloodChemistry: {
          fbs: true,
        },
        serology: {
          dengueNs1: true,
        },
      })
    );
    expect(mockFetchAllLabRequests).toHaveBeenCalled();
  });

  it('should handle form submission with new lab tests', async () => {
    mockCreateLabRequest.mockResolvedValue(true);
    const { result } = renderHook(() => useAddLabTestFormViewModel());

    const formData = {
      patientName: 'test-patient-id',
      ageGender: '25/F',
      requestDate: '2024-01-01',
      selectedTests: ['serology_hepatitis_c_screening', 'serology_crp', 'serology_aso', 'serology_ra_rf', 'serology_tumor_markers', 'serology_beta_hcg'],
      otherTests: '',
    };

    await act(async () => {
      await result.current.handleFormSubmit(formData);
    });

    expect(mockCreateLabRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        patientId: 'test-patient-id',
        requestDate: new Date('2024-01-01'),
        serology: {
          hepatitisCScreening: true,
          crp: true,
          aso: true,
          raRf: true,
          tumorMarkers: true,
          betaHcg: true,
        },
      })
    );
  });

  it('should handle form submission error', async () => {
    mockCreateLabRequest.mockRejectedValue(new Error('Network error'));
    const { result } = renderHook(() => useAddLabTestFormViewModel());

    const formData = {
      patientName: 'test-patient-id',
      ageGender: '30/M',
      requestDate: '2024-01-01',
      selectedTests: ['routine_cbc_with_platelet'],
    };

    await act(async () => {
      await result.current.handleFormSubmit(formData);
    });

    expect(result.current.error).toBe('Network error');
    expect(result.current.isLoading).toBe(false);
  });

  it('should handle cancel navigation', () => {
    const { result } = renderHook(() => useAddLabTestFormViewModel());

    act(() => {
      result.current.handleCancel();
    });

    expect(mockNavigate).toHaveBeenCalledWith('/laboratory');
  });
});