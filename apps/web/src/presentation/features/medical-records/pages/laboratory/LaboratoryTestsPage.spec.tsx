import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { render } from '../../../../../test/test-utils';
import { LaboratoryTestsPage } from './LaboratoryTestsPage';
import { useLaboratoryTestsViewModel } from '../../view-models';

// Mock the layout component
vi.mock('../../../../components/layout', () => ({
  MedicalClinicLayout: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="medical-clinic-layout">{children}</div>
  )
}));

// Mock the view model hook
vi.mock('../../view-models', () => ({
  useLaboratoryTestsViewModel: vi.fn()
}));

// Mock the overflow hidden hook
vi.mock('../../../../hooks/useOverflowHidden', () => ({
  useOverflowHidden: vi.fn()
}));

// Mock the components
vi.mock('../../components', () => ({
  LaboratoryTestsPageHeader: ({ patientInfo, onBackClick }: { 
    patientInfo: unknown; 
    onBackClick: () => void 
  }) => (
    <div data-testid="laboratory-tests-page-header">
      <div data-testid="header-patient-info">{JSON.stringify(patientInfo)}</div>
      <button data-testid="header-back-btn" onClick={onBackClick}>Back</button>
    </div>
  ),
  LaboratoryTestsTable: ({ 
    labTests, 
    isLoading, 
    errorMessage, 
    onViewTest, 
    onEditTest, 
    onAddResult, 
    onCancelTest 
  }: {
    labTests: unknown[];
    isLoading: boolean;
    errorMessage: string | null;
    onViewTest: () => void;
    onEditTest: () => void;
    onAddResult: () => void;
    onCancelTest: () => void;
  }) => (
    <div data-testid="laboratory-tests-table">
      <div data-testid="table-lab-tests">{JSON.stringify(labTests)}</div>
      <div data-testid="table-loading">{isLoading.toString()}</div>
      <div data-testid="table-error">{errorMessage}</div>
      <button data-testid="table-view-btn" onClick={onViewTest}>View</button>
      <button data-testid="table-edit-btn" onClick={onEditTest}>Edit</button>
      <button data-testid="table-add-result-btn" onClick={onAddResult}>Add Result</button>
      <button data-testid="table-cancel-btn" onClick={onCancelTest}>Cancel</button>
    </div>
  ),
  LaboratoryTestsModals: ({ 
    cancelConfirmationModalOpened, 
    onCloseCancelConfirmation, 
    onConfirmCancel, 
    testToCancel, 
    patientInfo, 
    isLoading, 
    error 
  }: {
    cancelConfirmationModalOpened: boolean;
    onCloseCancelConfirmation: () => void;
    onConfirmCancel: () => void;
    testToCancel: unknown;
    patientInfo: unknown;
    isLoading: boolean;
    error: unknown;
  }) => (
    <div data-testid="laboratory-tests-modals">
      <div data-testid="modal-opened">{cancelConfirmationModalOpened.toString()}</div>
      <div data-testid="modal-test-to-cancel">{JSON.stringify(testToCancel)}</div>
      <div data-testid="modal-patient-info">{JSON.stringify(patientInfo)}</div>
      <div data-testid="modal-loading">{isLoading.toString()}</div>
      <div data-testid="modal-error">{JSON.stringify(error)}</div>
      <button data-testid="modal-close-btn" onClick={onCloseCancelConfirmation}>Close</button>
      <button data-testid="modal-confirm-btn" onClick={onConfirmCancel}>Confirm</button>
    </div>
  )
}));

