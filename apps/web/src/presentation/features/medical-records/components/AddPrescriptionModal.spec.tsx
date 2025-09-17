import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { AddPrescriptionModal } from './AddPrescriptionModal';

// Mock the container component
vi.mock('./AddPrescriptionModalContainer', () => ({
  AddPrescriptionModalContainer: vi.fn((props) => 
    <div data-testid="add-prescription-modal-container">
      <div>opened: {props.opened.toString()}</div>
      <div>editMode: {props.editMode?.toString() || 'false'}</div>
      <div>hasPrescription: {props.prescription ? 'true' : 'false'}</div>
      <button onClick={props.onClose}>Close</button>
      {props.onPrescriptionCreated && (
        <button onClick={() => props.onPrescriptionCreated({})}>Create</button>
      )}
      {props.onPrescriptionUpdated && (
        <button onClick={props.onPrescriptionUpdated}>Update</button>
      )}
    </div>
  )
}));

describe('AddPrescriptionModal', () => {
  const mockOnClose = vi.fn();
  const mockOnPrescriptionCreated = vi.fn();
  const mockOnPrescriptionUpdated = vi.fn();

  const mockPrescription = {
    id: '1',
    patientId: 'patient-1',
    patientName: 'John Doe',
    doctorId: 'doctor-1',
    doctorName: 'Dr. Smith',
    datePrescribed: '2024-01-01',
    medications: [],
    notes: 'Test notes',
    status: 'active'
  };

  const defaultProps = {
    opened: true,
    onClose: mockOnClose
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render AddPrescriptionModalContainer with props', () => {
    const { getByTestId } = render(<AddPrescriptionModal {...defaultProps} />);
    
    expect(getByTestId('add-prescription-modal-container')).toBeInTheDocument();
  });

  it('should pass opened prop to container', () => {
    const { getByText } = render(<AddPrescriptionModal {...defaultProps} />);
    
    expect(getByText('opened: true')).toBeInTheDocument();
  });

  it('should handle opened as false', () => {
    const { getByText } = render(
      <AddPrescriptionModal {...defaultProps} opened={false} />
    );
    
    expect(getByText('opened: false')).toBeInTheDocument();
  });

  it('should handle editMode prop', () => {
    const { getByText } = render(
      <AddPrescriptionModal {...defaultProps} editMode={true} />
    );
    
    expect(getByText('editMode: true')).toBeInTheDocument();
  });

  it('should handle editMode as false by default', () => {
    const { getByText } = render(<AddPrescriptionModal {...defaultProps} />);
    
    expect(getByText('editMode: false')).toBeInTheDocument();
  });

  it('should pass prescription prop to container', () => {
    const { getByText } = render(
      <AddPrescriptionModal {...defaultProps} prescription={mockPrescription} />
    );
    
    expect(getByText('hasPrescription: true')).toBeInTheDocument();
  });

  it('should handle null prescription', () => {
    const { getByText } = render(
      <AddPrescriptionModal {...defaultProps} prescription={null} />
    );
    
    expect(getByText('hasPrescription: false')).toBeInTheDocument();
  });

  it('should handle create mode with onPrescriptionCreated callback', () => {
    const { getByText } = render(
      <AddPrescriptionModal 
        {...defaultProps} 
        onPrescriptionCreated={mockOnPrescriptionCreated} 
      />
    );
    
    expect(getByText('Create')).toBeInTheDocument();
  });

  it('should handle edit mode with onPrescriptionUpdated callback', () => {
    const { getByText } = render(
      <AddPrescriptionModal 
        {...defaultProps} 
        editMode={true}
        prescription={mockPrescription}
        onPrescriptionUpdated={mockOnPrescriptionUpdated} 
      />
    );
    
    expect(getByText('Update')).toBeInTheDocument();
  });

  it('should handle all props together', () => {
    const props = {
      opened: true,
      onClose: mockOnClose,
      onPrescriptionCreated: mockOnPrescriptionCreated,
      editMode: false,
      prescription: null,
      onPrescriptionUpdated: mockOnPrescriptionUpdated
    };

    const { getByText } = render(<AddPrescriptionModal {...props} />);
    
    expect(getByText('opened: true')).toBeInTheDocument();
    expect(getByText('editMode: false')).toBeInTheDocument();
    expect(getByText('hasPrescription: false')).toBeInTheDocument();
  });

  it('should work with minimal required props', () => {
    const minimalProps = {
      opened: false,
      onClose: mockOnClose
    };

    const { getByTestId } = render(<AddPrescriptionModal {...minimalProps} />);
    
    expect(getByTestId('add-prescription-modal-container')).toBeInTheDocument();
  });

  it('should handle complex prescription object', () => {
    const complexPrescription = {
      ...mockPrescription,
      medications: [
        {
          name: 'Paracetamol',
          dosage: '500mg',
          frequency: 'Every 6 hours',
          duration: '3 days',
          instructions: 'Take with food'
        }
      ]
    };

    const { getByText } = render(
      <AddPrescriptionModal 
        {...defaultProps} 
        prescription={complexPrescription}
        editMode={true}
      />
    );
    
    expect(getByText('hasPrescription: true')).toBeInTheDocument();
    expect(getByText('editMode: true')).toBeInTheDocument();
  });
});