import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { render } from '../../../../test/test-utils';
import { ErrorDisplay } from './ErrorDisplay';

describe('ErrorDisplay', () => {
  it('should render error message when error is provided', () => {
    const errorMessage = 'Something went wrong';
    render(<ErrorDisplay error={errorMessage} />);
    
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('should not render when error is null', () => {
    render(<ErrorDisplay error={null} />);
    
    expect(screen.queryByText(/./)).not.toBeInTheDocument();
  });

  it('should not render when error is empty string', () => {
    render(<ErrorDisplay error="" />);
    
    expect(screen.queryByText(/./)).not.toBeInTheDocument();
  });

  it('should have correct error styling', () => {
    const errorMessage = 'Test error';
    render(<ErrorDisplay error={errorMessage} />);
    
    const errorBox = screen.getByText(errorMessage).closest('div');
    expect(errorBox).toBeInTheDocument();
    // Note: Mantine styles are applied via CSS classes, so we verify the structure
    expect(errorBox).toHaveAttribute('style');
  });

  it('should render multiple error messages correctly', () => {
    const errorMessage = 'Error line 1\nError line 2';
    render(<ErrorDisplay error={errorMessage} />);
    
    // Find the text element specifically
    const textElement = screen.getByRole('paragraph');
    expect(textElement).toBeInTheDocument();
    expect(textElement.textContent).toBe(errorMessage);
  });

  it('should handle long error messages', () => {
    const longError = 'This is a very long error message that should still be displayed correctly in the error display component';
    render(<ErrorDisplay error={longError} />);
    
    expect(screen.getByText(longError)).toBeInTheDocument();
  });
});