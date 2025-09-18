import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { render } from '../../../../../test/test-utils';
import { AddLabTestResultPagePresenter } from './AddLabTestResultPagePresenter';

// Mock the layout component
vi.mock('../../../../components/layout', () => ({
  MedicalClinicLayout: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="medical-clinic-layout">{children}</div>
  )
}));

// Mock the form component
vi.mock('../../components', () => ({
  AddLabTestResultForm: ({ 
    testType,
    enabledFields,
    viewMode,
    existingData,
    isLoadingData,
    submitButtonText,
    patientData,
    onSubmit, 
    onCancel,
    isSubmitting,
    error 
  }: { 
    testType?: string;
    enabledFields?: string[];
    viewMode?: boolean;
    existingData?: Record<string, string>;
    isLoadingData?: boolean;
    submitButtonText?: string;
    patientData?: Record<string, unknown>;
    onSubmit: (data: Record<string, string>) => void; 
    onCancel?: () => void;
    isSubmitting?: boolean; 
    error?: string | null; 
  }) => (
    <div data-testid="add-lab-test-result-form">
      <div data-testid="test-type">{testType}</div>
      <div data-testid="enabled-fields">{JSON.stringify(enabledFields)}</div>
      <div data-testid="view-mode">{String(viewMode)}</div>
      <div data-testid="existing-data">{JSON.stringify(existingData)}</div>
      <div data-testid="form-loading-data">{String(isLoadingData)}</div>
      <div data-testid="form-submitting">{String(isSubmitting)}</div>
      <div data-testid="form-error">{JSON.stringify(error)}</div>
      <div data-testid="submit-button-text">{submitButtonText}</div>
      <div data-testid="patient-data">{JSON.stringify(patientData)}</div>
      <button data-testid="form-submit" onClick={() => onSubmit({})}>Submit</button>
      {onCancel && <button data-testid="form-cancel" onClick={onCancel}>Cancel</button>}
    </div>
  )
}));

// Mock the page header component
vi.mock('../../components/PageHeader', () => ({
  PageHeader: ({ title, backButtonText, onBackClick }: { 
    title: string; 
    backButtonText: string; 
    onBackClick: () => void 
  }) => (
    <div data-testid="page-header">
      <div data-testid="header-title">{title}</div>
      <div data-testid="header-back-text">{backButtonText}</div>
      <button data-testid="header-back-btn" onClick={onBackClick}>Back</button>
    </div>
  )
}));

describe('AddLabTestResultPagePresenter', () => {
  const mockConfig = {
    page: {
      title: 'Add Lab Test Result' as const,
      backButtonText: 'Back to Laboratory Tests' as const
    }
  } as const;

  const mockViewModel = {
    selectedLabTest: {
      testCategory: 'bloodChemistry',
      enabledFields: ['fbs', 'bun']
    },
    patientInfo: {
      patientNumber: 'PN001',
      patientName: 'John Doe',
      age: 30,
      sex: 'Male'
    },
    isLoading: false,
    isSubmitting: false,
    error: null,
    handleCancel: vi.fn(),
    handleFormSubmit: vi.fn()
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render within MedicalClinicLayout', () => {
    render(<AddLabTestResultPagePresenter config={mockConfig} viewModel={mockViewModel} />);
    
    expect(screen.getByTestId('medical-clinic-layout')).toBeInTheDocument();
  });

  it('should render PageHeader with correct props', () => {
    render(<AddLabTestResultPagePresenter config={mockConfig} viewModel={mockViewModel} />);
    
    expect(screen.getByTestId('page-header')).toBeInTheDocument();
    expect(screen.getByTestId('header-title')).toHaveTextContent('Add Lab Test Result');
    expect(screen.getByTestId('header-back-text')).toHaveTextContent('Back to Laboratory Tests');
  });

  it('should handle back button click', () => {
    render(<AddLabTestResultPagePresenter config={mockConfig} viewModel={mockViewModel} />);
    
    const backButton = screen.getByTestId('header-back-btn');
    backButton.click();
    
    expect(mockViewModel.handleCancel).toHaveBeenCalledTimes(1);
  });

  it('should handle form submit', () => {
    render(<AddLabTestResultPagePresenter config={mockConfig} viewModel={mockViewModel} />);
    
    const submitButton = screen.getByTestId('form-submit');
    submitButton.click();
    
    expect(mockViewModel.handleFormSubmit).toHaveBeenCalledTimes(1);
  });

  it('should display loading state', () => {
    const loadingViewModel = { ...mockViewModel, isLoading: true };
    render(<AddLabTestResultPagePresenter config={mockConfig} viewModel={loadingViewModel} />);
    
    expect(screen.getByTestId('form-loading-data')).toHaveTextContent('true');
  });
});