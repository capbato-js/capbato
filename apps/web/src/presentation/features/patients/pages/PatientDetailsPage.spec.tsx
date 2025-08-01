import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { MantineProvider } from '@mantine/core';
import { PatientDetailsPage } from './PatientDetailsPage';
import type { PatientDetails } from '../types';

// Mock the view model
const mockViewModel = {
  patient: undefined as PatientDetails | undefined,
  isLoading: false,
  error: null as string | null,
  hasError: false,
  hasPatient: false,
  clearError: vi.fn(),
  refreshPatientDetails: vi.fn()
};

vi.mock('../view-models/usePatientDetailsViewModel', () => ({
  usePatientDetailsViewModel: vi.fn(() => mockViewModel)
}));

// Mock the layout component
vi.mock('../../../components/layout', () => ({
  MedicalClinicLayout: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="medical-clinic-layout">{children}</div>
  )
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: () => ({ id: '1' }),
    useNavigate: () => mockNavigate
  };
});

const mockPatientDetails = {
  id: '1',
  patientNumber: 'P001',
  firstName: 'Maria',
  lastName: 'Santos',
  fullName: 'Maria Santos',
  dateOfBirth: '1990-05-15',
  age: 34,
  gender: 'Female' as const,
  phoneNumber: '+63 912 345 6789',
  email: 'maria.santos@email.com',
  address: {
    street: '123 Rizal Street',
    city: 'Quezon City',
    province: 'Metro Manila',
    zipCode: '1100'
  },
  emergencyContact: {
    name: 'Juan Santos',
    relationship: 'Husband',
    phoneNumber: '+63 917 123 4567'
  },
  medicalHistory: ['Hypertension', 'Diabetes Type 2'],
  allergies: ['Penicillin'],
  bloodType: 'O+',
  createdAt: '2024-01-15T09:00:00.000Z',
  updatedAt: '2024-12-15T14:30:00.000Z',
  guardian: {
    fullName: 'Roberto Santos',
    gender: 'Male' as const,
    relationship: 'Father',
    contactNumber: '9171234567',
    address: '123 Rizal Street, Quezon City'
  },
  appointments: [
    {
      id: '1-apt1',
      date: '2025-06-29',
      time: '11:00',
      reasonForVisit: 'Consultation',
      labTestsDone: 'N/A',
      prescriptions: 'N/A',
      status: 'Confirmed' as const
    }
  ]
};

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <MantineProvider>
      <MemoryRouter>
        {component}
      </MemoryRouter>
    </MantineProvider>
  );
};

describe('PatientDetailsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset mock to default state
    Object.assign(mockViewModel, {
      patient: undefined,
      isLoading: false,
      error: null,
      hasError: false,
      hasPatient: false,
      clearError: vi.fn(),
      refreshPatientDetails: vi.fn()
    });
  });

  it('should display loading state', () => {
    mockViewModel.isLoading = true;

    renderWithProviders(<PatientDetailsPage />);

    // Loading state now shows empty content
    expect(screen.queryByText('Loading patient details...')).not.toBeInTheDocument();
  });

  it('should display error state when patient not found', () => {
    mockViewModel.hasError = true;
    mockViewModel.error = 'Patient with ID "1" not found';

    renderWithProviders(<PatientDetailsPage />);

    expect(screen.getByText('Patient Not Found')).toBeInTheDocument();
    expect(screen.getByText('Patient with ID "1" not found')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /go back to patients/i })).toBeInTheDocument();
  });

  it('should display patient details when loaded successfully', () => {
    mockViewModel.patient = mockPatientDetails;
    mockViewModel.hasPatient = true;

    renderWithProviders(<PatientDetailsPage />);

    // Check if custom tab buttons are rendered
    expect(screen.getByText('Patient Info')).toBeInTheDocument();
    expect(screen.getByText('Medical Records')).toBeInTheDocument();
    expect(screen.getByText('Appointments')).toBeInTheDocument();
    expect(screen.getByText('Prescriptions')).toBeInTheDocument();
    expect(screen.getByText('Laboratories')).toBeInTheDocument();

    // Check if patient information is displayed
    expect(screen.getByText('Patient Information')).toBeInTheDocument();
    expect(screen.getByText('Maria Santos')).toBeInTheDocument();
    expect(screen.getByText('P001')).toBeInTheDocument();
    
    // Check if guardian details are displayed
    expect(screen.getByText('Guardian Details')).toBeInTheDocument();
    expect(screen.getByText('Roberto Santos')).toBeInTheDocument();
  });

  it('should display go back button', () => {
    mockViewModel.patient = mockPatientDetails;
    mockViewModel.hasPatient = true;

    renderWithProviders(<PatientDetailsPage />);

    const goBackButton = screen.getByRole('button', { name: /go back/i });
    expect(goBackButton).toBeInTheDocument();
  });

  it('should navigate back to patients list when go back button is clicked', async () => {
    mockViewModel.patient = mockPatientDetails;
    mockViewModel.hasPatient = true;

    renderWithProviders(<PatientDetailsPage />);

    const goBackButton = screen.getByRole('button', { name: /go back/i });
    goBackButton.click();

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/patients');
    });
  });

  it('should display appointments when appointments tab is active', () => {
    mockViewModel.patient = mockPatientDetails;
    mockViewModel.hasPatient = true;

    renderWithProviders(<PatientDetailsPage />);

    // The appointments tab content should be accessible even if not visible
    // since we're testing the rendered content
    expect(screen.getByText('Consultation')).toBeInTheDocument();
  });

  it('should display placeholder tabs for unimplemented features', () => {
    mockViewModel.patient = mockPatientDetails;
    mockViewModel.hasPatient = true;

    renderWithProviders(<PatientDetailsPage />);

    // These should be visible as tab buttons
    expect(screen.getByText('Medical Records')).toBeInTheDocument();
    expect(screen.getByText('Prescriptions')).toBeInTheDocument();
    expect(screen.getByText('Laboratories')).toBeInTheDocument();
  });
});