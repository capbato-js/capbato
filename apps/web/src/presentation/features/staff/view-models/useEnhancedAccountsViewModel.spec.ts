import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useAccountsViewModel } from './useEnhancedAccountsViewModel';
import type { UpdateAccountData } from './useEnhancedAccountsViewModel';

// Mock the user store
const mockFetchUsers = vi.fn();
const mockClearStoreError = vi.fn();

vi.mock('../../../../infrastructure/state/UserStore', () => ({
  useUserStore: () => ({
    users: [
      {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        role: 'admin',
        mobile: '09123456789'
      },
      {
        id: '2',
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane@example.com',
        role: 'doctor',
        mobile: '09987654321'
      }
    ],
    isLoading: false,
    error: null,
    fetchUsers: mockFetchUsers,
    clearError: mockClearStoreError
  })
}));

// Mock the DI container
const mockUpdateUserDetailsUseCase = {
  execute: vi.fn()
};

const mockAuthCommandService = {
  register: vi.fn()
};

const mockDoctorApiService = {
  getDoctorByUserId: vi.fn()
};

vi.mock('../../../../infrastructure/di/container', () => ({
  container: {
    resolve: vi.fn((token) => {
      if (token === 'UpdateUserDetailsUseCase') {
        return mockUpdateUserDetailsUseCase;
      }
      if (token === 'AuthCommandService') {
        return mockAuthCommandService;
      }
      if (token === 'IDoctorApiService') {
        return mockDoctorApiService;
      }
      return {};
    })
  },
  TOKENS: {
    UpdateUserDetailsUseCase: 'UpdateUserDetailsUseCase',
    AuthCommandService: 'AuthCommandService',
    DoctorApiService: 'IDoctorApiService'
  }
}));

// Mock error utilities
vi.mock('../../../../infrastructure/utils/ErrorMapping', () => ({
  extractErrorMessage: (error: any) => error?.message || 'An error occurred',
  isApiError: (error: any) => !!error?.response
}));

