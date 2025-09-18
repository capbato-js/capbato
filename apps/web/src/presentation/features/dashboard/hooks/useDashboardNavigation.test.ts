import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { useDashboardNavigation } from './useDashboardNavigation';

// Mock react-router-dom
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('useDashboardNavigation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => 
    React.createElement(BrowserRouter, null, children);

  it('should return navigation functions', () => {
    const { result } = renderHook(() => useDashboardNavigation(), { wrapper });

    expect(result.current.handleSeeAllAppointments).toBeDefined();
    expect(typeof result.current.handleSeeAllAppointments).toBe('function');
  });

  it('should navigate to appointments page when handleSeeAllAppointments is called', () => {
    const { result } = renderHook(() => useDashboardNavigation(), { wrapper });

    act(() => {
      result.current.handleSeeAllAppointments();
    });

    expect(mockNavigate).toHaveBeenCalledWith('/appointments');
    expect(mockNavigate).toHaveBeenCalledTimes(1);
  });

  it('should call navigate multiple times if function is called multiple times', () => {
    const { result } = renderHook(() => useDashboardNavigation(), { wrapper });

    act(() => {
      result.current.handleSeeAllAppointments();
      result.current.handleSeeAllAppointments();
    });

    expect(mockNavigate).toHaveBeenCalledWith('/appointments');
    expect(mockNavigate).toHaveBeenCalledTimes(2);
  });

  it('should maintain consistent navigation behavior across re-renders', () => {
    const { result, rerender } = renderHook(() => useDashboardNavigation(), { wrapper });

    act(() => {
      result.current.handleSeeAllAppointments();
    });

    expect(mockNavigate).toHaveBeenCalledTimes(1);

    rerender();

    act(() => {
      result.current.handleSeeAllAppointments();
    });

    expect(mockNavigate).toHaveBeenCalledTimes(2);
    expect(mockNavigate).toHaveBeenCalledWith('/appointments');
  });
});