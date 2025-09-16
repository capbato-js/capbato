import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ErrorBanner } from './ErrorBanner';

// Mock the view model
const mockViewModel = {
  hasError: false,
  error: '',
  dismiss: vi.fn(),
  retry: vi.fn(),
};

vi.mock('../view-models/useErrorBannerViewModel', () => ({
  useErrorBannerViewModel: () => mockViewModel,
}));

describe('ErrorBanner', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset to default state
    mockViewModel.hasError = false;
    mockViewModel.error = '';
  });

  it('should not render when there is no error', () => {
    mockViewModel.hasError = false;
    
    render(<ErrorBanner />);
    
    expect(screen.queryByText('Error')).not.toBeInTheDocument();
    expect(screen.queryByTestId('error-message')).not.toBeInTheDocument();
  });

  it('should render error banner when there is an error', () => {
    mockViewModel.hasError = true;
    mockViewModel.error = 'Test error message';
    
    render(<ErrorBanner />);
    
    expect(screen.getByText('Error')).toBeInTheDocument();
    expect(screen.getByTestId('error-message')).toHaveTextContent('Test error message');
    expect(screen.getByTestId('error-retry')).toBeInTheDocument();
    expect(screen.getByTestId('error-dismiss')).toBeInTheDocument();
  });

  it('should call retry when retry button is clicked', async () => {
    const user = userEvent.setup();
    mockViewModel.hasError = true;
    mockViewModel.error = 'Test error';
    
    render(<ErrorBanner />);
    
    const retryButton = screen.getByTestId('error-retry');
    await user.click(retryButton);
    
    expect(mockViewModel.retry).toHaveBeenCalledTimes(1);
  });

  it('should call dismiss when dismiss button is clicked', async () => {
    const user = userEvent.setup();
    mockViewModel.hasError = true;
    mockViewModel.error = 'Test error';
    
    render(<ErrorBanner />);
    
    const dismissButton = screen.getByTestId('error-dismiss');
    await user.click(dismissButton);
    
    expect(mockViewModel.dismiss).toHaveBeenCalledTimes(1);
  });

  it('should handle long error messages', () => {
    const longError = 'This is a very long error message that should still be displayed properly in the error banner component without breaking the layout or functionality';
    mockViewModel.hasError = true;
    mockViewModel.error = longError;
    
    render(<ErrorBanner />);
    
    expect(screen.getByTestId('error-message')).toHaveTextContent(longError);
  });

  it('should handle empty error message', () => {
    mockViewModel.hasError = true;
    mockViewModel.error = '';
    
    render(<ErrorBanner />);
    
    expect(screen.getByTestId('error-message')).toHaveTextContent('');
    expect(screen.getByText('Error')).toBeInTheDocument();
  });

  it('should have proper structure and accessibility', () => {
    mockViewModel.hasError = true;
    mockViewModel.error = 'Test error';
    
    render(<ErrorBanner />);
    
    // Check that main elements exist
    expect(screen.getByText('Error')).toBeInTheDocument();
    expect(screen.getByTestId('error-message')).toBeInTheDocument();
    expect(screen.getByTestId('error-retry')).toBeInTheDocument();
    expect(screen.getByTestId('error-dismiss')).toBeInTheDocument();
  });

  it('should display retry and dismiss buttons with correct variants', () => {
    mockViewModel.hasError = true;
    mockViewModel.error = 'Test error';
    
    render(<ErrorBanner />);
    
    const retryButton = screen.getByTestId('error-retry');
    const dismissButton = screen.getByTestId('error-dismiss');
    
    expect(retryButton).toHaveTextContent('Retry');
    expect(dismissButton).toHaveTextContent('Dismiss');
  });
});