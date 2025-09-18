import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { AddLabTestResultForm } from './AddLabTestResultForm';

// Mock the container component
vi.mock('./AddLabTestResultFormContainer', () => ({
  AddLabTestResultFormContainer: vi.fn((props) => 
    <div data-testid="add-lab-test-result-form-container">
      <div>testType: {props.testType || 'none'}</div>
      <div>viewMode: {props.viewMode?.toString() || 'false'}</div>
      <div>isSubmitting: {props.isSubmitting?.toString() || 'false'}</div>
      <div>hasExistingData: {props.existingData ? 'true' : 'false'}</div>
      <div>hasPatientData: {props.patientData ? 'true' : 'false'}</div>
      <div>enabledFieldsCount: {props.enabledFields?.length || 0}</div>
      <div>error: {props.error || 'none'}</div>
      <button onClick={() => props.onSubmit({ testField: 'value' })}>Submit</button>
      {props.onCancel && <button onClick={props.onCancel}>Cancel</button>}
    </div>
  )
}));

describe('AddLabTestResultForm', () => {
  const mockOnSubmit = vi.fn();
  const mockOnCancel = vi.fn();

  const defaultProps = {
    onSubmit: mockOnSubmit
  };

  const mockPatientData = {
    patientNumber: 'P12345',
    patientName: 'John Doe',
    name: 'John Doe',
    age: 30,
    gender: 'Male',
    sex: 'Male',
    address: '123 Main St',
    doctorName: 'Dr. Smith',
    dateRequested: '2024-01-01'
  };

  const mockExistingData = {
    bloodPressure: '120/80',
    heartRate: '72',
    temperature: '98.6'
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render AddLabTestResultFormContainer with props', () => {
    const { getByTestId } = render(<AddLabTestResultForm {...defaultProps} />);
    
    expect(getByTestId('add-lab-test-result-form-container')).toBeInTheDocument();
  });

  it('should pass testType prop to container', () => {
    const { getByText } = render(
      <AddLabTestResultForm {...defaultProps} testType="urinalysis" />
    );
    
    expect(getByText('testType: urinalysis')).toBeInTheDocument();
  });

  it('should handle no testType', () => {
    const { getByText } = render(<AddLabTestResultForm {...defaultProps} />);
    
    expect(getByText('testType: none')).toBeInTheDocument();
  });

  it('should pass viewMode prop to container', () => {
    const { getByText } = render(
      <AddLabTestResultForm {...defaultProps} viewMode={true} />
    );
    
    expect(getByText('viewMode: true')).toBeInTheDocument();
  });

  it('should handle viewMode as false by default', () => {
    const { getByText } = render(<AddLabTestResultForm {...defaultProps} />);
    
    expect(getByText('viewMode: false')).toBeInTheDocument();
  });

  it('should pass isSubmitting prop to container', () => {
    const { getByText } = render(
      <AddLabTestResultForm {...defaultProps} isSubmitting={true} />
    );
    
    expect(getByText('isSubmitting: true')).toBeInTheDocument();
  });

  it('should pass existingData prop to container', () => {
    const { getByText } = render(
      <AddLabTestResultForm {...defaultProps} existingData={mockExistingData} />
    );
    
    expect(getByText('hasExistingData: true')).toBeInTheDocument();
  });

  it('should handle no existingData', () => {
    const { getByText } = render(<AddLabTestResultForm {...defaultProps} />);
    
    expect(getByText('hasExistingData: false')).toBeInTheDocument();
  });

  it('should pass patientData prop to container', () => {
    const { getByText } = render(
      <AddLabTestResultForm {...defaultProps} patientData={mockPatientData} />
    );
    
    expect(getByText('hasPatientData: true')).toBeInTheDocument();
  });

  it('should handle no patientData', () => {
    const { getByText } = render(<AddLabTestResultForm {...defaultProps} />);
    
    expect(getByText('hasPatientData: false')).toBeInTheDocument();
  });

  it('should pass enabledFields prop to container', () => {
    const enabledFields = ['field1', 'field2', 'field3'];
    const { getByText } = render(
      <AddLabTestResultForm {...defaultProps} enabledFields={enabledFields} />
    );
    
    expect(getByText('enabledFieldsCount: 3')).toBeInTheDocument();
  });

  it('should handle empty enabledFields', () => {
    const { getByText } = render(
      <AddLabTestResultForm {...defaultProps} enabledFields={[]} />
    );
    
    expect(getByText('enabledFieldsCount: 0')).toBeInTheDocument();
  });

  it('should pass error prop to container', () => {
    const errorMessage = 'Validation failed';
    const { getByText } = render(
      <AddLabTestResultForm {...defaultProps} error={errorMessage} />
    );
    
    expect(getByText(`error: ${errorMessage}`)).toBeInTheDocument();
  });

  it('should handle null error', () => {
    const { getByText } = render(
      <AddLabTestResultForm {...defaultProps} error={null} />
    );
    
    expect(getByText('error: none')).toBeInTheDocument();
  });

  it('should pass onCancel prop when provided', () => {
    const { getByText } = render(
      <AddLabTestResultForm {...defaultProps} onCancel={mockOnCancel} />
    );
    
    expect(getByText('Cancel')).toBeInTheDocument();
  });

  it('should not render cancel button when onCancel is not provided', () => {
    const { queryByText } = render(<AddLabTestResultForm {...defaultProps} />);
    
    expect(queryByText('Cancel')).not.toBeInTheDocument();
  });

  it('should handle all props together', () => {
    const props = {
      testType: 'blood_test' as any,
      enabledFields: ['field1', 'field2'],
      viewMode: true,
      existingData: mockExistingData,
      isLoadingData: true,
      submitButtonText: 'Save Results',
      patientData: mockPatientData,
      onSubmit: mockOnSubmit,
      onCancel: mockOnCancel,
      isSubmitting: false,
      error: 'Test error'
    };

    const { getByText } = render(<AddLabTestResultForm {...props} />);
    
    expect(getByText('testType: blood_test')).toBeInTheDocument();
    expect(getByText('viewMode: true')).toBeInTheDocument();
    expect(getByText('isSubmitting: false')).toBeInTheDocument();
    expect(getByText('hasExistingData: true')).toBeInTheDocument();
    expect(getByText('hasPatientData: true')).toBeInTheDocument();
    expect(getByText('enabledFieldsCount: 2')).toBeInTheDocument();
    expect(getByText('error: Test error')).toBeInTheDocument();
    expect(getByText('Cancel')).toBeInTheDocument();
  });

  it('should work with minimal required props', () => {
    const minimalProps = {
      onSubmit: mockOnSubmit
    };

    const { getByTestId } = render(<AddLabTestResultForm {...minimalProps} />);
    
    expect(getByTestId('add-lab-test-result-form-container')).toBeInTheDocument();
  });
});