import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAppointmentStore } from './AppointmentStore';

// Extend vitest matchers
import '@testing-library/jest-dom';

// Simple mock for tsyringe container
vi.mock('tsyringe', () => ({
  container: {
    resolve: vi.fn(() => ({
      createAppointment: vi.fn(),
      updateAppointment: vi.fn(),
      deleteAppointment: vi.fn(),
      confirmAppointment: vi.fn(),
      cancelAppointment: vi.fn(),
      completeAppointment: vi.fn(),
      reconfirmAppointment: vi.fn(),
      getAllAppointments: vi.fn(),
      getTodayConfirmedAppointments: vi.fn(),
      getAppointmentsByPatientId: vi.fn(),
      getAppointmentById: vi.fn(),
    })),
  },
}));

describe('AppointmentStore Basic Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Initial State', () => {
    it('should have correct initial state', () => {
      const { result } = renderHook(() => useAppointmentStore());

      expect(result.current.appointments).toEqual([]);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
    });
  });

  describe('Utility Actions', () => {
    it('should clear error state', () => {
      const { result } = renderHook(() => useAppointmentStore());

      // Clear the error
      act(() => {
        result.current.clearError();
      });

      expect(result.current.error).toBeNull();
    });

    it('should set loading state', () => {
      const { result } = renderHook(() => useAppointmentStore());

      act(() => {
        result.current.setLoading(true);
      });

      expect(result.current.isLoading).toBe(true);

      act(() => {
        result.current.setLoading(false);
      });

      expect(result.current.isLoading).toBe(false);
    });
  });

  describe('getAppointmentsByDate', () => {
    it('should filter appointments by date', () => {
      const { result } = renderHook(() => useAppointmentStore());

      const mockAppointments = [
        {
          id: 'appointment-1',
          patientId: 'patient-1',
          reasonForVisit: 'Checkup',
          appointmentDate: '2024-01-15',
          appointmentTime: '10:00',
          doctorId: 'doctor-1',
          status: 'confirmed' as const,
          createdAt: '2024-01-01T10:00:00Z',
          updatedAt: '2024-01-01T10:00:00Z',
        },
        {
          id: 'appointment-2',
          patientId: 'patient-2',
          reasonForVisit: 'Follow-up',
          appointmentDate: '2024-01-16',
          appointmentTime: '11:00',
          doctorId: 'doctor-1',
          status: 'confirmed' as const,
          createdAt: '2024-01-01T11:00:00Z',
          updatedAt: '2024-01-01T11:00:00Z',
        },
      ];

      // Simulate having appointments in state
      act(() => {
        // Direct state manipulation for testing purposes
        const state = result.current as any;
        state.appointments = mockAppointments;
      });

      const dateFilteredAppointments = result.current.getAppointmentsByDate('2024-01-15');

      expect(dateFilteredAppointments).toHaveLength(1);
      expect(dateFilteredAppointments[0].id).toBe('appointment-1');
      expect(dateFilteredAppointments[0].appointmentDate).toBe('2024-01-15');
    });

    it('should return empty array when no appointments match date', () => {
      const { result } = renderHook(() => useAppointmentStore());

      const dateFilteredAppointments = result.current.getAppointmentsByDate('2024-01-20');

      expect(dateFilteredAppointments).toHaveLength(0);
    });
  });
});