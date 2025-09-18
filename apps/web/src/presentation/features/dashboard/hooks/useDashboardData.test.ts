import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useDashboardData } from './useDashboardData';
import { useDashboardViewModel } from '../view-models';

// Mock the view model
vi.mock('../view-models', () => ({
  useDashboardViewModel: vi.fn(),
}));

const mockUseDashboardViewModel = vi.mocked(useDashboardViewModel);

describe('useDashboardData', () => {
  const mockStats = {
    doctorName: 'Dr. John Doe',
    currentPatient: 'Jane Smith',
    totalAppointments: 5,
    totalAppointmentsDate: '2025-09-18',
  };

  const mockTodayAppointments = [
    {
      id: '1',
      patientNumber: 'P001',
      patientName: 'Jane Smith',
      reasonForVisit: 'Check-up',
      date: '2025-09-18',
      time: '10:00 AM',
      doctor: 'Dr. John Doe',
      status: 'confirmed' as const,
    },
  ];

  const mockLoadDashboardData = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    
    mockUseDashboardViewModel.mockReturnValue({
      stats: mockStats,
      todayAppointments: mockTodayAppointments,
      isLoading: false,
      isDoctorLoading: false,
      loadDashboardData: mockLoadDashboardData,
      error: null,
    });
  });

  it('should return dashboard data from view model', () => {
    const { result } = renderHook(() => useDashboardData());

    expect(result.current.stats).toEqual(mockStats);
    expect(result.current.todayAppointments).toEqual(mockTodayAppointments);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isDoctorLoading).toBe(false);
  });

  it('should call loadDashboardData on mount', () => {
    renderHook(() => useDashboardData());

    expect(mockLoadDashboardData).toHaveBeenCalledTimes(1);
  });

  it('should handle loading states correctly', () => {
    mockUseDashboardViewModel.mockReturnValue({
      stats: mockStats,
      todayAppointments: [],
      isLoading: true,
      isDoctorLoading: true,
      loadDashboardData: mockLoadDashboardData,
      error: null,
    });

    const { result } = renderHook(() => useDashboardData());

    expect(result.current.isLoading).toBe(true);
    expect(result.current.isDoctorLoading).toBe(true);
    expect(result.current.todayAppointments).toEqual([]);
  });

  it('should handle empty appointments list', () => {
    mockUseDashboardViewModel.mockReturnValue({
      stats: { ...mockStats, totalAppointments: 0 },
      todayAppointments: [],
      isLoading: false,
      isDoctorLoading: false,
      loadDashboardData: mockLoadDashboardData,
      error: null,
    });

    const { result } = renderHook(() => useDashboardData());

    expect(result.current.todayAppointments).toEqual([]);
    expect(result.current.stats.totalAppointments).toBe(0);
  });

  it('should re-run effect when hook is re-rendered', () => {
    const { rerender } = renderHook(() => useDashboardData());
    
    expect(mockLoadDashboardData).toHaveBeenCalledTimes(1);
    
    rerender();
    
    // Should not call again on re-render since dependency array is empty
    expect(mockLoadDashboardData).toHaveBeenCalledTimes(1);
  });
});