describe('useAccountsViewModel', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should load accounts on mount', () => {
    const { result } = renderHook(() => useAccountsViewModel());
    
    expect(result.current.accounts).toHaveLength(2);
    expect(result.current.accounts[0]).toMatchObject({
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      role: 'admin',
      mobile: '09123456789'
    });
  });

  it('should update account successfully', async () => {
    mockUpdateUserDetailsUseCase.execute.mockResolvedValue({});
    mockFetchUsers.mockResolvedValue(undefined);

    const { result } = renderHook(() => useAccountsViewModel());

    const updateData: UpdateAccountData = {
      id: '1',
      firstName: 'Johnny',
      lastName: 'Doe',
      email: 'johnny@example.com',
      role: 'admin',
      mobile: '09123456789'
    };

    const success = await result.current.updateAccount(updateData);

    expect(success).toBe(true);
    expect(mockUpdateUserDetailsUseCase.execute).toHaveBeenCalledWith({
      id: '1',
      firstName: 'Johnny',
      lastName: 'Doe',
      email: 'johnny@example.com',
      role: 'admin',
      mobile: '09123456789',
      specialization: undefined,
      licenseNumber: undefined,
      experienceYears: undefined,
      schedulePattern: undefined
    });
    expect(mockFetchUsers).toHaveBeenCalled();
  });

  it('should update doctor account with profile fields', async () => {
    mockUpdateUserDetailsUseCase.execute.mockResolvedValue({});
    mockFetchUsers.mockResolvedValue(undefined);

    const { result } = renderHook(() => useAccountsViewModel());

    const updateData: UpdateAccountData = {
      id: '2',
      firstName: 'Dr. Jane',
      lastName: 'Smith',
      email: 'jane@example.com',
      role: 'doctor',
      mobile: '09987654321',
      specialization: 'Cardiology',
      licenseNumber: 'MD12345',
      experienceYears: 10,
      schedulePattern: 'MWF'
    };

    const success = await result.current.updateAccount(updateData);

    expect(success).toBe(true);
    expect(mockUpdateUserDetailsUseCase.execute).toHaveBeenCalledWith({
      id: '2',
      firstName: 'Dr. Jane',
      lastName: 'Smith',
      email: 'jane@example.com',
      role: 'doctor',
      mobile: '09987654321',
      specialization: 'Cardiology',
      licenseNumber: 'MD12345',
      experienceYears: 10,
      schedulePattern: 'MWF'
    });
  });

  it('should handle update errors', async () => {
    const error = new Error('Update failed');
    mockUpdateUserDetailsUseCase.execute.mockRejectedValue(error);

    const { result } = renderHook(() => useAccountsViewModel());

    const updateData: UpdateAccountData = {
      id: '1',
      firstName: 'Johnny',
      lastName: 'Doe',
      email: 'johnny@example.com',
      role: 'admin',
      mobile: '09123456789'
    };

    const success = await result.current.updateAccount(updateData);

    expect(success).toBe(false);
    expect(result.current.error).toBe('Update failed');
  });

  it('should handle validation errors', async () => {
    const validationError = {
      response: {
        data: {
          code: 'VALIDATION_ERROR',
          details: [
            { path: ['firstName'], message: 'First name is required' },
            { path: ['email'], message: 'Invalid email format' }
          ]
        }
      }
    };
    
    mockUpdateUserDetailsUseCase.execute.mockRejectedValue(validationError);

    const { result } = renderHook(() => useAccountsViewModel());

    const updateData: UpdateAccountData = {
      id: '1',
      firstName: '',
      lastName: 'Doe',
      email: 'invalid-email',
      role: 'admin'
    };

    const success = await result.current.updateAccount(updateData);

    expect(success).toBe(false);
    expect(result.current.fieldErrors).toEqual({
      firstName: 'First name is required',
      email: 'Invalid email format'
    });
    expect(result.current.error).toBeNull();
  });

  it('should clear errors', () => {
    const { result } = renderHook(() => useAccountsViewModel());

    // Manually set errors to test clearing
    result.current.clearError();
    result.current.clearFieldErrors();

    expect(mockClearStoreError).toHaveBeenCalled();
  });

  it('should transform users to accounts correctly', () => {
    const { result } = renderHook(() => useAccountsViewModel());

    expect(result.current.accounts[0]).toMatchObject({
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      role: 'admin',
      mobile: '09123456789',
      specialization: undefined,
      licenseNumber: undefined,
      experienceYears: undefined,
      schedulePattern: undefined
    });
  });

  it('should fetch doctor details successfully', async () => {
    const mockDoctorDetails = {
      id: 'doc-1',
      userId: '2',
      specialization: 'Cardiology',
      licenseNumber: 'MD12345',
      yearsOfExperience: 10,
      schedulePattern: 'MWF',
      firstName: 'Dr. Jane',
      lastName: 'Smith',
      fullName: 'Dr. Jane Smith',
      email: 'jane@example.com',
      contactNumber: '09987654321',
      formattedContactNumber: '09987654321',
      isActive: true,
      username: 'jane',
      role: 'doctor'
    };

    mockDoctorApiService.getDoctorByUserId.mockResolvedValue(mockDoctorDetails);

    const { result } = renderHook(() => useAccountsViewModel());

    const doctorDetails = await result.current.getDoctorDetails('2');

    expect(doctorDetails).toEqual(mockDoctorDetails);
    expect(mockDoctorApiService.getDoctorByUserId).toHaveBeenCalledWith('2');
  });

  it('should return null when doctor details fetch fails', async () => {
    mockDoctorApiService.getDoctorByUserId.mockRejectedValue(new Error('Doctor not found'));

    const { result } = renderHook(() => useAccountsViewModel());

    const doctorDetails = await result.current.getDoctorDetails('2');

    expect(doctorDetails).toBeNull();
    expect(mockDoctorApiService.getDoctorByUserId).toHaveBeenCalledWith('2');
  });
});