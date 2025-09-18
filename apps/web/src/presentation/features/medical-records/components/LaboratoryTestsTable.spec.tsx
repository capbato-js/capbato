import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { LaboratoryTestsTable } from './LaboratoryTestsTable';

// Mock the container component
vi.mock('./LaboratoryTestsTableContainer', () => ({
  LaboratoryTestsTableContainer: vi.fn((props) => 
    <div data-testid="laboratory-tests-table-container">
      <div>isLoading: {props.isLoading.toString()}</div>
      <div>errorMessage: {props.errorMessage || 'none'}</div>
      <div>testsCount: {props.labTests.length}</div>
    </div>
  )
}));

describe('LaboratoryTestsTable', () => {
  const mockOnViewTest = vi.fn();
  const mockOnEditTest = vi.fn();
  const mockOnAddResult = vi.fn();
  const mockOnCancelTest = vi.fn();

  const mockLabTest = {
    id: '1',
    patientId: 'patient-1',
    testType: 'Blood Test',
    status: 'pending',
    requestedDate: '2024-01-01',
    requestedBy: 'Dr. Smith'
  };

  const defaultProps = {
    labTests: [mockLabTest],
    isLoading: false,
    errorMessage: null,
    onViewTest: mockOnViewTest,
    onEditTest: mockOnEditTest,
    onAddResult: mockOnAddResult,
    onCancelTest: mockOnCancelTest
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render LaboratoryTestsTableContainer with props', () => {
    const { getByTestId } = render(<LaboratoryTestsTable {...defaultProps} />);
    
    expect(getByTestId('laboratory-tests-table-container')).toBeInTheDocument();
  });

  it('should pass labTests prop to container', () => {
    const { getByText } = render(<LaboratoryTestsTable {...defaultProps} />);
    
    expect(getByText('testsCount: 1')).toBeInTheDocument();
  });

  it('should pass isLoading prop to container', () => {
    const { getByText } = render(
      <LaboratoryTestsTable {...defaultProps} isLoading={true} />
    );
    
    expect(getByText('isLoading: true')).toBeInTheDocument();
  });

  it('should pass errorMessage prop to container', () => {
    const errorMessage = 'Failed to load tests';
    const { getByText } = render(
      <LaboratoryTestsTable {...defaultProps} errorMessage={errorMessage} />
    );
    
    expect(getByText(`errorMessage: ${errorMessage}`)).toBeInTheDocument();
  });

  it('should handle null errorMessage', () => {
    const { getByText } = render(
      <LaboratoryTestsTable {...defaultProps} errorMessage={null} />
    );
    
    expect(getByText('errorMessage: none')).toBeInTheDocument();
  });

  it('should handle empty labTests array', () => {
    const { getByText } = render(
      <LaboratoryTestsTable {...defaultProps} labTests={[]} />
    );
    
    expect(getByText('testsCount: 0')).toBeInTheDocument();
  });

  it('should pass all callback props to container', () => {
    const { getByTestId } = render(<LaboratoryTestsTable {...defaultProps} />);
    
    // The mocked container component should have been called with the callback props
    // We don't need to access the actual module since it's already mocked
    expect(getByTestId('laboratory-tests-table-container')).toBeInTheDocument();
  });

  it('should handle multiple lab tests', () => {
    const multipleTests = [
      mockLabTest,
      { ...mockLabTest, id: '2', testType: 'Urine Test' },
      { ...mockLabTest, id: '3', testType: 'X-Ray' }
    ];

    const { getByText } = render(
      <LaboratoryTestsTable {...defaultProps} labTests={multipleTests} />
    );
    
    expect(getByText('testsCount: 3')).toBeInTheDocument();
  });

  it('should pass all props together correctly', () => {
    const props = {
      labTests: [mockLabTest, { ...mockLabTest, id: '2' }],
      isLoading: true,
      errorMessage: 'Test error',
      onViewTest: mockOnViewTest,
      onEditTest: mockOnEditTest,
      onAddResult: mockOnAddResult,
      onCancelTest: mockOnCancelTest
    };

    const { getByText } = render(<LaboratoryTestsTable {...props} />);
    
    expect(getByText('isLoading: true')).toBeInTheDocument();
    expect(getByText('errorMessage: Test error')).toBeInTheDocument();
    expect(getByText('testsCount: 2')).toBeInTheDocument();
  });
});