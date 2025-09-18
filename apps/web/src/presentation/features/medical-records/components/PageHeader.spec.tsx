import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { render } from '../../../../test/test-utils';
import { PageHeader } from './PageHeader';

// Mock the child components
vi.mock('./BackButton', () => ({
  BackButton: vi.fn(({ onClick, text }) => 
    <button onClick={onClick} data-testid="back-button">{text}</button>
  )
}));

vi.mock('./PageTitle', () => ({
  PageTitle: vi.fn(({ title }) => 
    <h1 data-testid="page-title">{title}</h1>
  )
}));

describe('PageHeader', () => {
  const mockOnBackClick = vi.fn();
  const defaultProps = {
    title: 'Medical Records',
    backButtonText: 'Back to Dashboard',
    onBackClick: mockOnBackClick
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render page title', () => {
    render(<PageHeader {...defaultProps} />);
    
    expect(screen.getByTestId('page-title')).toBeInTheDocument();
    expect(screen.getByText('Medical Records')).toBeInTheDocument();
  });

  it('should render back button with correct text', () => {
    render(<PageHeader {...defaultProps} />);
    
    expect(screen.getByTestId('back-button')).toBeInTheDocument();
    expect(screen.getByText('Back to Dashboard')).toBeInTheDocument();
  });

  it('should call onBackClick when back button is clicked', () => {
    render(<PageHeader {...defaultProps} />);
    
    const backButton = screen.getByTestId('back-button');
    fireEvent.click(backButton);
    
    expect(mockOnBackClick).toHaveBeenCalledTimes(1);
  });

  it('should render with custom title and back button text', () => {
    const customProps = {
      title: 'Laboratory Tests',
      backButtonText: 'Return to Main',
      onBackClick: mockOnBackClick
    };
    
    render(<PageHeader {...customProps} />);
    
    expect(screen.getByText('Laboratory Tests')).toBeInTheDocument();
    expect(screen.getByText('Return to Main')).toBeInTheDocument();
  });

  it('should have correct styling structure', () => {
    render(<PageHeader {...defaultProps} />);
    
    // Check if the component renders with proper structure
    const pageTitle = screen.getByTestId('page-title');
    const backButton = screen.getByTestId('back-button');
    
    expect(pageTitle).toBeInTheDocument();
    expect(backButton).toBeInTheDocument();
  });

  it('should handle empty strings gracefully', () => {
    const emptyProps = {
      title: '',
      backButtonText: '',
      onBackClick: mockOnBackClick
    };
    
    render(<PageHeader {...emptyProps} />);
    
    expect(screen.getByTestId('page-title')).toBeInTheDocument();
    expect(screen.getByTestId('back-button')).toBeInTheDocument();
  });

  it('should handle long titles and button text', () => {
    const longProps = {
      title: 'Very Long Medical Records Management System Title',
      backButtonText: 'Go Back to the Previous Dashboard Page',
      onBackClick: mockOnBackClick
    };
    
    render(<PageHeader {...longProps} />);
    
    expect(screen.getByText('Very Long Medical Records Management System Title')).toBeInTheDocument();
    expect(screen.getByText('Go Back to the Previous Dashboard Page')).toBeInTheDocument();
  });

  it('should pass props correctly to child components', () => {
    render(<PageHeader {...defaultProps} />);
    
    // Verify the child components were rendered with correct data
    const pageTitle = screen.getByTestId('page-title');
    const backButton = screen.getByTestId('back-button');
    
    expect(pageTitle).toBeInTheDocument();
    expect(backButton).toBeInTheDocument();
    expect(screen.getByText('Medical Records')).toBeInTheDocument();
    expect(screen.getByText('Back to Dashboard')).toBeInTheDocument();
  });
});