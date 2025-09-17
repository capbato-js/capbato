import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { render } from '../../../../test/test-utils';
import { BackButton } from './BackButton';

describe('BackButton', () => {
  const mockOnClick = vi.fn();
  const defaultProps = {
    onClick: mockOnClick,
    text: 'Go Back'
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render with provided text', () => {
    render(<BackButton {...defaultProps} />);
    
    expect(screen.getByText('Go Back')).toBeInTheDocument();
  });

  it('should render with left arrow icon', () => {
    render(<BackButton {...defaultProps} />);
    
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    
    // Check if icon is present by looking for svg element
    const icon = button.querySelector('svg');
    expect(icon).toBeInTheDocument();
  });

  it('should call onClick when clicked', () => {
    render(<BackButton {...defaultProps} />);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('should have correct styling attributes', () => {
    render(<BackButton {...defaultProps} />);
    
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    // Verify the component has styling applied
    expect(button).toHaveAttribute('style');
  });

  it('should render with custom text', () => {
    render(<BackButton onClick={mockOnClick} text="Return to Dashboard" />);
    
    expect(screen.getByText('Return to Dashboard')).toBeInTheDocument();
  });

  it('should be accessible with proper button role', () => {
    render(<BackButton {...defaultProps} />);
    
    const button = screen.getByRole('button', { name: 'Go Back' });
    expect(button).toBeInTheDocument();
  });
});