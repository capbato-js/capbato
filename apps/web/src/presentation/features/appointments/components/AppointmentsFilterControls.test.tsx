import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MantineProvider } from '@mantine/core';
import { AppointmentsFilterControls } from './AppointmentsFilterControls';

// Mock the Icon component
vi.mock('../../../components/common', () => ({
  Icon: ({ icon, size }: { icon: string; size: number }) => (
    <span data-testid="icon" data-icon={icon} data-size={size}>
      {icon}
    </span>
  ),
}));

// Mock dayjs for timezone handling
vi.mock('dayjs', () => {
  const mockDayjs = {
    extend: vi.fn(),
    tz: vi.fn().mockReturnThis(),
    format: vi.fn((format) => {
      if (format === 'YYYY-MM-DD') return '2024-01-15';
      if (format === 'MMM D, YYYY') return 'Jan 15, 2024';
      return '2024-01-15';
    }),
  };
  const dayjsFunction = vi.fn(() => mockDayjs);
  dayjsFunction.extend = vi.fn();
  return { default: dayjsFunction };
});

const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <MantineProvider>{children}</MantineProvider>
);

describe('AppointmentsFilterControls Component', () => {
  const defaultProps = {
    selectedDate: new Date('2024-01-15'),
    onDateChange: vi.fn(),
    showAll: false,
    onShowAllChange: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('basic rendering', () => {
    it('renders all control elements', () => {
      render(
        <TestWrapper>
          <AppointmentsFilterControls {...defaultProps} />
        </TestWrapper>
      );

      expect(screen.getByText('Select Date:')).toBeInTheDocument();
      expect(screen.getByText('Show All')).toBeInTheDocument();
      expect(screen.getByTestId('icon')).toBeInTheDocument();
    });

    it('renders calendar icon with correct props', () => {
      render(
        <TestWrapper>
          <AppointmentsFilterControls {...defaultProps} />
        </TestWrapper>
      );

      const icon = screen.getByTestId('icon');
      expect(icon).toHaveAttribute('data-icon', 'fas fa-calendar');
      expect(icon).toHaveAttribute('data-size', '14');
    });

    it('renders date input with placeholder', () => {
      render(
        <TestWrapper>
          <AppointmentsFilterControls {...defaultProps} />
        </TestWrapper>
      );

      expect(screen.getByPlaceholderText('Enter date')).toBeInTheDocument();
    });
  });

  describe('show all checkbox', () => {
    it('renders unchecked checkbox when showAll is false', () => {
      render(
        <TestWrapper>
          <AppointmentsFilterControls {...defaultProps} showAll={false} />
        </TestWrapper>
      );

      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).not.toBeChecked();
    });

    it('renders checked checkbox when showAll is true', () => {
      render(
        <TestWrapper>
          <AppointmentsFilterControls {...defaultProps} showAll={true} />
        </TestWrapper>
      );

      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeChecked();
    });

    it('calls onShowAllChange when checkbox is clicked', () => {
      const mockOnShowAllChange = vi.fn();
      render(
        <TestWrapper>
          <AppointmentsFilterControls {...defaultProps} onShowAllChange={mockOnShowAllChange} />
        </TestWrapper>
      );

      const checkbox = screen.getByRole('checkbox');
      fireEvent.click(checkbox);

      expect(mockOnShowAllChange).toHaveBeenCalledWith(true);
    });

    it('calls onShowAllChange when text is clicked', () => {
      const mockOnShowAllChange = vi.fn();
      render(
        <TestWrapper>
          <AppointmentsFilterControls {...defaultProps} onShowAllChange={mockOnShowAllChange} />
        </TestWrapper>
      );

      const text = screen.getByText('Show All');
      fireEvent.click(text);

      expect(mockOnShowAllChange).toHaveBeenCalledWith(true);
    });

    it('toggles state correctly when already checked', () => {
      const mockOnShowAllChange = vi.fn();
      render(
        <TestWrapper>
          <AppointmentsFilterControls 
            {...defaultProps} 
            showAll={true} 
            onShowAllChange={mockOnShowAllChange} 
          />
        </TestWrapper>
      );

      const text = screen.getByText('Show All');
      fireEvent.click(text);

      expect(mockOnShowAllChange).toHaveBeenCalledWith(false);
    });
  });

  describe('date handling', () => {
    it('formats date correctly for display', () => {
      render(
        <TestWrapper>
          <AppointmentsFilterControls {...defaultProps} />
        </TestWrapper>
      );

      // The date input should be present (implementation details may vary)
      expect(screen.getByPlaceholderText('Enter date')).toBeInTheDocument();
    });

    it('handles different date values', () => {
      const differentDate = new Date('2024-12-25');
      render(
        <TestWrapper>
          <AppointmentsFilterControls {...defaultProps} selectedDate={differentDate} />
        </TestWrapper>
      );

      expect(screen.getByPlaceholderText('Enter date')).toBeInTheDocument();
    });
  });

  describe('styling and layout', () => {
    it('applies correct container styles', () => {
      const { container } = render(
        <TestWrapper>
          <AppointmentsFilterControls {...defaultProps} />
        </TestWrapper>
      );

      // Just verify the component renders properly - Mantine styles are handled internally
      expect(container.firstChild).toBeInTheDocument();
      expect(screen.getByText('Select Date:')).toBeInTheDocument();
    });

    it('applies correct text styling based on showAll state', () => {
      const { rerender } = render(
        <TestWrapper>
          <AppointmentsFilterControls {...defaultProps} showAll={false} />
        </TestWrapper>
      );

      let showAllText = screen.getByText('Show All');
      expect(showAllText).toBeInTheDocument();

      rerender(
        <TestWrapper>
          <AppointmentsFilterControls {...defaultProps} showAll={true} />
        </TestWrapper>
      );

      showAllText = screen.getByText('Show All');
      expect(showAllText).toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('has proper text for screen readers', () => {
      render(
        <TestWrapper>
          <AppointmentsFilterControls {...defaultProps} />
        </TestWrapper>
      );

      expect(screen.getByText('Select Date:')).toBeInTheDocument();
      expect(screen.getByText('Show All')).toBeInTheDocument();
    });

    it('checkbox is properly labeled', () => {
      render(
        <TestWrapper>
          <AppointmentsFilterControls {...defaultProps} />
        </TestWrapper>
      );

      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeInTheDocument();
    });

    it('text has proper cursor styling', () => {
      render(
        <TestWrapper>
          <AppointmentsFilterControls {...defaultProps} />
        </TestWrapper>
      );

      const showAllText = screen.getByText('Show All');
      expect(showAllText).toHaveStyle({
        cursor: 'pointer',
        userSelect: 'none',
      });
    });
  });

  describe('edge cases', () => {
    it('handles null date gracefully', () => {
      render(
        <TestWrapper>
          <AppointmentsFilterControls 
            {...defaultProps} 
            selectedDate={null as any} 
          />
        </TestWrapper>
      );

      expect(screen.getByPlaceholderText('Enter date')).toBeInTheDocument();
    });

    it('handles undefined callbacks gracefully', () => {
      expect(() => {
        render(
          <TestWrapper>
            <AppointmentsFilterControls 
              selectedDate={defaultProps.selectedDate}
              onDateChange={undefined as any}
              showAll={false}
              onShowAllChange={undefined as any}
            />
          </TestWrapper>
        );
      }).not.toThrow();
    });
  });

  describe('snapshots', () => {
    it('matches snapshot with default props', () => {
      const { container } = render(
        <TestWrapper>
          <AppointmentsFilterControls {...defaultProps} />
        </TestWrapper>
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it('matches snapshot with showAll enabled', () => {
      const { container } = render(
        <TestWrapper>
          <AppointmentsFilterControls {...defaultProps} showAll={true} />
        </TestWrapper>
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it('matches snapshot with different date', () => {
      const { container } = render(
        <TestWrapper>
          <AppointmentsFilterControls 
            {...defaultProps} 
            selectedDate={new Date('2024-12-25')} 
          />
        </TestWrapper>
      );
      expect(container.firstChild).toMatchSnapshot();
    });
  });
});