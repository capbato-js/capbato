import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { MantineProvider } from '@mantine/core';
import { AppointmentsTable } from './AppointmentsTable';

// Mock the FullAppointmentsTable component
vi.mock('../../../components/common', () => ({
  FullAppointmentsTable: ({ appointments, callbacks }: any) => (
    <div data-testid="full-appointments-table">
      <div>Appointments: {appointments.length}</div>
      <div>Has onModifyAppointment: {String(!!callbacks.onModifyAppointment)}</div>
      <div>Has onCancelAppointment: {String(!!callbacks.onCancelAppointment)}</div>
      <div>Has onReconfirmAppointment: {String(!!callbacks.onReconfirmAppointment)}</div>
      <div>Has onCompleteAppointment: {String(!!callbacks.onCompleteAppointment)}</div>
      {appointments.map((appointment: any) => (
        <div key={appointment.id}>
          {appointment.patientName} - {appointment.date}
        </div>
      ))}
      <button onClick={() => callbacks.onModifyAppointment?.('1')}>Modify</button>
      <button onClick={() => callbacks.onCancelAppointment?.('1')}>Cancel</button>
      <button onClick={() => callbacks.onReconfirmAppointment?.('1')}>Reconfirm</button>
      <button onClick={() => callbacks.onCompleteAppointment?.('1')}>Complete</button>
    </div>
  ),
}));

const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <MantineProvider>{children}</MantineProvider>
);

describe('AppointmentsTable Component', () => {
  const mockAppointments = [
    {
      id: '1',
      patientNumber: 'P001',
      patientName: 'John Doe',
      reasonForVisit: 'Checkup',
      date: '2024-01-15',
      time: '10:00 AM',
      doctor: 'Dr. Smith',
      status: 'confirmed' as const,
    },
    {
      id: '2',
      patientNumber: 'P002',
      patientName: 'Jane Smith',
      reasonForVisit: 'Consultation',
      date: '2024-01-16',
      time: '2:00 PM',
      doctor: 'Dr. Brown',
      status: 'completed' as const,
    },
  ];

  const defaultProps = {
    appointments: mockAppointments,
    onModifyAppointment: vi.fn(),
    onCancelAppointment: vi.fn(),
    onReconfirmAppointment: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('basic rendering', () => {
    it('renders FullAppointmentsTable with correct props', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <AppointmentsTable {...defaultProps} />
        </TestWrapper>
      );

      expect(getByTestId('full-appointments-table')).toBeInTheDocument();
    });

    it('passes appointments correctly', () => {
      const { getByText } = render(
        <TestWrapper>
          <AppointmentsTable {...defaultProps} />
        </TestWrapper>
      );

      expect(getByText('Appointments: 2')).toBeInTheDocument();
      expect(getByText('John Doe - 2024-01-15')).toBeInTheDocument();
      expect(getByText('Jane Smith - 2024-01-16')).toBeInTheDocument();
    });

    it('renders with empty appointments array', () => {
      const { getByText } = render(
        <TestWrapper>
          <AppointmentsTable {...defaultProps} appointments={[]} />
        </TestWrapper>
      );

      expect(getByText('Appointments: 0')).toBeInTheDocument();
    });
  });

  describe('callback handling', () => {
    it('passes all required callbacks', () => {
      const { getByText } = render(
        <TestWrapper>
          <AppointmentsTable {...defaultProps} />
        </TestWrapper>
      );

      expect(getByText('Has onModifyAppointment: true')).toBeInTheDocument();
      expect(getByText('Has onCancelAppointment: true')).toBeInTheDocument();
      expect(getByText('Has onReconfirmAppointment: true')).toBeInTheDocument();
    });

    it('handles optional onCompleteAppointment callback', () => {
      const mockOnComplete = vi.fn();
      const { getByText } = render(
        <TestWrapper>
          <AppointmentsTable {...defaultProps} onCompleteAppointment={mockOnComplete} />
        </TestWrapper>
      );

      expect(getByText('Has onCompleteAppointment: true')).toBeInTheDocument();
    });

    it('works without optional onCompleteAppointment callback', () => {
      const { getByText } = render(
        <TestWrapper>
          <AppointmentsTable {...defaultProps} />
        </TestWrapper>
      );

      expect(getByText('Has onCompleteAppointment: false')).toBeInTheDocument();
    });

    it('calls onModifyAppointment when modify button is clicked', () => {
      const mockOnModify = vi.fn();
      const { getByText } = render(
        <TestWrapper>
          <AppointmentsTable {...defaultProps} onModifyAppointment={mockOnModify} />
        </TestWrapper>
      );

      getByText('Modify').click();
      expect(mockOnModify).toHaveBeenCalledWith('1');
    });

    it('calls onCancelAppointment when cancel button is clicked', () => {
      const mockOnCancel = vi.fn();
      const { getByText } = render(
        <TestWrapper>
          <AppointmentsTable {...defaultProps} onCancelAppointment={mockOnCancel} />
        </TestWrapper>
      );

      getByText('Cancel').click();
      expect(mockOnCancel).toHaveBeenCalledWith('1');
    });

    it('calls onReconfirmAppointment when reconfirm button is clicked', () => {
      const mockOnReconfirm = vi.fn();
      const { getByText } = render(
        <TestWrapper>
          <AppointmentsTable {...defaultProps} onReconfirmAppointment={mockOnReconfirm} />
        </TestWrapper>
      );

      getByText('Reconfirm').click();
      expect(mockOnReconfirm).toHaveBeenCalledWith('1');
    });

    it('calls onCompleteAppointment when complete button is clicked', () => {
      const mockOnComplete = vi.fn();
      const { getByText } = render(
        <TestWrapper>
          <AppointmentsTable {...defaultProps} onCompleteAppointment={mockOnComplete} />
        </TestWrapper>
      );

      getByText('Complete').click();
      expect(mockOnComplete).toHaveBeenCalledWith('1');
    });
  });

  describe('data transformation', () => {
    it('correctly transforms appointment data to BaseAppointment format', () => {
      const { getByText } = render(
        <TestWrapper>
          <AppointmentsTable {...defaultProps} />
        </TestWrapper>
      );

      // Verify transformed data is displayed correctly
      expect(getByText('John Doe - 2024-01-15')).toBeInTheDocument();
      expect(getByText('Jane Smith - 2024-01-16')).toBeInTheDocument();
    });

    it('handles appointments with different status values', () => {
      const appointmentsWithVariousStatuses = [
        { ...mockAppointments[0], status: 'cancelled' as const },
        { ...mockAppointments[1], status: 'confirmed' as const },
      ];

      const { getByText } = render(
        <TestWrapper>
          <AppointmentsTable {...defaultProps} appointments={appointmentsWithVariousStatuses} />
        </TestWrapper>
      );

      expect(getByText('Appointments: 2')).toBeInTheDocument();
    });
  });

  describe('snapshots', () => {
    it('matches snapshot with appointments', () => {
      const { container } = render(
        <TestWrapper>
          <AppointmentsTable {...defaultProps} />
        </TestWrapper>
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it('matches snapshot with empty appointments', () => {
      const { container } = render(
        <TestWrapper>
          <AppointmentsTable {...defaultProps} appointments={[]} />
        </TestWrapper>
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it('matches snapshot with optional callback', () => {
      const { container } = render(
        <TestWrapper>
          <AppointmentsTable {...defaultProps} onCompleteAppointment={vi.fn()} />
        </TestWrapper>
      );
      expect(container.firstChild).toMatchSnapshot();
    });
  });
});