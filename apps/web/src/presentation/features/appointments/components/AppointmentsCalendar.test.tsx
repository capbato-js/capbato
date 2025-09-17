import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { MantineProvider } from '@mantine/core';
import { AppointmentsCalendar } from './AppointmentsCalendar';

// Mock the container component
vi.mock('./AppointmentsCalendarContainer', () => ({
  AppointmentsCalendarContainer: ({ appointments, onDateSelect, selectedDate }: any) => (
    <div data-testid="appointments-calendar-container">
      <div>Appointments: {appointments.length}</div>
      <div>Selected Date: {selectedDate || 'None'}</div>
      <button onClick={() => onDateSelect?.('2024-01-15')}>Select Date</button>
    </div>
  ),
}));

const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <MantineProvider>{children}</MantineProvider>
);

describe('AppointmentsCalendar Component', () => {
  const mockAppointments = [
    { id: '1', patientName: 'John Doe', date: '2024-01-15' },
    { id: '2', patientName: 'Jane Smith', date: '2024-01-16' },
  ];

  const defaultProps = {
    appointments: mockAppointments,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('basic rendering', () => {
    it('renders container with correct props', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <AppointmentsCalendar {...defaultProps} />
        </TestWrapper>
      );

      expect(getByTestId('appointments-calendar-container')).toBeInTheDocument();
    });

    it('passes appointments correctly', () => {
      const { getByText } = render(
        <TestWrapper>
          <AppointmentsCalendar {...defaultProps} />
        </TestWrapper>
      );

      expect(getByText('Appointments: 2')).toBeInTheDocument();
    });

    it('renders with empty appointments array', () => {
      const { getByText } = render(
        <TestWrapper>
          <AppointmentsCalendar appointments={[]} />
        </TestWrapper>
      );

      expect(getByText('Appointments: 0')).toBeInTheDocument();
    });
  });

  describe('optional props', () => {
    it('renders without optional props', () => {
      const { getByText } = render(
        <TestWrapper>
          <AppointmentsCalendar {...defaultProps} />
        </TestWrapper>
      );

      expect(getByText('Selected Date: None')).toBeInTheDocument();
    });

    it('passes selectedDate prop correctly', () => {
      const { getByText } = render(
        <TestWrapper>
          <AppointmentsCalendar {...defaultProps} selectedDate="2024-01-15" />
        </TestWrapper>
      );

      expect(getByText('Selected Date: 2024-01-15')).toBeInTheDocument();
    });

    it('passes onDateSelect callback', () => {
      const mockOnDateSelect = vi.fn();
      const { getByText } = render(
        <TestWrapper>
          <AppointmentsCalendar {...defaultProps} onDateSelect={mockOnDateSelect} />
        </TestWrapper>
      );

      getByText('Select Date').click();
      expect(mockOnDateSelect).toHaveBeenCalledWith('2024-01-15');
    });
  });

  describe('large datasets', () => {
    it('handles large appointment arrays', () => {
      const largeAppointments = Array.from({ length: 100 }, (_, i) => ({
        id: `appointment-${i}`,
        patientName: `Patient ${i}`,
        date: `2024-01-${(i % 30) + 1}`,
      }));

      const { getByText } = render(
        <TestWrapper>
          <AppointmentsCalendar appointments={largeAppointments} />
        </TestWrapper>
      );

      expect(getByText('Appointments: 100')).toBeInTheDocument();
    });
  });

  describe('snapshots', () => {
    it('matches snapshot with appointments', () => {
      const { container } = render(
        <TestWrapper>
          <AppointmentsCalendar {...defaultProps} />
        </TestWrapper>
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it('matches snapshot with selected date', () => {
      const { container } = render(
        <TestWrapper>
          <AppointmentsCalendar {...defaultProps} selectedDate="2024-01-15" />
        </TestWrapper>
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it('matches snapshot with empty appointments', () => {
      const { container } = render(
        <TestWrapper>
          <AppointmentsCalendar appointments={[]} />
        </TestWrapper>
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it('matches snapshot with all props', () => {
      const mockOnDateSelect = vi.fn();
      const { container } = render(
        <TestWrapper>
          <AppointmentsCalendar
            appointments={mockAppointments}
            selectedDate="2024-01-15"
            onDateSelect={mockOnDateSelect}
          />
        </TestWrapper>
      );
      expect(container.firstChild).toMatchSnapshot();
    });
  });
});