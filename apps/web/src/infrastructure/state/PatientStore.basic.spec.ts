import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { usePatientStore } from './PatientStore';

// Extend vitest matchers
import '@testing-library/jest-dom';

// Simple mock for DI container
vi.mock('../di/container', () => ({
  container: {
    resolve: vi.fn(() => ({
      getAllPatients: vi.fn(),
      getPatientById: vi.fn(),
      createPatient: vi.fn(),
      updatePatient: vi.fn(),
      deletePatient: vi.fn(),
    })),
  },
}));

// Mock the TOKENS
vi.mock('@nx-starter/application-shared', async () => {
  const actual = await vi.importActual('@nx-starter/application-shared');
  return {
    ...actual,
    TOKENS: {
      PatientApiService: 'PatientApiService',
    },
  };
});

describe('PatientStore Basic Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Initial State', () => {
    it('should have correct initial state', () => {
      const { result } = renderHook(() => usePatientStore());

      expect(result.current.patients).toEqual([]);
      expect(result.current.patientDetails).toEqual({});
      expect(result.current.status).toBe('idle');
      expect(result.current.patientDetailsStatus).toEqual({});
      expect(result.current.createPatientStatus).toBe('idle');
      expect(result.current.updatePatientStatus).toEqual({});
      expect(result.current.error).toBeNull();
      expect(result.current.patientDetailsErrors).toEqual({});
      expect(result.current.createPatientError).toBeNull();
      expect(result.current.updatePatientErrors).toEqual({});
    });
  });

  describe('Computed Values', () => {
    it('should compute loading state correctly', () => {
      const { result } = renderHook(() => usePatientStore());

      // Initially should not be loading
      expect(result.current.getIsLoading()).toBe(false);
      expect(result.current.getIsIdle()).toBe(true);
      expect(result.current.getHasError()).toBe(false);
    });

    it('should compute creating patient state correctly', () => {
      const { result } = renderHook(() => usePatientStore());

      // Initially should not be creating
      expect(result.current.getIsCreatingPatient()).toBe(false);
    });

    it('should compute patient details loading state correctly', () => {
      const { result } = renderHook(() => usePatientStore());

      // Initially should not be loading details for any patient
      expect(result.current.getIsLoadingPatientDetails('patient-1')).toBe(false);
    });
  });

  describe('State Management', () => {
    it('should update status correctly', () => {
      const { result } = renderHook(() => usePatientStore());

      act(() => {
        // Simulate setting loading state
        result.current.status = 'loading';
      });

      expect(result.current.getIsLoading()).toBe(true);
      expect(result.current.getIsIdle()).toBe(false);
      expect(result.current.getHasError()).toBe(false);
    });

    it('should handle error state correctly', () => {
      const { result } = renderHook(() => usePatientStore());

      act(() => {
        // Simulate setting error state
        result.current.status = 'failed';
        result.current.error = 'Test error';
      });

      expect(result.current.getIsLoading()).toBe(false);
      expect(result.current.getIsIdle()).toBe(false);
      expect(result.current.getHasError()).toBe(true);
      expect(result.current.error).toBe('Test error');
    });

    it('should handle create patient status correctly', () => {
      const { result } = renderHook(() => usePatientStore());

      act(() => {
        // Simulate creating patient
        result.current.createPatientStatus = 'loading';
      });

      expect(result.current.getIsCreatingPatient()).toBe(true);
    });

    it('should handle patient details status correctly', () => {
      const { result } = renderHook(() => usePatientStore());

      act(() => {
        // Simulate loading patient details
        result.current.patientDetailsStatus = { 'patient-1': 'loading' };
      });

      expect(result.current.getIsLoadingPatientDetails('patient-1')).toBe(true);
      expect(result.current.getIsLoadingPatientDetails('patient-2')).toBe(false);
    });
  });

  describe('Store Structure', () => {
    it('should have all required state properties', () => {
      const { result } = renderHook(() => usePatientStore());

      // Check that all expected properties exist
      expect(result.current).toHaveProperty('patients');
      expect(result.current).toHaveProperty('patientDetails');
      expect(result.current).toHaveProperty('status');
      expect(result.current).toHaveProperty('patientDetailsStatus');
      expect(result.current).toHaveProperty('createPatientStatus');
      expect(result.current).toHaveProperty('updatePatientStatus');
      expect(result.current).toHaveProperty('error');
      expect(result.current).toHaveProperty('patientDetailsErrors');
      expect(result.current).toHaveProperty('createPatientError');
      expect(result.current).toHaveProperty('updatePatientErrors');
    });

    it('should have all required computed functions', () => {
      const { result } = renderHook(() => usePatientStore());

      // Check that all expected computed functions exist
      expect(typeof result.current.getIsLoading).toBe('function');
      expect(typeof result.current.getIsIdle).toBe('function');
      expect(typeof result.current.getHasError).toBe('function');
      expect(typeof result.current.getIsLoadingPatientDetails).toBe('function');
      expect(typeof result.current.getIsCreatingPatient).toBe('function');
    });
  });

  describe('State Transitions', () => {
    it('should handle status transitions correctly', () => {
      const { result } = renderHook(() => usePatientStore());

      // First, ensure we can set and read status values
      act(() => {
        result.current.status = 'idle';
      });
      expect(result.current.status).toBe('idle');
      expect(result.current.getIsIdle()).toBe(true);

      act(() => {
        result.current.status = 'loading';
      });
      expect(result.current.status).toBe('loading');
      expect(result.current.getIsLoading()).toBe(true);
      expect(result.current.getIsIdle()).toBe(false);

      act(() => {
        result.current.status = 'succeeded';
      });
      expect(result.current.status).toBe('succeeded');
      expect(result.current.getIsLoading()).toBe(false);
      expect(result.current.getIsIdle()).toBe(false);
      expect(result.current.getHasError()).toBe(false);
    });

    it('should handle multiple patient details statuses', () => {
      const { result } = renderHook(() => usePatientStore());

      act(() => {
        result.current.patientDetailsStatus = {
          'patient-1': 'loading',
          'patient-2': 'succeeded',
          'patient-3': 'failed',
        };
      });

      expect(result.current.getIsLoadingPatientDetails('patient-1')).toBe(true);
      expect(result.current.getIsLoadingPatientDetails('patient-2')).toBe(false);
      expect(result.current.getIsLoadingPatientDetails('patient-3')).toBe(false);
      expect(result.current.getIsLoadingPatientDetails('patient-4')).toBe(false);
    });
  });
});