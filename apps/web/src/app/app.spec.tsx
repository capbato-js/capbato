import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import App from './app';

// Mock all the page components to avoid complex dependencies
vi.mock('../presentation/features/todo', () => ({
  TodoPage: () => <div data-testid="todo-page">Todo Page</div>,
}));

vi.mock('../presentation/features/about', () => ({
  AboutPage: () => <div data-testid="about-page">About Page</div>,
}));

vi.mock('../presentation/features/login', () => ({
  LoginPage: () => <div data-testid="login-page">Login Page</div>,
}));

vi.mock('../presentation/features/dashboard', () => ({
  DashboardPage: () => <div data-testid="dashboard-page">Dashboard Page</div>,
}));

vi.mock('../presentation/features/appointments', () => ({
  AppointmentsPage: () => <div data-testid="appointments-page">Appointments Page</div>,
}));

vi.mock('../presentation/features/patients', () => ({
  PatientsPage: () => <div data-testid="patients-page">Patients Page</div>,
  AddPatientPage: () => <div data-testid="add-patient-page">Add Patient Page</div>,
  EditPatientPage: () => <div data-testid="edit-patient-page">Edit Patient Page</div>,
}));

vi.mock('../presentation/features/patients/pages/PatientDetailsPage', () => ({
  PatientDetailsPage: () => <div data-testid="patient-details-page">Patient Details Page</div>,
}));

vi.mock('../presentation/features/medical-records', () => ({
  LaboratoryPage: () => <div data-testid="laboratory-page">Laboratory Page</div>,
  LaboratoryTestsPage: () => <div data-testid="laboratory-tests-page">Laboratory Tests Page</div>,
  PrescriptionsPage: () => <div data-testid="prescriptions-page">Prescriptions Page</div>,
  AddLabTestPage: () => <div data-testid="add-lab-test-page">Add Lab Test Page</div>,
  AddLabTestResultPage: () => <div data-testid="add-lab-test-result-page">Add Lab Test Result Page</div>,
  EditLabTestResultPage: () => <div data-testid="edit-lab-test-result-page">Edit Lab Test Result Page</div>,
  ViewLabTestResultPage: () => <div data-testid="view-lab-test-result-page">View Lab Test Result Page</div>,
}));

vi.mock('../presentation/features/transactions', () => ({
  TransactionsPage: () => <div data-testid="transactions-page">Transactions Page</div>,
}));

vi.mock('../presentation/features/staff', () => ({
  DoctorsPage: () => <div data-testid="doctors-page">Doctors Page</div>,
  AccountsPage: () => <div data-testid="accounts-page">Accounts Page</div>,
}));

// Mock Auth components
vi.mock('../presentation/features/auth', () => ({
  AuthGuard: ({ children }: any) => children,
  RoleGuard: ({ children }: any) => children,
}));

// Mock AuthStore
const mockAuthStore = {
  checkAuthState: vi.fn(),
};

vi.mock('../infrastructure/state/AuthStore', () => ({
  useAuthStore: () => mockAuthStore,
}));

describe('App', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render successfully', () => {
    const { baseElement } = render(<App />);
    expect(baseElement).toBeTruthy();
  });

  it('should initialize authentication state on mount', () => {
    render(<App />);
    expect(mockAuthStore.checkAuthState).toHaveBeenCalledTimes(1);
  });

  it('should wrap routes with BrowserRouter', () => {
    // The component should render without throwing router-related errors
    expect(() => render(<App />)).not.toThrow();
  });

  it('should be a functional component', () => {
    // Verify that App is a proper React component
    expect(typeof App).toBe('function');
    expect(App.name).toBe('App');
  });

  it('should handle authentication state initialization', () => {
    const { rerender } = render(<App />);
    expect(mockAuthStore.checkAuthState).toHaveBeenCalledTimes(1);
    
    // Re-render shouldn't call checkAuthState again if dependencies haven't changed
    rerender(<App />);
    expect(mockAuthStore.checkAuthState).toHaveBeenCalledTimes(1);
  });
});
