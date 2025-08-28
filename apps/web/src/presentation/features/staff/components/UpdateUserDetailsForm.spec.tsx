import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { renderWithProviders } from '../../../../test/test-utils';
import { UpdateUserDetailsForm } from './UpdateUserDetailsForm';
import { UpdateUserDetailsFormData, UpdateUserDetailsCommand } from '@nx-starter/application-shared';

// Mock the schedule patterns hook
vi.mock('../hooks/useAvailableSchedulePatterns', () => ({
  useAvailableSchedulePatterns: () => ({
    scheduleOptions: [
      { value: 'MWF', label: 'Monday, Wednesday, Friday', available: true, takenBy: null },
      { value: 'TTH', label: 'Tuesday, Thursday', available: false, takenBy: 'Dr. Smith' }
    ],
    loading: false
  })
}));

// Mock the NameFormattingService
vi.mock('@nx-starter/domain', () => ({
  NameFormattingService: {
    formatToProperCase: (name: string) => name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()
  }
}));

// Mock the FormTextInput component
vi.mock('../../../components/ui/FormTextInput', () => ({
  FormTextInput: ({ label, error, ...props }: any) => (
    <div>
      <label>{label}</label>
      <input data-testid={`input-${label.toLowerCase().replace(/\s/g, '-')}`} {...props} />
      {error && <span data-testid="error">{error.message || error}</span>}
    </div>
  )
}));

describe('UpdateUserDetailsForm', () => {
  const mockUserData: UpdateUserDetailsFormData = {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    role: 'admin',
    mobile: '09123456789'
  };

  const mockDoctorData: UpdateUserDetailsFormData = {
    id: '2',
    firstName: 'Dr. Jane',
    lastName: 'Smith',
    email: 'jane.smith@example.com',
    role: 'doctor',
    mobile: '09987654321',
    specialization: 'Cardiology',
    licenseNumber: 'MD12345',
    experienceYears: 10,
    schedulePattern: 'MWF'
  };

  const mockOnSubmit = vi.fn();
  const mockOnClearError = vi.fn();
  const mockOnClearFieldErrors = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders form with pre-populated user data', () => {
    renderWithProviders(
      <UpdateUserDetailsForm
        userData={mockUserData}
        onSubmit={mockOnSubmit}
        isLoading={false}
      />
    );

    expect(screen.getByDisplayValue('John')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Doe')).toBeInTheDocument();
    expect(screen.getByDisplayValue('john.doe@example.com')).toBeInTheDocument();
    expect(screen.getByDisplayValue('09123456789')).toBeInTheDocument();
  });

  it('shows single step form for non-doctor roles', () => {
    renderWithProviders(
      <UpdateUserDetailsForm
        userData={mockUserData}
        onSubmit={mockOnSubmit}
        isLoading={false}
      />
    );

    expect(screen.getByText('Update User Details')).toBeInTheDocument();
    expect(screen.queryByText('Next')).not.toBeInTheDocument();
    expect(screen.queryByText('Previous')).not.toBeInTheDocument();
  });

  it('shows multi-step form for doctor role', () => {
    renderWithProviders(
      <UpdateUserDetailsForm
        userData={mockDoctorData}
        onSubmit={mockOnSubmit}
        isLoading={false}
      />
    );

    expect(screen.getByText('Next')).toBeInTheDocument();
  });

  it('navigates between steps for doctor role', async () => {
    renderWithProviders(
      <UpdateUserDetailsForm
        userData={mockDoctorData}
        onSubmit={mockOnSubmit}
        isLoading={false}
      />
    );

    // Should be on step 1
    expect(screen.getByText('Next')).toBeInTheDocument();

    // Click Next to go to step 2
    fireEvent.click(screen.getByText('Next'));

    await waitFor(() => {
      expect(screen.getByText('Previous')).toBeInTheDocument();
      expect(screen.getByText('Update User Details')).toBeInTheDocument();
    });

    // Click Previous to go back to step 1
    fireEvent.click(screen.getByText('Previous'));

    await waitFor(() => {
      expect(screen.getByText('Next')).toBeInTheDocument();
    });
  });

  it('calls onSubmit with correct data for non-doctor user', async () => {
    mockOnSubmit.mockResolvedValue(true);

    renderWithProviders(
      <UpdateUserDetailsForm
        userData={mockUserData}
        onSubmit={mockOnSubmit}
        isLoading={false}
      />
    );

    // Fill in the form
    fireEvent.change(screen.getByDisplayValue('John'), { target: { value: 'Johnny' } });

    // Submit the form
    fireEvent.click(screen.getByText('Update User Details'));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          id: '1',
          firstName: 'Johnny',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          role: 'admin',
          mobile: '09123456789'
        })
      );
    });
  });

  it('calls onSubmit with doctor data when role is doctor', async () => {
    mockOnSubmit.mockResolvedValue(true);

    renderWithProviders(
      <UpdateUserDetailsForm
        userData={mockDoctorData}
        onSubmit={mockOnSubmit}
        isLoading={false}
      />
    );

    // Navigate to step 2
    fireEvent.click(screen.getByText('Next'));

    await waitFor(() => {
      expect(screen.getByText('Update User Details')).toBeInTheDocument();
    });

    // Submit the form
    fireEvent.click(screen.getByText('Update User Details'));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          id: '2',
          firstName: 'Dr. Jane',
          lastName: 'Smith',
          email: 'jane.smith@example.com',
          role: 'doctor',
          mobile: '09987654321',
          specialization: 'Cardiology',
          licenseNumber: 'MD12345',
          experienceYears: 10,
          schedulePattern: 'MWF'
        })
      );
    });
  });

  it('displays loading state', () => {
    renderWithProviders(
      <UpdateUserDetailsForm
        userData={mockUserData}
        onSubmit={mockOnSubmit}
        isLoading={true}
      />
    );

    expect(screen.getByText('Updating Details...')).toBeInTheDocument();
  });

  it('displays error message', () => {
    renderWithProviders(
      <UpdateUserDetailsForm
        userData={mockUserData}
        onSubmit={mockOnSubmit}
        isLoading={false}
        error="Update failed"
      />
    );

    expect(screen.getByText('Update failed')).toBeInTheDocument();
  });

  it('clears errors when user types', () => {
    renderWithProviders(
      <UpdateUserDetailsForm
        userData={mockUserData}
        onSubmit={mockOnSubmit}
        isLoading={false}
        error="Some error"
        onClearError={mockOnClearError}
        fieldErrors={{ firstName: 'Required' }}
        onClearFieldErrors={mockOnClearFieldErrors}
      />
    );

    fireEvent.change(screen.getByDisplayValue('John'), { target: { value: 'Johnny' } });

    expect(mockOnClearError).toHaveBeenCalled();
    expect(mockOnClearFieldErrors).toHaveBeenCalled();
  });

  it('formats names on blur', async () => {
    renderWithProviders(
      <UpdateUserDetailsForm
        userData={mockUserData}
        onSubmit={mockOnSubmit}
        isLoading={false}
      />
    );

    const firstNameInput = screen.getByDisplayValue('John');
    fireEvent.change(firstNameInput, { target: { value: 'johnny' } });
    fireEvent.blur(firstNameInput);

    await waitFor(() => {
      expect(firstNameInput).toHaveValue('Johnny');
    });
  });
});