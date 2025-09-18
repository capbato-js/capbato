import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { render } from '../../../../../test/test-utils';
import { LaboratoryPageContainer } from './LaboratoryPageContainer';
import { useLaboratoryData } from '../../hooks/useLaboratoryData';
import { useLaboratoryNavigation } from '../../hooks/useLaboratoryNavigation';

// Mock dependencies
vi.mock('../../hooks/useLaboratoryData');
vi.mock('../../hooks/useLaboratoryNavigation');
vi.mock('../../../../hooks/useOverflowHidden');

// Mock the presenter component
vi.mock('./LaboratoryPagePresenter', () => ({
  LaboratoryPagePresenter: ({ 
    laboratoryResults, 
    loadingStates, 
    errorStates, 
    onAddTest, 
    onViewResult 
  }: {
    laboratoryResults: unknown;
    loadingStates: unknown;
    errorStates: unknown;
    onAddTest: unknown;
    onViewResult: unknown;
  }) => (
    <div data-testid="laboratory-presenter">
      <div data-testid="laboratory-results">{JSON.stringify(laboratoryResults)}</div>
      <div data-testid="loading-states">{JSON.stringify(loadingStates)}</div>
      <div data-testid="error-states">{JSON.stringify(errorStates)}</div>
      <button data-testid="add-test-btn" onClick={() => (onAddTest as () => void)()}>Add Test</button>
      <button data-testid="view-result-btn" onClick={() => (onViewResult as () => void)()}>View Result</button>
    </div>
  )
}));

describe('LaboratoryPageContainer', () => {
  const mockFetchAllLabRequests = vi.fn();
  const mockHandleAddTest = vi.fn();
  const mockHandleViewResult = vi.fn();
  const mockUseLaboratoryData = vi.mocked(useLaboratoryData);
  const mockUseLaboratoryNavigation = vi.mocked(useLaboratoryNavigation);

  beforeEach(() => {
    vi.clearAllMocks();
    // Set up fresh mocks for each test
    mockUseLaboratoryData.mockReturnValue({
      laboratoryResults: [
        { 
          id: '1', 
          patientId: 'patient-1',
          patientNumber: '12345',
          patientName: 'John Doe',
          testType: 'Blood Test', 
          datePerformed: '2023-01-01',
          status: 'Completed' 
        }
      ],
      fetchAllLabRequests: mockFetchAllLabRequests,
      loadingStates: { creating: false, fetching: false, updating: false },
      errorStates: { createError: null, fetchError: null, updateError: null }
    });

    mockUseLaboratoryNavigation.mockReturnValue({
      handleAddTest: mockHandleAddTest,
      handleViewResult: mockHandleViewResult
    });
  });

  it('should render the laboratory page container with correct data', () => {
    render(<LaboratoryPageContainer />);
    
    expect(screen.getByTestId('laboratory-presenter')).toBeInTheDocument();
    expect(screen.getByTestId('laboratory-results')).toBeInTheDocument();
    expect(screen.getByTestId('loading-states')).toBeInTheDocument();
    expect(screen.getByTestId('error-states')).toBeInTheDocument();
  });

  it('should call fetchAllLabRequests on mount', () => {
    render(<LaboratoryPageContainer />);
    
    expect(mockFetchAllLabRequests).toHaveBeenCalledOnce();
  });

  it('should pass correct data to presenter', () => {
    render(<LaboratoryPageContainer />);
    
    const resultsElement = screen.getByTestId('laboratory-results');
    const loadingElement = screen.getByTestId('loading-states');
    const errorElement = screen.getByTestId('error-states');
    
    expect(resultsElement.textContent).toContain('Blood Test');
    expect(loadingElement.textContent).toContain('false');
    expect(errorElement.textContent).toContain('null');
  });

  it('should handle add test button click', () => {
    render(<LaboratoryPageContainer />);
    
    const addTestBtn = screen.getByTestId('add-test-btn');
    fireEvent.click(addTestBtn);
    
    expect(mockHandleAddTest).toHaveBeenCalledOnce();
  });

  it('should handle view result button click', () => {
    render(<LaboratoryPageContainer />);
    
    const viewResultBtn = screen.getByTestId('view-result-btn');
    fireEvent.click(viewResultBtn);
    
    expect(mockHandleViewResult).toHaveBeenCalledOnce();
  });

  it('should handle loading state correctly', () => {
    mockUseLaboratoryData.mockReturnValue({
      laboratoryResults: [],
      fetchAllLabRequests: mockFetchAllLabRequests,
      loadingStates: { creating: false, fetching: true, updating: false },
      errorStates: { createError: null, fetchError: null, updateError: null }
    });

    render(<LaboratoryPageContainer />);
    
    const loadingElement = screen.getByTestId('loading-states');
    expect(loadingElement.textContent).toContain('true');
  });

  it('should handle error state correctly', () => {
    mockUseLaboratoryData.mockReturnValue({
      laboratoryResults: [],
      fetchAllLabRequests: mockFetchAllLabRequests,
      loadingStates: { creating: false, fetching: false, updating: false },
      errorStates: { createError: null, fetchError: 'Test error', updateError: null }
    });

    render(<LaboratoryPageContainer />);
    
    const errorElement = screen.getByTestId('error-states');
    expect(errorElement.textContent).toContain('Test error');
  });
});