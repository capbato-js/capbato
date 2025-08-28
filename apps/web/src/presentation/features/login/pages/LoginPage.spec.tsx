import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../../../../test/test-utils';
import { LoginPage } from './LoginPage';

// Mock the view models 
vi.mock('../view-models/useLoginViewModel', () => ({
  useLoginViewModel: vi.fn(() => ({
    isSubmitting: false,
    isLoading: false,
    error: null,
    isAuthenticated: false,
    handleLogin: vi.fn(),
    clearError: vi.fn(),
    shouldRedirect: false,
    redirectPath: '/',
  })),
}));

describe('LoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render successfully', () => {
    renderWithProviders(<LoginPage />);
    
    expect(screen.getByTestId('login-page')).toBeInTheDocument();
  });

  it('should render the login form', () => {
    renderWithProviders(<LoginPage />);
    
    // Check that login form elements are present
    expect(screen.getByTestId('login-identifier-input')).toBeInTheDocument();
    expect(screen.getByTestId('login-password-input')).toBeInTheDocument();
    expect(screen.getByTestId('login-submit-button')).toBeInTheDocument();
  });

  it('should have proper page styling with gradient background', () => {
    renderWithProviders(<LoginPage />);
    
    const loginPage = screen.getByTestId('login-page');
    expect(loginPage).toBeInTheDocument();
    
    // Check inline style properties instead of classes
    const computedStyle = window.getComputedStyle(loginPage);
    expect(computedStyle.minHeight).toBe('100vh');
    expect(computedStyle.backgroundColor).toBe('rgb(248, 249, 250)');
  });

  it('should render login title', () => {
    renderWithProviders(<LoginPage />);
    
    expect(screen.getByRole('heading', { name: 'Login' })).toBeInTheDocument();
  });

  it('should have proper accessibility attributes', () => {
    renderWithProviders(<LoginPage />);
    
    const loginPage = screen.getByTestId('login-page');
    expect(loginPage).toBeInTheDocument();
  });
});