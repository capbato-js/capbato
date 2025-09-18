import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { render } from '../../../../../test/test-utils';
import { EditLabTestResultPagePresenter } from './EditLabTestResultPagePresenter';

// Mock the layout component
vi.mock('../../../../components/layout', () => ({
  MedicalClinicLayout: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="medical-clinic-layout">{children}</div>
  )
}));

// Mock the form component
vi.mock('../../components', () => ({
  EditLabTestResultForm: ({ onSubmit, isLoading, error }: { 
    onSubmit: () => void; 
    isLoading: boolean; 
    error: unknown 
  }) => (
    <div data-testid="edit-lab-test-result-form">
      <div data-testid="form-loading">{isLoading.toString()}</div>
      <div data-testid="form-error">{JSON.stringify(error)}</div>
      <button data-testid="form-submit" onClick={onSubmit}>Submit</button>
    </div>
  ),
  AddLabTestResultForm: ({ testType, enabledFields, onSubmit }: { 
    testType?: string; 
    enabledFields?: string[]; 
    onSubmit: () => void 
  }) => (
    <div data-testid="add-lab-test-result-form">
      <div data-testid="form-test-type">{testType}</div>
      <div data-testid="form-enabled-fields">{JSON.stringify(enabledFields)}</div>
      <button data-testid="form-submit" onClick={onSubmit}>Submit</button>
    </div>
  )
}));

// Mock the page header component
vi.mock('../../components/PageHeader', () => ({
  PageHeader: ({ title, onBackClick }: { 
    title: string; 
    backButtonText: string; 
    onBackClick: () => void 
  }) => (
    <div data-testid="page-header">
      <div data-testid="header-title">{title}</div>
      <button data-testid="header-back-btn" onClick={onBackClick}>Back</button>
    </div>
  )
}));

describe('EditLabTestResultPagePresenter', () => {
  const mockConfig = {
    page: {
      title: 'Edit Lab Test Result' as const,
      backButtonText: 'Back to Laboratory Tests' as const,
      submitButtonText: 'Update Result' as const
    }
  } as const;

  const mockViewModel = {
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
    render(<EditLabTestResultPagePresenter config={mockConfig} viewModel={mockViewModel} />);
    
    expect(screen.getByTestId('medical-clinic-layout')).toBeInTheDocument();
  });

  it('should render PageHeader with correct props', () => {
    render(<EditLabTestResultPagePresenter config={mockConfig} viewModel={mockViewModel} />);
    
    expect(screen.getByTestId('page-header')).toBeInTheDocument();
    expect(screen.getByTestId('header-title')).toHaveTextContent('Edit Lab Test Result');
  });

  it('should handle back button click', () => {
    render(<EditLabTestResultPagePresenter config={mockConfig} viewModel={mockViewModel} />);
    
    const backButton = screen.getByTestId('header-back-btn');
    backButton.click();
    
    expect(mockViewModel.handleCancel).toHaveBeenCalledTimes(1);
  });

  it('should handle form submit', () => {
    render(<EditLabTestResultPagePresenter config={mockConfig} viewModel={mockViewModel} />);
    
    const submitButton = screen.getByTestId('form-submit');
    submitButton.click();
    
    expect(mockViewModel.handleFormSubmit).toHaveBeenCalledTimes(1);
  });
});