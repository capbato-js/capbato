import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { MantineProvider } from '@mantine/core';
import { PatientsTable } from './PatientsTable';
import type { PatientListDto } from '@nx-starter/application-shared';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate
  };
});

// Mock the common components
vi.mock('../../../components/common', () => ({
  DataTable: ({ data, columns }: any) => (
    <div data-testid="data-table">
      {data.map((item: any, index: number) => (
        <div key={index} data-testid={`patient-row-${item.id}`}>
          {columns.map((column: any, colIndex: number) => (
            <div key={colIndex} data-testid={`cell-${column.key}`}>
              {column.render ? column.render(item[column.key], item) : item[column.key]}
            </div>
          ))}
        </div>
      ))}
    </div>
  ),
  DataTableHeader: ({ title, onAddItem, addButtonText }: any) => (
    <div data-testid="data-table-header">
      <h2>{title}</h2>
      {onAddItem && (
        <button onClick={onAddItem} data-testid="add-patient-button">
          {addButtonText}
        </button>
      )}
    </div>
  )
}));

const mockPatients: PatientListDto[] = [
  {
    id: '1',
    patientNumber: 'P001',
    firstName: 'Maria',
    middleName: '',
    lastName: 'Santos',
    dateOfBirth: '1990-05-15',
    gender: 'Female',
    phoneNumber: '+63 912 345 6789',
    address: '123 Rizal Street, Quezon City',
    createdAt: '2024-01-15T09:00:00.000Z'
  },
  {
    id: '2',
    patientNumber: 'P002',
    firstName: 'Jose',
    middleName: 'Cruz',
    lastName: 'Reyes',
    dateOfBirth: '1985-08-22',
    gender: 'Male',
    phoneNumber: '+63 920 987 6543',
    address: '456 Bonifacio Avenue, Makati City',
    createdAt: '2024-02-10T10:15:00.000Z'
  }
];

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <MantineProvider>
      <MemoryRouter>
        {component}
      </MemoryRouter>
    </MantineProvider>
  );
};

describe('PatientsTable', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render patients table with header', () => {
    renderWithProviders(
      <PatientsTable patients={mockPatients} />
    );

    expect(screen.getByText('Patient Records')).toBeInTheDocument();
    expect(screen.getByTestId('data-table')).toBeInTheDocument();
  });

  it('should render add patient button when onAddPatient is provided', () => {
    const mockOnAddPatient = vi.fn();

    renderWithProviders(
      <PatientsTable patients={mockPatients} onAddPatient={mockOnAddPatient} />
    );

    const addButton = screen.getByTestId('add-patient-button');
    expect(addButton).toBeInTheDocument();
    expect(addButton).toHaveTextContent('Add New Patient');

    fireEvent.click(addButton);
    expect(mockOnAddPatient).toHaveBeenCalledTimes(1);
  });

  it('should not render add patient button when onAddPatient is not provided', () => {
    renderWithProviders(
      <PatientsTable patients={mockPatients} />
    );

    expect(screen.queryByTestId('add-patient-button')).not.toBeInTheDocument();
  });

  it('should render patient data with clickable links', () => {
    renderWithProviders(
      <PatientsTable patients={mockPatients} />
    );

    // Check if patient rows are rendered
    expect(screen.getByTestId('patient-row-1')).toBeInTheDocument();
    expect(screen.getByTestId('patient-row-2')).toBeInTheDocument();

    // Check if patient data is displayed
    expect(screen.getByText('P001')).toBeInTheDocument();
    expect(screen.getByText('P002')).toBeInTheDocument();
    expect(screen.getByText('Maria Santos')).toBeInTheDocument();
    expect(screen.getByText('Jose Cruz Reyes')).toBeInTheDocument();
  });

  it('should navigate to patient details when patient number link is clicked', () => {
    renderWithProviders(
      <PatientsTable patients={mockPatients} />
    );

    const patientNumberLink = screen.getByText('P001');
    fireEvent.click(patientNumberLink);

    expect(mockNavigate).toHaveBeenCalledWith('/patients/1');
  });

  it('should navigate to patient details when patient name link is clicked', () => {
    renderWithProviders(
      <PatientsTable patients={mockPatients} />
    );

    const patientNameLink = screen.getByText('Maria Santos');
    fireEvent.click(patientNameLink);

    expect(mockNavigate).toHaveBeenCalledWith('/patients/1');
  });

  it('should handle patients with middle names correctly', () => {
    renderWithProviders(
      <PatientsTable patients={mockPatients} />
    );

    // Patient with middle name should display full name
    expect(screen.getByText('Jose Cruz Reyes')).toBeInTheDocument();
    
    // Patient without middle name should display first and last name only
    expect(screen.getByText('Maria Santos')).toBeInTheDocument();
  });

  it('should render empty state when no patients provided', () => {
    renderWithProviders(
      <PatientsTable patients={[]} />
    );

    expect(screen.getByTestId('data-table')).toBeInTheDocument();
    // The DataTable component should handle empty state internally
  });

  it('should have correct column configuration', () => {
    renderWithProviders(
      <PatientsTable patients={mockPatients} />
    );

    // Check if both columns are present
    expect(screen.getByTestId('cell-patientNumber')).toBeInTheDocument();
    expect(screen.getByTestId('cell-fullName')).toBeInTheDocument();
  });
});