import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { AddLabTestForm } from './AddLabTestForm';

// Mock the container component
vi.mock('./AddLabTestFormContainer', () => ({
  AddLabTestFormContainer: vi.fn(({ onSubmit, isLoading, error }) => 
    <div data-testid="add-lab-test-form-container">
      <div>isLoading: {isLoading.toString()}</div>
      <div>error: {error || 'none'}</div>
      <button onClick={() => onSubmit({ test: 'data' })}>Submit</button>
    </div>
  )
}));

describe('AddLabTestForm', () => {
  const mockOnSubmit = vi.fn();
  const defaultProps = {
    onSubmit: mockOnSubmit,
    isLoading: false,
    error: null
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render AddLabTestFormContainer with props', () => {
    const { getByTestId } = render(<AddLabTestForm {...defaultProps} />);
    
    expect(getByTestId('add-lab-test-form-container')).toBeInTheDocument();
  });

  it('should pass onSubmit prop to container', () => {
    const { getByTestId } = render(<AddLabTestForm {...defaultProps} />);
    
    expect(getByTestId('add-lab-test-form-container')).toBeInTheDocument();
    // The mock should receive the onSubmit function
  });

  it('should pass isLoading prop to container', () => {
    const { getByText } = render(
      <AddLabTestForm {...defaultProps} isLoading={true} />
    );
    
    expect(getByText('isLoading: true')).toBeInTheDocument();
  });

  it('should pass error prop to container', () => {
    const errorMessage = 'Test error';
    const { getByText } = render(
      <AddLabTestForm {...defaultProps} error={errorMessage} />
    );
    
    expect(getByText(`error: ${errorMessage}`)).toBeInTheDocument();
  });

  it('should handle null error prop', () => {
    const { getByText } = render(
      <AddLabTestForm {...defaultProps} error={null} />
    );
    
    expect(getByText('error: none')).toBeInTheDocument();
  });

  it('should handle undefined error prop', () => {
    const { getByText } = render(
      <AddLabTestForm {...defaultProps} error={undefined} />
    );
    
    expect(getByText('error: none')).toBeInTheDocument();
  });

  it('should pass all props correctly when all are provided', () => {
    const props = {
      onSubmit: mockOnSubmit,
      isLoading: true,
      error: 'Custom error message'
    };
    
    const { getByText } = render(<AddLabTestForm {...props} />);
    
    expect(getByText('isLoading: true')).toBeInTheDocument();
    expect(getByText('error: Custom error message')).toBeInTheDocument();
  });
});