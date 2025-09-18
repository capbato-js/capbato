import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { render } from '../../../../../test/test-utils';
import { ViewLabTestResultPageContainer } from './ViewLabTestResultPageContainer';

// Mock the view model hook
vi.mock('../../view-models/useViewLabTestResultViewModel', () => ({
  useViewLabTestResultViewModel: vi.fn(() => ({
    // Mock view model data
    patientInfo: { 
      patientNumber: '12345', 
      patientName: 'John Doe',
      age: 30,
      sex: 'Male'
    },
    selectedLabTest: { 
      id: '1', 
      testCategory: 'bloodChemistry',
      tests: ['fbs'],
      testDisplayNames: ['FBS'],
      date: '2023-01-01',
      status: 'Completed'
    },
    bloodChemistryData: { fbs: '120' },
    isLoading: false,
    error: null,
    handleBack: vi.fn()
  }))
}));

// Mock the presenter component
vi.mock('./ViewLabTestResultPagePresenter', () => ({
  ViewLabTestResultPagePresenter: ({ 
    isUrinalysisTest, 
    patientData, 
    labData, 
    selectedLabTest, 
    isLoading, 
    error, 
    onBack 
  }: { 
    isUrinalysisTest: boolean; 
    patientData: unknown; 
    labData: unknown; 
    selectedLabTest: unknown; 
    isLoading: boolean; 
    error: unknown; 
    onBack: () => void 
  }) => (
    <div data-testid="view-lab-test-result-presenter">
      <div data-testid="patient-data">{JSON.stringify(patientData)}</div>
      <div data-testid="is-urinalysis">{isUrinalysisTest.toString()}</div>
      <div data-testid="selected-lab-test">{JSON.stringify(selectedLabTest)}</div>
      <div data-testid="lab-data">{JSON.stringify(labData)}</div>
      <div data-testid="is-loading">{isLoading.toString()}</div>
      <div data-testid="error">{JSON.stringify(error)}</div>
      <button data-testid="back-btn" onClick={onBack}>Back</button>
    </div>
  )
}));

// Mock the utility functions
vi.mock('../../utils/viewLabTestResultUtils', () => ({
  isUrinalysisTest: vi.fn((category: string) => category === 'urinalysis'),
  preparePatientData: vi.fn((patientInfo: unknown) => ({ prepared: true, data: patientInfo }))
}));

describe('ViewLabTestResultPageContainer', () => {
  it('should render ViewLabTestResultPagePresenter with prepared data', () => {
    render(<ViewLabTestResultPageContainer />);
    
    expect(screen.getByTestId('view-lab-test-result-presenter')).toBeInTheDocument();
    expect(screen.getByTestId('patient-data')).toBeInTheDocument();
    expect(screen.getByTestId('is-urinalysis')).toBeInTheDocument();
    expect(screen.getByTestId('selected-lab-test')).toBeInTheDocument();
    expect(screen.getByTestId('lab-data')).toBeInTheDocument();
  });

  it('should correctly determine if test is urinalysis', () => {
    render(<ViewLabTestResultPageContainer />);
    
    const isUrinalysisElement = screen.getByTestId('is-urinalysis');
    expect(isUrinalysisElement.textContent).toBe('false'); // Since we mocked 'bloodChemistry'
  });

  it('should pass prepared patient data to presenter', () => {
    render(<ViewLabTestResultPageContainer />);
    
    const patientDataElement = screen.getByTestId('patient-data');
    expect(patientDataElement.textContent).toContain('prepared');
  });
});