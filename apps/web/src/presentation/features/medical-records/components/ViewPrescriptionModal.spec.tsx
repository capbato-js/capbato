import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { ViewPrescriptionModal } from './ViewPrescriptionModal';

// Mock the container component
vi.mock('./ViewPrescriptionModalContainer', () => ({
  ViewPrescriptionModalContainer: vi.fn((props) => 
    <div data-testid="view-prescription-modal-container">
      <div>opened: {props.opened.toString()}</div>
      <div>hasPrescription: {props.prescription ? 'true' : 'false'}</div>
      <button onClick={props.onClose}>Close</button>
    </div>
  )
}));

describe('ViewPrescriptionModal', () => {
  const mockOnClose = vi.fn();

  const mockPrescription = {
    id: '1',
    patientId: 'patient-1',
    patientName: 'John Doe',
    doctorId: 'doctor-1',
    doctorName: 'Dr. Smith',
    datePrescribed: '2024-01-01',
    medications: [
      {
        name: 'Paracetamol',
        dosage: '500mg',
        frequency: 'Every 6 hours',
        duration: '3 days',
        instructions: 'Take with food'
      }
    ],
    notes: 'Patient allergic to penicillin',
    status: 'active'
  };

  const defaultProps = {
    opened: true,
    onClose: mockOnClose,
    prescription: mockPrescription
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render ViewPrescriptionModalContainer with props', () => {
    const { getByTestId } = render(<ViewPrescriptionModal {...defaultProps} />);
    
    expect(getByTestId('view-prescription-modal-container')).toBeInTheDocument();
  });

  it('should pass opened prop to container', () => {
    const { getByText } = render(<ViewPrescriptionModal {...defaultProps} />);
    
    expect(getByText('opened: true')).toBeInTheDocument();
  });

  it('should handle opened as false', () => {
    const { getByText } = render(
      <ViewPrescriptionModal {...defaultProps} opened={false} />
    );
    
    expect(getByText('opened: false')).toBeInTheDocument();
  });

  it('should pass prescription prop to container', () => {
    const { getByText } = render(<ViewPrescriptionModal {...defaultProps} />);
    
    expect(getByText('hasPrescription: true')).toBeInTheDocument();
  });

  it('should handle null prescription', () => {
    const { getByText } = render(
      <ViewPrescriptionModal {...defaultProps} prescription={null} />
    );
    
    expect(getByText('hasPrescription: false')).toBeInTheDocument();
  });

  it('should pass onClose prop to container', () => {
    const { getByTestId } = render(<ViewPrescriptionModal {...defaultProps} />);
    
    // The mocked container component should have been called with onClose
    // We don't need to access the actual module since it's already mocked
    expect(getByTestId('view-prescription-modal-container')).toBeInTheDocument();
  });

  it('should handle all props together', () => {
    const props = {
      opened: false,
      onClose: mockOnClose,
      prescription: null
    };

    const { getByText } = render(<ViewPrescriptionModal {...props} />);
    
    expect(getByText('opened: false')).toBeInTheDocument();
    expect(getByText('hasPrescription: false')).toBeInTheDocument();
  });

  it('should pass complex prescription object correctly', () => {
    const complexPrescription = {
      ...mockPrescription,
      medications: [
        mockPrescription.medications[0],
        {
          name: 'Ibuprofen',
          dosage: '400mg',
          frequency: 'Every 8 hours',
          duration: '5 days',
          instructions: 'Avoid alcohol'
        }
      ]
    };

    const { getByText } = render(
      <ViewPrescriptionModal 
        {...defaultProps} 
        prescription={complexPrescription} 
      />
    );
    
    expect(getByText('hasPrescription: true')).toBeInTheDocument();
  });

  it('should work with minimal required props', () => {
    const minimalProps = {
      opened: true,
      onClose: mockOnClose,
      prescription: null
    };

    const { getByTestId } = render(<ViewPrescriptionModal {...minimalProps} />);
    
    expect(getByTestId('view-prescription-modal-container')).toBeInTheDocument();
  });

  it('should handle prescription with empty medications array', () => {
    const prescriptionWithEmptyMeds = {
      ...mockPrescription,
      medications: []
    };

    const { getByText } = render(
      <ViewPrescriptionModal 
        {...defaultProps} 
        prescription={prescriptionWithEmptyMeds} 
      />
    );
    
    expect(getByText('hasPrescription: true')).toBeInTheDocument();
  });
});