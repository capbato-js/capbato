import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import React from 'react';
import { useLoginFormViewModel } from './useLoginFormViewModel';
import { useAuthStore } from '../../../../infrastructure/state/AuthStore';

// Mock the auth store
vi.mock('../../../../infrastructure/state/AuthStore');
const mockUseAuthStore = useAuthStore as any;

// Mock react-router-dom
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Helper to wrap hook with router
const wrapper = ({ children }: { children: React.ReactNode }) => {
  return React.createElement(BrowserRouter, {}, children);
};

describe('useLoginFormViewModel', () => {
  const mockLogin = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    
    mockUseAuthStore.mockReturnValue({
      isAuthenticated: false,
      loginStatus: 'idle',
      error: null,
      login: mockLogin,
      clearError: vi.fn(),
      getRememberedCredentials: vi.fn().mockReturnValue(null),
    });
  });

  it('should provide initial form state', () => {
    const { result } = renderHook(() => useLoginFormViewModel(), { wrapper });
    
    expect(result.current).toBeDefined();
    expect(typeof result.current.handleFormSubmit).toBe('function');
    expect(result.current.isSubmitting).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it('should handle login form submission', async () => {
    mockLogin.mockResolvedValueOnce({ success: true });
    
    const { result } = renderHook(() => useLoginFormViewModel(), { wrapper });
    
    const identifier = 'test@example.com';
    const password = 'password123';
    
    await act(async () => {
      await result.current.handleFormSubmit(identifier, password);
    });
    
    expect(mockLogin).toHaveBeenCalledWith({ identifier, password }, undefined);
  });

  it('should handle login errors', async () => {
    const errorMessage = 'Invalid credentials';
    mockLogin.mockRejectedValueOnce(new Error(errorMessage));
    
    const { result } = renderHook(() => useLoginFormViewModel(), { wrapper });
    
    const identifier = 'test@example.com';
    const password = 'wrongpassword';
    
    await act(async () => {
      await result.current.handleFormSubmit(identifier, password);
    });
    
    expect(mockLogin).toHaveBeenCalledWith({ identifier, password }, undefined);
  });

  it('should show loading state during login', async () => {
    // Mock the store to show loading state
    mockUseAuthStore.mockReturnValue({
      isAuthenticated: false,
      loginStatus: 'loading',
      error: null,
      login: mockLogin,
      clearError: vi.fn(),
      getRememberedCredentials: vi.fn().mockReturnValue(null),
    });

    const { result } = renderHook(() => useLoginFormViewModel(), { wrapper });
    
    // Check if loading state is properly reflected
    expect(result.current.isSubmitting).toBe(true);
  });

  it('should handle authentication state', () => {
    mockUseAuthStore.mockReturnValue({
      isAuthenticated: true,
      loginStatus: 'idle',
      error: null,
      login: mockLogin,
      clearError: vi.fn(),
      getRememberedCredentials: vi.fn(),
    });

    const { result } = renderHook(() => useLoginFormViewModel(), { wrapper });
    
    expect(result.current).toBeDefined();
    expect(result.current.isSubmitting).toBe(false);
  });

  it('should validate form inputs', async () => {
    const { result } = renderHook(() => useLoginFormViewModel(), { wrapper });
    
    const invalidEmail = 'invalid-email';
    const emptyPassword = '';
    
    // Test email validation
    expect(result.current.validateEmail(invalidEmail)).toBe(false);
    expect(result.current.validateEmail('valid@email.com')).toBe(true);
    
    await act(async () => {
      await result.current.handleFormSubmit(invalidEmail, emptyPassword);
    });
    
    // Should still call login (validation happens at form level)
    expect(mockLogin).toHaveBeenCalledWith({ identifier: invalidEmail, password: emptyPassword }, undefined);
  });
});
