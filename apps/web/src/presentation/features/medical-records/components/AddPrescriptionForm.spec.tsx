import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { AddPrescriptionForm } from './AddPrescriptionForm';

// Mock the container component
vi.mock('./AddPrescriptionFormContainer', () => ({
  AddPrescriptionFormContainer: vi.fn((props) => 
    <div data-testid="add-prescription-form-container">
      <div>isLoading: {props.isLoading.toString()}</div>
      <div>error: {props.error || 'none'}</div>
      <div>editMode: {props.editMode?.toString() || 'false'}</div>
      <div>hasInitialData: {props.initialData ? 'true' : 'false'}</div>
      <button onClick={() => props.onSubmit({ test: 'data' })}>Submit</button>
    </div>
  )
}));

describe('AddPrescriptionForm', () => {
  const mockOnSubmit = vi.fn().mockResolvedValue(true);
  const defaultProps = {
    onSubmit: mockOnSubmit,
    isLoading: false,
    error: null
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render AddPrescriptionFormContainer with props', () => {
    const { getByTestId } = render(<AddPrescriptionForm {...defaultProps} />);
    
    expect(getByTestId('add-prescription-form-container')).toBeInTheDocument();
  });

  it('should pass isLoading prop to container', () => {
    const { getByText } = render(
      <AddPrescriptionForm {...defaultProps} isLoading={true} />
    );
    
    expect(getByText('isLoading: true')).toBeInTheDocument();
  });

  it('should pass error prop to container', () => {
    const errorMessage = 'Test error';
    const { getByText } = render(
      <AddPrescriptionForm {...defaultProps} error={errorMessage} />
    );
    
    expect(getByText(`error: ${errorMessage}`)).toBeInTheDocument();
  });

  it('should handle editMode prop', () => {
    const { getByText } = render(
      <AddPrescriptionForm {...defaultProps} editMode={true} />
    );
    
    expect(getByText('editMode: true')).toBeInTheDocument();
  });

  it('should handle editMode as false by default', () => {
    const { getByText } = render(<AddPrescriptionForm {...defaultProps} />);
    
    expect(getByText('editMode: false')).toBeInTheDocument();
  });

  it('should pass initialData prop to container', () => {
    const initialData = {
      patientId: 'patient-1',
      patientName: 'John Doe',
      patientNumber: 'P123',
      doctorId: 'doctor-1',
      doctorName: 'Dr. Smith',
      datePrescribed: '2024-01-01',
      medications: [],
      notes: 'Test notes'
    };

    const { getByText } = render(
      <AddPrescriptionForm {...defaultProps} initialData={initialData} />
    );
    
    expect(getByText('hasInitialData: true')).toBeInTheDocument();
  });

  it('should handle no initialData', () => {
    const { getByText } = render(<AddPrescriptionForm {...defaultProps} />);
    
    expect(getByText('hasInitialData: false')).toBeInTheDocument();
  });

  it('should pass onClearError prop to container', () => {
    const mockOnClearError = vi.fn();
    render(
      <AddPrescriptionForm {...defaultProps} onClearError={mockOnClearError} />
    );
    
    // Container should receive the onClearError function
    expect(mockOnClearError).not.toHaveBeenCalled();
  });

  it('should handle all props together', () => {
    const props = {
      onSubmit: mockOnSubmit,
      isLoading: true,
      error: 'Test error',
      editMode: true,
      initialData: {
        patientId: 'patient-1',
        medications: []
      },
      onClearError: vi.fn()
    };

    const { getByText } = render(<AddPrescriptionForm {...props} />);
    
    expect(getByText('isLoading: true')).toBeInTheDocument();
    expect(getByText('error: Test error')).toBeInTheDocument();
    expect(getByText('editMode: true')).toBeInTheDocument();
    expect(getByText('hasInitialData: true')).toBeInTheDocument();
  });

  it('should handle null and undefined values gracefully', () => {
    const props = {
      onSubmit: mockOnSubmit,
      isLoading: false,
      error: null,
      editMode: undefined,
      initialData: undefined,
      onClearError: undefined
    };

    const { getByText } = render(<AddPrescriptionForm {...props} />);
    
    expect(getByText('error: none')).toBeInTheDocument();
    expect(getByText('editMode: false')).toBeInTheDocument();
    expect(getByText('hasInitialData: false')).toBeInTheDocument();
  });
});