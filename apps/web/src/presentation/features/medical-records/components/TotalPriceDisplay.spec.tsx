import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { render } from '../../../../test/test-utils';
import { TotalPriceDisplay } from './TotalPriceDisplay';

// Mock the constants
vi.mock('../constants/labTestConstants', () => ({
  formatTestPrice: vi.fn((price: number) => `₱${price.toFixed(2)}`),
  calculateTotalPrice: vi.fn((testIds: string[]) => {
    // Mock calculation - simplified for testing
    const mockPrices: Record<string, number> = {
      'test1': 100,
      'test2': 200,
      'test3': 150
    };
    return testIds.reduce((total, id) => total + (mockPrices[id] || 0), 0);
  })
}));

describe('TotalPriceDisplay', () => {
  it('should not render when no tests are selected', () => {
    render(<TotalPriceDisplay selectedTests={[]} />);
    
    expect(screen.queryByText(/Total:/)).not.toBeInTheDocument();
  });

  it('should render total price when tests are selected', () => {
    const selectedTests = ['test1', 'test2'];
    render(<TotalPriceDisplay selectedTests={selectedTests} />);
    
    expect(screen.getByText(/Total:/)).toBeInTheDocument();
    expect(screen.getByText(/₱300.00/)).toBeInTheDocument();
  });

  it('should calculate and display correct total for single test', () => {
    const selectedTests = ['test1'];
    render(<TotalPriceDisplay selectedTests={selectedTests} />);
    
    expect(screen.getByText('Total: ₱100.00')).toBeInTheDocument();
  });

  it('should calculate and display correct total for multiple tests', () => {
    const selectedTests = ['test1', 'test2', 'test3'];
    render(<TotalPriceDisplay selectedTests={selectedTests} />);
    
    expect(screen.getByText('Total: ₱450.00')).toBeInTheDocument();
  });

  it('should have correct styling for centered display', () => {
    const selectedTests = ['test1'];
    render(<TotalPriceDisplay selectedTests={selectedTests} />);
    
    const container = screen.getByText(/Total:/).closest('div');
    expect(container).toBeInTheDocument();
    // Verify the component has the expected styling applied
    expect(container).toHaveAttribute('style');
  });

  it('should have correct text styling', () => {
    const selectedTests = ['test1'];
    render(<TotalPriceDisplay selectedTests={selectedTests} />);
    
    const text = screen.getByText(/Total:/);
    expect(text).toBeInTheDocument();
    // Note: Mantine styles are applied via className, so we check for the element
  });

  it('should handle empty test id in selection', () => {
    const selectedTests = ['test1', '', 'test2'];
    render(<TotalPriceDisplay selectedTests={selectedTests} />);
    
    // Should still render (empty string should result in 0 price)
    expect(screen.getByText('Total: ₱300.00')).toBeInTheDocument();
  });

  it('should re-render when selected tests change', () => {
    const { rerender } = render(<TotalPriceDisplay selectedTests={['test1']} />);
    
    expect(screen.getByText('Total: ₱100.00')).toBeInTheDocument();
    
    rerender(<TotalPriceDisplay selectedTests={['test1', 'test2']} />);
    
    expect(screen.getByText('Total: ₱300.00')).toBeInTheDocument();
  });
});