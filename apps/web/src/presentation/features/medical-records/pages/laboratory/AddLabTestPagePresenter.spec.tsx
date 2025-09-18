import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { render } from '../../../../../test/test-utils';
import { AddLabTestPagePresenter } from './AddLabTestPagePresenter';

// Mock the layout component
vi.mock('../../../../components/layout', () => ({
  MedicalClinicLayout: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="medical-clinic-layout">{children}</div>
  )
}));

// Mock the form component
vi.mock('../../components', () => ({
  AddLabTestForm: ({ onSubmit, isLoading, error }: { 
    onSubmit: () => void; 
    isLoading: boolean; 
    error: unknown 
  }) => (
    <div data-testid="add-lab-test-form">
      <div data-testid="form-loading">{isLoading.toString()}</div>
      <div data-testid="form-error">{JSON.stringify(error)}</div>
      <button data-testid="form-submit" onClick={onSubmit}>Submit</button>
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

describe('AddLabTestPagePresenter', () => {
  const mockConfig = {
    page: {
      title: 'Add Lab Test Request' as const,
      backButtonText: 'Back to Laboratory' as const
    }
  } as const;

  const mockViewModel = {
    handleCancel: vi.fn(),
    handleFormSubmit: vi.fn(),
    isLoading: false,
    error: null
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render within MedicalClinicLayout', () => {
    render(<AddLabTestPagePresenter config={mockConfig} viewModel={mockViewModel} />);
    
    expect(screen.getByTestId('medical-clinic-layout')).toBeInTheDocument();
  });

  it('should render PageHeader with correct props', () => {
    render(<AddLabTestPagePresenter config={mockConfig} viewModel={mockViewModel} />);
    
    expect(screen.getByTestId('page-header')).toBeInTheDocument();
    expect(screen.getByTestId('header-title')).toHaveTextContent('Add Lab Test Request');
    expect(screen.getByTestId('header-back-text')).toHaveTextContent('Back to Laboratory');
  });

  it('should render AddLabTestForm with correct props', () => {
    render(<AddLabTestPagePresenter config={mockConfig} viewModel={mockViewModel} />);
    
    expect(screen.getByTestId('add-lab-test-form')).toBeInTheDocument();
    expect(screen.getByTestId('form-loading')).toHaveTextContent('false');
    expect(screen.getByTestId('form-error')).toHaveTextContent('null');
  });

  it('should handle back button click', () => {
    render(<AddLabTestPagePresenter config={mockConfig} viewModel={mockViewModel} />);
    
    const backButton = screen.getByTestId('header-back-btn');
    backButton.click();
    
    expect(mockViewModel.handleCancel).toHaveBeenCalledTimes(1);
  });

  it('should handle form submit', () => {
    render(<AddLabTestPagePresenter config={mockConfig} viewModel={mockViewModel} />);
    
    const submitButton = screen.getByTestId('form-submit');
    submitButton.click();
    
    expect(mockViewModel.handleFormSubmit).toHaveBeenCalledTimes(1);
  });

  it('should display loading state', () => {
    const loadingViewModel = { ...mockViewModel, isLoading: true };
    render(<AddLabTestPagePresenter config={mockConfig} viewModel={loadingViewModel} />);
    
    expect(screen.getByTestId('form-loading')).toHaveTextContent('true');
  });

  it('should display error state', () => {
    const errorViewModel = { ...mockViewModel, error: 'Test error message' };
    render(<AddLabTestPagePresenter config={mockConfig} viewModel={errorViewModel} />);
    
    expect(screen.getByTestId('form-error')).toHaveTextContent('"Test error message"');
  });
});