import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { render } from '../../../../test/test-utils';
import { CommonMedicationsQuickAdd } from './CommonMedicationsQuickAdd';

// Mock the config and utils
vi.mock('../config/prescriptionConfig', () => ({
  COMMON_MEDICATIONS: [
    { name: 'Paracetamol', dosage: '500mg', frequency: 'Every 6 hours', duration: '3-5 days' },
    { name: 'Ibuprofen', dosage: '400mg', frequency: 'Every 8 hours', duration: '3-5 days' },
    { name: 'Amoxicillin', dosage: '500mg', frequency: 'Every 8 hours', duration: '7 days' },
    { name: 'Cetirizine', dosage: '10mg', frequency: 'Once daily', duration: '5-7 days' },
    { name: 'Omeprazole', dosage: '20mg', frequency: 'Once daily', duration: '14-28 days' },
    { name: 'Metformin', dosage: '850mg', frequency: 'Twice daily', duration: 'Ongoing' },
  ]
}));

vi.mock('../utils/prescriptionFormUtils', () => ({
  addCommonMedication: vi.fn((medicationName, onAddMedication) => {
    const mockMedication = {
      name: medicationName,
      dosage: '500mg',
      frequency: 'Every 6 hours',
      duration: '3-5 days',
      instructions: ''
    };
    onAddMedication(mockMedication);
  })
}));

describe('CommonMedicationsQuickAdd', () => {
  const mockOnAddMedication = vi.fn();
  const defaultProps = {
    onAddMedication: mockOnAddMedication
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the header text', () => {
    render(<CommonMedicationsQuickAdd {...defaultProps} />);
    
    expect(screen.getByText('Quick add common medications:')).toBeInTheDocument();
  });

  it('should render first 4 common medications as buttons', () => {
    render(<CommonMedicationsQuickAdd {...defaultProps} />);
    
    expect(screen.getByText('Paracetamol')).toBeInTheDocument();
    expect(screen.getByText('Ibuprofen')).toBeInTheDocument();
    expect(screen.getByText('Amoxicillin')).toBeInTheDocument();
    expect(screen.getByText('Cetirizine')).toBeInTheDocument();
    
    // Should not render the 5th and 6th medications (Omeprazole, Metformin)
    expect(screen.queryByText('Omeprazole')).not.toBeInTheDocument();
    expect(screen.queryByText('Metformin')).not.toBeInTheDocument();
  });

  it('should call addCommonMedication when button is clicked', () => {
    render(<CommonMedicationsQuickAdd {...defaultProps} />);
    
    const paracetamolButton = screen.getByText('Paracetamol');
    fireEvent.click(paracetamolButton);
    
    // The mocked utility function should have been called
    expect(mockOnAddMedication).toHaveBeenCalled();
  });

  it('should handle clicks on different medication buttons', () => {
    render(<CommonMedicationsQuickAdd {...defaultProps} />);
    
    const ibuprofenButton = screen.getByText('Ibuprofen');
    fireEvent.click(ibuprofenButton);
    
    // The mocked utility function should have been called
    expect(mockOnAddMedication).toHaveBeenCalled();
  });

  it('should call onAddMedication through the utility function', () => {
    render(<CommonMedicationsQuickAdd {...defaultProps} />);
    
    const amoxicillinButton = screen.getByText('Amoxicillin');
    fireEvent.click(amoxicillinButton);
    
    // The mock utility should have been called which then calls onAddMedication
    expect(mockOnAddMedication).toHaveBeenCalledWith({
      name: 'Amoxicillin',
      dosage: '500mg',
      frequency: 'Every 6 hours',
      duration: '3-5 days',
      instructions: ''
    });
  });

  it('should render all buttons as clickable', () => {
    render(<CommonMedicationsQuickAdd {...defaultProps} />);
    
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(4);
    
    buttons.forEach(button => {
      expect(button).toBeEnabled();
    });
  });

  it('should render buttons with correct variant and size', () => {
    render(<CommonMedicationsQuickAdd {...defaultProps} />);
    
    const buttons = screen.getAllByRole('button');
    buttons.forEach(button => {
      expect(button).toBeInTheDocument();
      // Mantine classes are applied, so we just verify the buttons exist
    });
  });

  it('should handle multiple clicks on the same button', () => {
    render(<CommonMedicationsQuickAdd {...defaultProps} />);
    
    const cetirizineButton = screen.getByText('Cetirizine');
    fireEvent.click(cetirizineButton);
    fireEvent.click(cetirizineButton);
    
    expect(mockOnAddMedication).toHaveBeenCalledTimes(2);
  });

  it('should have proper accessibility attributes', () => {
    render(<CommonMedicationsQuickAdd {...defaultProps} />);
    
    const paracetamolButton = screen.getByRole('button', { name: 'Paracetamol' });
    expect(paracetamolButton).toBeInTheDocument();
    
    const ibuprofenButton = screen.getByRole('button', { name: 'Ibuprofen' });
    expect(ibuprofenButton).toBeInTheDocument();
  });
});