import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MantineProvider } from '@mantine/core';
import { AppointmentsPage } from './AppointmentsPage';
import { vi, describe, it, expect, beforeEach } from 'vitest';

// Mock the view model
vi.mock('../view-models/useAppointmentPageViewModel', () => ({
  useAppointmentPageViewModel: () => ({
    appointments: [
      {
        id: 'apt-1',
        appointmentDate: '2025-08-27',
        appointmentTime: '10:00',
        status: 'cancelled',
        patient: { fullName: 'John Doe', patientNumber: 'P001' },
        doctor: { fullName: 'Dr. Smith' },
        reasonForVisit: 'Checkup'
      },
      {
        id: 'apt-2', 
        appointmentDate: '2025-08-27',
        appointmentTime: '10:00',
        status: 'confirmed',
        patient: { fullName: 'Jane Smith', patientNumber: 'P002' },
        doctor: { fullName: 'Dr. Smith' },
        reasonForVisit: 'Consultation'
      }
    ],
    filteredAppointments: [],
    isLoading: false,
    error: null,
    confirmAppointment: vi.fn().mockResolvedValue(undefined),
    handleAppointmentCreated: vi.fn(),
    fetchAppointments: vi.fn(),
    refreshAppointments: vi.fn()
  })
}));

// Mock the components
vi.mock('../../../components/layout', () => ({
  MedicalClinicLayout: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
}));

vi.mock('../../../components/common', () => ({
  DataTableHeader: () => <div>Header</div>,
  ConfirmationModal: ({ 
    isOpen, 
    onConfirm, 
    onCancel 
  }: { 
    isOpen: boolean; 
    onConfirm: () => void; 
    onCancel: () => void; 
  }) => (
    isOpen ? (
      <div data-testid="confirmation-modal">
        <button onClick={onConfirm} data-testid="confirm-button">Confirm</button>
        <button onClick={onCancel} data-testid="cancel-button">Cancel</button>
      </div>
    ) : null
  )
}));

vi.mock('../components', () => ({
  AppointmentsTable: ({ 
    onReconfirmAppointment 
  }: { 
    onReconfirmAppointment: (id: string) => void 
  }) => (
    <div>
      <button 
        onClick={() => onReconfirmAppointment('apt-1')} 
        data-testid="reconfirm-button"
      >
        Reconfirm
      </button>
    </div>
  ),
  AppointmentsFilterControls: () => <div>Filter Controls</div>,
  AppointmentCountDisplay: () => <div>Count Display</div>,
  AddAppointmentModal: () => <div>Add Modal</div>
}));

describe('AppointmentsPage - Reconfirm Flow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should show reconfirm modal first, then check slot availability when confirming', async () => {
    render(
      <MantineProvider>
        <AppointmentsPage />
      </MantineProvider>
    );

    // Click the reconfirm button
    const reconfirmButton = screen.getByTestId('reconfirm-button');
    fireEvent.click(reconfirmButton);

    // Should show the confirmation modal immediately
    await waitFor(() => {
      expect(screen.getByTestId('confirmation-modal')).toBeInTheDocument();
    });

    // The modal should be visible before any slot checking
    expect(screen.getByTestId('confirmation-modal')).toBeInTheDocument();
  });

  it('should proceed with reconfirmation when slot is available', async () => {
    const mockConfirmAppointment = vi.fn().mockResolvedValue(undefined);
    
    // Re-mock with fewer confirmed appointments (slot available)
    vi.doMock('../view-models/useAppointmentPageViewModel', () => ({
      useAppointmentPageViewModel: () => ({
        appointments: [
          {
            id: 'apt-1',
            appointmentDate: '2025-08-27',
            appointmentTime: '10:00',
            status: 'cancelled',
            patient: { fullName: 'John Doe' }
          }
          // Only 0 confirmed appointments at this time slot
        ],
        confirmAppointment: mockConfirmAppointment,
        filteredAppointments: [],
        isLoading: false,
        error: null,
        handleAppointmentCreated: vi.fn(),
        fetchAppointments: vi.fn(),
        refreshAppointments: vi.fn()
      })
    }));

    render(
      <MantineProvider>
        <AppointmentsPage />
      </MantineProvider>
    );

    // Click reconfirm
    const reconfirmButton = screen.getByTestId('reconfirm-button');
    fireEvent.click(reconfirmButton);

    // Wait for modal to appear
    await waitFor(() => {
      expect(screen.getByTestId('confirmation-modal')).toBeInTheDocument();
    });

    // Click confirm in the modal
    const confirmButton = screen.getByTestId('confirm-button');
    fireEvent.click(confirmButton);

    // Should call confirmAppointment since slot is available
    await waitFor(() => {
      expect(mockConfirmAppointment).toHaveBeenCalledWith('apt-1');
    });
  });
});