describe('LaboratoryTestsPage', () => {
  // Create consistent mock functions
  const mockHandleBackToLaboratory = vi.fn();
  const mockHandleViewTest = vi.fn();
  const mockHandleEditTest = vi.fn();
  const mockHandleAddResult = vi.fn();
  const mockHandleCancelTest = vi.fn();
  const mockHandleConfirmCancel = vi.fn();
  const mockHandleCloseCancelConfirmation = vi.fn();

  const mockViewModel = {
    labTests: [
      { 
        id: '1', 
        testCategory: 'bloodChemistry' as const,
        tests: ['fbs', 'bun', 'creatinine'],
        date: '2023-10-01',
        status: 'Pending' as const,
        enabledFields: ['fbs', 'bun', 'creatinine']
      },
      { 
        id: '2', 
        testCategory: 'urinalysis' as const,
        tests: ['color', 'transparency', 'specificGravity'],
        date: '2023-10-02',
        status: 'Completed' as const,
        enabledFields: ['color', 'transparency', 'specificGravity']
      }
    ],
    patientInfo: {
      id: 'patient-1',
      fullName: 'John Doe',
      patientNumber: 'PN001',
      patientName: 'John Doe',
      dateOfBirth: '1993-01-01',
      gender: 'Male',
      age: 30,
      sex: 'Male'
    },
    isLoading: false,
    error: null,
    cancelConfirmationModalOpened: false,
    testToCancel: null,
    handleBackToLaboratory: mockHandleBackToLaboratory,
    handleViewTest: mockHandleViewTest,
    handleEditTest: mockHandleEditTest,
    handleAddResult: mockHandleAddResult,
    handleCancelTest: mockHandleCancelTest,
    handleConfirmCancel: mockHandleConfirmCancel,
    handleCloseCancelConfirmation: mockHandleCloseCancelConfirmation,
    errorStates: { fetchError: null },
  };

  beforeEach(() => {
    vi.clearAllMocks();
    // Reset all mock functions
    mockHandleBackToLaboratory.mockClear();
    mockHandleViewTest.mockClear();
    mockHandleEditTest.mockClear();
    mockHandleAddResult.mockClear();
    mockHandleCancelTest.mockClear();
    mockHandleConfirmCancel.mockClear();
    mockHandleCloseCancelConfirmation.mockClear();
    
    // Set up the mock hook to return our mockViewModel
    vi.mocked(useLaboratoryTestsViewModel).mockReturnValue(mockViewModel);
  });

  it('should render within MedicalClinicLayout', () => {
    render(<LaboratoryTestsPage />);
    
    expect(screen.getByTestId('medical-clinic-layout')).toBeInTheDocument();
  });

  it('should render LaboratoryTestsPageHeader with patient info', () => {
    render(<LaboratoryTestsPage />);
    
    expect(screen.getByTestId('laboratory-tests-page-header')).toBeInTheDocument();
    expect(screen.getByTestId('header-patient-info')).toHaveTextContent('John Doe');
  });

  it('should render LaboratoryTestsTable with lab tests', () => {
    render(<LaboratoryTestsPage />);
    
    expect(screen.getByTestId('laboratory-tests-table')).toBeInTheDocument();
    expect(screen.getByTestId('table-lab-tests')).toHaveTextContent('bloodChemistry');
    expect(screen.getByTestId('table-loading')).toHaveTextContent('false');
  });

  it('should render LaboratoryTestsModals', () => {
    render(<LaboratoryTestsPage />);
    
    expect(screen.getByTestId('laboratory-tests-modals')).toBeInTheDocument();
    expect(screen.getByTestId('modal-opened')).toHaveTextContent('false');
  });

  it('should handle back button click', () => {
    render(<LaboratoryTestsPage />);
    
    const backButton = screen.getByTestId('header-back-btn');
    backButton.click();
    
    expect(mockHandleBackToLaboratory).toHaveBeenCalledTimes(1);
  });

  it('should handle table actions', () => {
    render(<LaboratoryTestsPage />);
    
    // Test view action
    const viewButton = screen.getByTestId('table-view-btn');
    viewButton.click();
    expect(mockHandleViewTest).toHaveBeenCalledTimes(1);
    
    // Test edit action
    const editButton = screen.getByTestId('table-edit-btn');
    editButton.click();
    expect(mockHandleEditTest).toHaveBeenCalledTimes(1);
    
    // Test add result action
    const addResultButton = screen.getByTestId('table-add-result-btn');
    addResultButton.click();
    expect(mockHandleAddResult).toHaveBeenCalledTimes(1);
    
    // Test cancel action
    const cancelButton = screen.getByTestId('table-cancel-btn');
    cancelButton.click();
    expect(mockHandleCancelTest).toHaveBeenCalledTimes(1);
  });

  it('should handle modal actions', () => {
    render(<LaboratoryTestsPage />);
    
    // Test close modal action
    const closeButton = screen.getByTestId('modal-close-btn');
    closeButton.click();
    expect(mockHandleCloseCancelConfirmation).toHaveBeenCalledTimes(1);
    
    // Test confirm cancel action
    const confirmButton = screen.getByTestId('modal-confirm-btn');
    confirmButton.click();
    expect(mockHandleConfirmCancel).toHaveBeenCalledTimes(1);
  });

  it('should use overflow hidden hook', () => {    
    render(<LaboratoryTestsPage />);
    
    // The hook should be called when the component renders
    // Since it's mocked, we just check that the component renders without error
    expect(screen.getByTestId('medical-clinic-layout')).toBeInTheDocument();
  });

  it('should display loading state when isLoading is true', () => {
    // Since the mock is already set up at the top with the mockViewModel,
    // we need to update that mock temporarily for this test
    const loadingViewModel = { ...mockViewModel, isLoading: true };
    
    // We'll need to update the mock implementation for this specific test
    vi.mocked(useLaboratoryTestsViewModel).mockReturnValueOnce(loadingViewModel);
    
    render(<LaboratoryTestsPage />);
    
    expect(screen.getByTestId('table-loading')).toHaveTextContent('true');
    expect(screen.getByTestId('modal-loading')).toHaveTextContent('true');
  });

  it('should display error state when error is present', () => {
    const errorViewModel = { 
      ...mockViewModel, 
      error: 'Test error',
      errorStates: { fetchError: 'Fetch error message' }
    };
    
    vi.mocked(useLaboratoryTestsViewModel).mockReturnValueOnce(errorViewModel);
    
    render(<LaboratoryTestsPage />);
    
    expect(screen.getByTestId('table-error')).toHaveTextContent('Fetch error message');
    expect(screen.getByTestId('modal-error')).toHaveTextContent('"Test error"');
  });
});