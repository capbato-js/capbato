import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useDashboardViewModel } from './useDashboardViewModel';
import type { AppointmentDto } from '@nx-starter/application-shared';

// Mock dayjs
vi.mock('dayjs', () => {
  const mockDayjs = vi.fn(() => ({
    tz: vi.fn(() => ({
      format: vi.fn(() => 'Sep 18, 2025'),
      startOf: vi.fn(() => ({
        isSame: vi.fn(() => true),
      })),
      isSameOrBefore: vi.fn(() => true),
      valueOf: vi.fn(() => 1695024000000),
    })),
    startOf: vi.fn(() => ({
      isSame: vi.fn(() => true),
    })),
    isSameOrBefore: vi.fn(() => true),
    valueOf: vi.fn(() => 1695024000000),
  }));
  
  Object.assign(mockDayjs, {
    extend: vi.fn(),
    tz: vi.fn(() => ({
      format: vi.fn(() => 'Sep 18, 2025'),
      startOf: vi.fn(() => ({
        isSame: vi.fn(() => true),
      })),
      isSameOrBefore: vi.fn(() => true),
      valueOf: vi.fn(() => 1695024000000),
    })),
  });
  
  return { default: mockDayjs };
});

// Mock the AppointmentStore
const mockAppointmentStore = {
  appointments: [] as AppointmentDto[],
  fetchTodayConfirmedAppointments: vi.fn(),
  isLoading: false,
  error: null as string | null,
};

vi.mock('../../../../infrastructure/state/AppointmentStore', () => ({
  useAppointmentStore: () => mockAppointmentStore,
}));

// Mock the DoctorAssignmentService - define before it's used
const mockDoctorInstance = {
  clearCache: vi.fn(),
  getAssignedDoctorForDate: vi.fn(),
};

vi.mock('../../appointments/services/DoctorAssignmentService', () => ({
  doctorAssignmentService: {
    getInstance: () => mockDoctorInstance,
  },
}));

describe('useDashboardViewModel', () => {
  const mockAppointmentDto: AppointmentDto = {
    id: '1',
    appointmentDate: '2025-09-18',
    appointmentTime: '10:00 AM',
    reasonForVisit: 'Check-up',
    status: 'confirmed',
    patient: {
      id: 'patient-1',
      patientNumber: 'P001',
      fullName: 'Jane Smith',
      firstName: 'Jane',
      lastName: 'Smith',
    },
    doctor: {
      id: 'doctor-1',
      fullName: 'Dr. John Doe',
      firstName: 'John',
      lastName: 'Doe',
      specialization: 'General Medicine',
    },
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Reset mock implementations
    mockAppointmentStore.appointments = [];
    mockAppointmentStore.isLoading = false;
    mockAppointmentStore.error = null;
    mockAppointmentStore.fetchTodayConfirmedAppointments.mockResolvedValue(undefined);
    
    mockDoctorInstance.getAssignedDoctorForDate.mockResolvedValue({
      id: 'doctor-1',
      fullName: 'Dr. John Doe',
    });
  });

  it('should initialize with default stats', () => {
    const { result } = renderHook(() => useDashboardViewModel());

    expect(result.current.stats).toEqual({
      doctorName: 'No Doctor Assigned',
      currentPatient: 'N/A',
      totalAppointments: 0,
      totalAppointmentsDate: 'Sep 18, 2025',
    });
    expect(result.current.todayAppointments).toEqual([]);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isDoctorLoading).toBe(true);
    expect(result.current.error).toBe(null);
  });

  it('should load dashboard data and update stats', async () => {
    mockAppointmentStore.appointments = [mockAppointmentDto];
    
    const { result } = renderHook(() => useDashboardViewModel());

    await waitFor(() => {
      expect(result.current.isDoctorLoading).toBe(false);
    });

    expect(result.current.stats.doctorName).toBe('Dr. John Doe (Assigned)');
    expect(result.current.stats.totalAppointments).toBe(1);
    expect(result.current.todayAppointments).toHaveLength(1);
    expect(result.current.todayAppointments[0]).toEqual({
      id: '1',
      patientNumber: 'P001',
      patientName: 'Jane Smith',
      reasonForVisit: 'Check-up',
      date: '2025-09-18',
      time: '10:00 AM',
      doctor: 'Dr. John Doe',
      status: 'confirmed',
    });
  });

  it('should handle doctor assignment service error', async () => {
    mockDoctorInstance.getAssignedDoctorForDate.mockRejectedValue(new Error('Service error'));

    const { result } = renderHook(() => useDashboardViewModel());

    await waitFor(() => {
      expect(result.current.isDoctorLoading).toBe(false);
    });

    expect(result.current.stats.doctorName).toBe('Error loading doctor assignment');
  });

  it('should handle no assigned doctor', async () => {
    mockDoctorInstance.getAssignedDoctorForDate.mockResolvedValue(null);

    const { result } = renderHook(() => useDashboardViewModel());

    await waitFor(() => {
      expect(result.current.isDoctorLoading).toBe(false);
    });

    expect(result.current.stats.doctorName).toBe('No Doctor Assigned');
  });

  it('should handle appointment data with missing patient info', async () => {
    const appointmentWithoutPatient: AppointmentDto = {
      ...mockAppointmentDto,
      patient: undefined,
      doctor: undefined,
    };
    
    mockAppointmentStore.appointments = [appointmentWithoutPatient];

    const { result } = renderHook(() => useDashboardViewModel());

    await waitFor(() => {
      expect(result.current.todayAppointments).toHaveLength(1);
    });

    expect(result.current.todayAppointments[0]).toEqual({
      id: '1',
      patientNumber: 'Unknown',
      patientName: 'Unknown Patient',
      reasonForVisit: 'Check-up',
      date: '2025-09-18',
      time: '10:00 AM',
      doctor: 'Unknown Doctor',
      status: 'confirmed',
    });
  });

  it('should call loadDashboardData and fetch appointments', async () => {
    const { result } = renderHook(() => useDashboardViewModel());

    await result.current.loadDashboardData();

    expect(mockAppointmentStore.fetchTodayConfirmedAppointments).toHaveBeenCalledTimes(1);
    expect(mockDoctorInstance.clearCache).toHaveBeenCalled();
  });

  it('should handle loading states correctly', () => {
    mockAppointmentStore.isLoading = true;

    const { result } = renderHook(() => useDashboardViewModel());

    expect(result.current.isLoading).toBe(true);
  });

  it('should handle error states correctly', () => {
    mockAppointmentStore.error = 'Failed to fetch appointments';

    const { result } = renderHook(() => useDashboardViewModel());

    expect(result.current.error).toBe('Failed to fetch appointments');
  });

  it('should return correct function types', () => {
    const { result } = renderHook(() => useDashboardViewModel());

    expect(typeof result.current.loadDashboardData).toBe('function');
    expect(result.current.stats).toBeDefined();
    expect(Array.isArray(result.current.todayAppointments)).toBe(true);
  });
});