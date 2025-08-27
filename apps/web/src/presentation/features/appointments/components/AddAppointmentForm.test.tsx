import React from 'react';
import { render, screen } from '@testing-library/react';
import { MantineProvider } from '@mantine/core';
import { AddAppointmentForm } from '../AddAppointmentForm';

// Mock the stores and services
jest.mock('../../../../../infrastructure/state/PatientStore', () => ({
  usePatientStore: () => ({
    getIsLoading: () => false,
    getPatients: () => [],
  }),
}));

jest.mock('../../../../../infrastructure/state/DoctorStore', () => ({
  useDoctorStore: () => ({
    getIsLoading: () => false,
    getDoctors: () => [],
  }),
}));

jest.mock('../../../../../infrastructure/state/AppointmentStore', () => ({
  useAppointmentStore: () => ({
    getAppointments: () => [],
  }),
}));

jest.mock('../../services/DoctorAssignmentService', () => ({
  doctorAssignmentService: {
    assignDoctorToAppointment: jest.fn().mockResolvedValue('Dr. John Doe'),
  },
}));

const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <MantineProvider>{children}</MantineProvider>
);

describe('AddAppointmentForm - Patient Name Field', () => {
  const mockOnSubmit = jest.fn().mockResolvedValue(true);
  const mockOnClearError = jest.fn();

  const defaultProps = {
    onSubmit: mockOnSubmit,
    isLoading: false,
    error: null,
    onClearError: mockOnClearError,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Add Mode (default)', () => {
    it('renders editable patient name field in add mode', () => {
      render(
        <TestWrapper>
          <AddAppointmentForm {...defaultProps} />
        </TestWrapper>
      );

      // Should show searchable select for patient name
      expect(screen.getByText('Patient Name')).toBeInTheDocument();
      expect(screen.getByText('Search and select patient')).toBeInTheDocument();
    });
  });

  describe('Edit Mode', () => {
    const editModeProps = {
      ...defaultProps,
      editMode: true,
      currentAppointmentId: 'appointment123',
      initialData: {
        patientId: 'patient123',
        patientName: 'John Smith',
        patientNumber: 'P001',
        reasonForVisit: 'Consultation',
        appointmentDate: '2024-01-15',
        appointmentTime: '10:00',
        doctorId: 'doctor123',
        doctorName: 'Dr. Jane Doe',
      },
    };

    it('renders read-only patient name field in edit mode', () => {
      render(
        <TestWrapper>
          <AddAppointmentForm {...editModeProps} />
        </TestWrapper>
      );

      // Should show patient name as read-only text
      expect(screen.getByText('Patient Name')).toBeInTheDocument();
      expect(screen.getByText('John Smith')).toBeInTheDocument();
      
      // Should show explanatory text
      expect(screen.getByText('Patient information cannot be changed when modifying an appointment')).toBeInTheDocument();
      
      // Should NOT show the search placeholder
      expect(screen.queryByText('Search and select patient')).not.toBeInTheDocument();
    });

    it('shows patient number when available in edit mode', () => {
      render(
        <TestWrapper>
          <AddAppointmentForm {...editModeProps} />
        </TestWrapper>
      );

      // Should show patient number
      expect(screen.getByText('Patient #: P001')).toBeInTheDocument();
    });

    it('shows correct button text and icon in edit mode', () => {
      render(
        <TestWrapper>
          <AddAppointmentForm {...editModeProps} />
        </TestWrapper>
      );

      // Should show update button text
      const submitButton = screen.getByRole('button', { name: /update appointment/i });
      expect(submitButton).toBeInTheDocument();
    });

    it('handles missing patient name gracefully in edit mode', () => {
      const propsWithoutPatientName = {
        ...editModeProps,
        initialData: {
          ...editModeProps.initialData,
          patientName: undefined,
        },
      };

      render(
        <TestWrapper>
          <AddAppointmentForm {...propsWithoutPatientName} />
        </TestWrapper>
      );

      // Should show fallback text
      expect(screen.getByText('Unknown Patient')).toBeInTheDocument();
    });
  });

  describe('Mode Switching', () => {
    it('switches from add to edit mode correctly', () => {
      const { rerender } = render(
        <TestWrapper>
          <AddAppointmentForm {...defaultProps} />
        </TestWrapper>
      );

      // Initially in add mode
      expect(screen.getByText('Search and select patient')).toBeInTheDocument();

      // Switch to edit mode
      rerender(
        <TestWrapper>
          <AddAppointmentForm
            {...defaultProps}
            editMode={true}
            initialData={{
              patientId: 'patient123',
              patientName: 'Jane Doe',
            }}
          />
        </TestWrapper>
      );

      // Now in edit mode
      expect(screen.getByText('Jane Doe')).toBeInTheDocument();
      expect(screen.queryByText('Search and select patient')).not.toBeInTheDocument();
    });
  });
});
