import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { MantineProvider } from '@mantine/core';
import { AppointmentBadge } from './AppointmentBadge';

// Mock the dependencies
vi.mock('../utils/calendarUtils', () => ({
  formatAppointmentDisplay: vi.fn((appointment) => `${appointment.patientName} - ${appointment.time}`),
}));

vi.mock('../config/calendarConfig', () => ({
  APPOINTMENT_STATUS_COLORS: {
    confirmed: { background: '#e3f2fd', text: '#1565c0' },
    completed: { background: '#e8f5e8', text: '#2e7d32' },
    cancelled: { background: '#ffebee', text: '#c62828' },
  },
  CALENDAR_STYLES: {
    APPOINTMENT_BADGE: {
      padding: '4px 8px',
      borderRadius: '4px',
      fontSize: '12px',
      fontWeight: 500,
      textAlign: 'center',
      marginBottom: '2px',
      cursor: 'pointer',
    },
  },
}));

const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <MantineProvider>{children}</MantineProvider>
);

describe('AppointmentBadge Component', () => {
  const mockAppointment = {
    id: '1',
    patientNumber: 'P001',
    patientName: 'John Doe',
    reasonForVisit: 'Checkup',
    date: '2024-01-15',
    time: '10:00 AM',
    doctor: 'Dr. Smith',
    status: 'confirmed' as const,
  };

  describe('basic rendering', () => {
    it('renders appointment information correctly', () => {
      const { getByText } = render(
        <TestWrapper>
          <AppointmentBadge appointment={mockAppointment} />
        </TestWrapper>
      );

      expect(getByText('John Doe - 10:00 AM')).toBeInTheDocument();
    });

    it('applies correct styling for confirmed status', () => {
      const { container } = render(
        <TestWrapper>
          <AppointmentBadge appointment={mockAppointment} />
        </TestWrapper>
      );

      const badge = container.querySelector('div');
      expect(badge).toHaveStyle({
        backgroundColor: '#e3f2fd',
        color: '#1565c0',
      });
    });
  });

  describe('different appointment statuses', () => {
    it('renders confirmed appointment with correct colors', () => {
      const { container } = render(
        <TestWrapper>
          <AppointmentBadge appointment={{ ...mockAppointment, status: 'confirmed' }} />
        </TestWrapper>
      );

      const badge = container.querySelector('div');
      expect(badge).toHaveStyle({
        backgroundColor: '#e3f2fd',
        color: '#1565c0',
      });
    });

    it('renders completed appointment with correct colors', () => {
      const { container } = render(
        <TestWrapper>
          <AppointmentBadge appointment={{ ...mockAppointment, status: 'completed' }} />
        </TestWrapper>
      );

      const badge = container.querySelector('div');
      expect(badge).toHaveStyle({
        backgroundColor: '#e8f5e8',
        color: '#2e7d32',
      });
    });

    it('renders cancelled appointment with correct colors', () => {
      const { container } = render(
        <TestWrapper>
          <AppointmentBadge appointment={{ ...mockAppointment, status: 'cancelled' }} />
        </TestWrapper>
      );

      const badge = container.querySelector('div');
      expect(badge).toHaveStyle({
        backgroundColor: '#ffebee',
        color: '#c62828',
      });
    });

    it('falls back to confirmed colors for unknown status', () => {
      const appointmentWithUnknownStatus = {
        ...mockAppointment,
        status: 'unknown' as any,
      };

      const { container } = render(
        <TestWrapper>
          <AppointmentBadge appointment={appointmentWithUnknownStatus} />
        </TestWrapper>
      );

      const badge = container.querySelector('div');
      expect(badge).toHaveStyle({
        backgroundColor: '#e3f2fd',
        color: '#1565c0',
      });
    });
  });

  describe('different appointment data', () => {
    it('handles different patient names', () => {
      const { getByText } = render(
        <TestWrapper>
          <AppointmentBadge appointment={{ ...mockAppointment, patientName: 'Jane Smith' }} />
        </TestWrapper>
      );

      expect(getByText('Jane Smith - 10:00 AM')).toBeInTheDocument();
    });

    it('handles different times', () => {
      const { getByText } = render(
        <TestWrapper>
          <AppointmentBadge appointment={{ ...mockAppointment, time: '2:30 PM' }} />
        </TestWrapper>
      );

      expect(getByText('John Doe - 2:30 PM')).toBeInTheDocument();
    });

    it('handles long patient names', () => {
      const { getByText } = render(
        <TestWrapper>
          <AppointmentBadge appointment={{ 
            ...mockAppointment, 
            patientName: 'Very Long Patient Name With Multiple Words' 
          }} />
        </TestWrapper>
      );

      expect(getByText('Very Long Patient Name With Multiple Words - 10:00 AM')).toBeInTheDocument();
    });

    it('handles special characters in patient names', () => {
      const { getByText } = render(
        <TestWrapper>
          <AppointmentBadge appointment={{ 
            ...mockAppointment, 
            patientName: "O'Connor-Smith, Jr." 
          }} />
        </TestWrapper>
      );

      expect(getByText("O'Connor-Smith, Jr. - 10:00 AM")).toBeInTheDocument();
    });
  });

  describe('calendar styles', () => {
    it('applies calendar badge styles', () => {
      const { container } = render(
        <TestWrapper>
          <AppointmentBadge appointment={mockAppointment} />
        </TestWrapper>
      );

      const badge = container.querySelector('div');
      expect(badge).toHaveStyle({
        padding: '4px 8px',
        borderRadius: '4px',
        fontSize: '12px',
        fontWeight: '500',
        textAlign: 'center',
        marginBottom: '2px',
        cursor: 'pointer',
      });
    });
  });

  describe('snapshots', () => {
    it('matches snapshot with confirmed appointment', () => {
      const { container } = render(
        <TestWrapper>
          <AppointmentBadge appointment={mockAppointment} />
        </TestWrapper>
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it('matches snapshot with completed appointment', () => {
      const { container } = render(
        <TestWrapper>
          <AppointmentBadge appointment={{ ...mockAppointment, status: 'completed' }} />
        </TestWrapper>
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it('matches snapshot with cancelled appointment', () => {
      const { container } = render(
        <TestWrapper>
          <AppointmentBadge appointment={{ ...mockAppointment, status: 'cancelled' }} />
        </TestWrapper>
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it('matches snapshot with long patient name', () => {
      const { container } = render(
        <TestWrapper>
          <AppointmentBadge appointment={{ 
            ...mockAppointment, 
            patientName: 'Very Long Patient Name With Multiple Words' 
          }} />
        </TestWrapper>
      );
      expect(container.firstChild).toMatchSnapshot();
    });
  });
});