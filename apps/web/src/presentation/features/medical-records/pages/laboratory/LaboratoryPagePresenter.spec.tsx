import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { render } from '../../../../../test/test-utils';
import { LaboratoryPagePresenter } from './LaboratoryPagePresenter';

// Mock the layout component
vi.mock('../../../../components/layout', () => ({
  MedicalClinicLayout: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="medical-clinic-layout">{children}</div>
  )
}));

// Mock the data table components
vi.mock('../../../../components/common/DataTable', () => ({
  DataTable: ({ 
    data, 
    onRowClick, 
    cursor, 
    searchable, 
    searchPlaceholder, 
    emptyStateMessage, 
    useViewportHeight, 
    bottomPadding 
  }: {
    data: unknown[];
    onRowClick: (item: unknown) => void;
    cursor: string;
    searchable: boolean;
    searchPlaceholder: string;
    emptyStateMessage: string;
    useViewportHeight: boolean;
    bottomPadding: number;
  }) => (
    <div data-testid="data-table">
      <div data-testid="table-data">{JSON.stringify(data)}</div>
      <div data-testid="table-cursor">{cursor}</div>
      <div data-testid="table-searchable">{searchable.toString()}</div>
      <div data-testid="table-search-placeholder">{searchPlaceholder}</div>
      <div data-testid="table-empty-message">{emptyStateMessage}</div>
      <div data-testid="table-viewport-height">{useViewportHeight.toString()}</div>
      <div data-testid="table-bottom-padding">{bottomPadding}</div>
      <button data-testid="table-row-click" onClick={() => onRowClick({ id: '1' })}>Click Row</button>
    </div>
  ),
  DataTableHeader: ({ title, onAddItem, addButtonText, addButtonIcon }: {
    title: string;
    onAddItem: () => void;
    addButtonText: string;
    addButtonIcon: string;
  }) => (
    <div data-testid="data-table-header">
      <div data-testid="header-title">{title}</div>
      <div data-testid="header-add-text">{addButtonText}</div>
      <div data-testid="header-add-icon">{addButtonIcon}</div>
      <button data-testid="header-add-btn" onClick={onAddItem}>Add</button>
    </div>
  )
}));

// Mock the table config functions
vi.mock('../../config/laboratoryTableConfig', () => ({
  getLaboratoryTableColumns: vi.fn(() => [
    { key: 'patientName', title: 'Patient' },
    { key: 'testType', title: 'Test Type' }
  ]),
  getLaboratoryTableActions: vi.fn((onViewResult) => [
    { label: 'View', onClick: onViewResult }
  ])
}));

describe('LaboratoryPagePresenter', () => {
  const mockProps = {
    laboratoryResults: [
      { 
        id: '1', 
        patientId: 'p1',
        patientNumber: 'PN001',
        patientName: 'John Doe', 
        testType: 'Blood Test', 
        datePerformed: '2023-01-01',
        status: 'Completed' as const,
        results: 'Normal'
      },
      { 
        id: '2', 
        patientId: 'p2',
        patientNumber: 'PN002',
        patientName: 'Jane Smith', 
        testType: 'Urine Test', 
        datePerformed: '2023-01-02',
        status: 'Pending' as const
      }
    ],
    loadingStates: {
      fetching: false
    },
    errorStates: {
      fetchError: null
    },
    onAddTest: vi.fn(),
    onViewResult: vi.fn()
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render within MedicalClinicLayout', () => {
    render(<LaboratoryPagePresenter {...mockProps} />);
    
    expect(screen.getByTestId('medical-clinic-layout')).toBeInTheDocument();
  });

  it('should render DataTableHeader with correct props', () => {
    render(<LaboratoryPagePresenter {...mockProps} />);
    
    expect(screen.getByTestId('data-table-header')).toBeInTheDocument();
    expect(screen.getByTestId('header-title')).toHaveTextContent('Laboratory');
    expect(screen.getByTestId('header-add-text')).toHaveTextContent('Add Lab Test');
    expect(screen.getByTestId('header-add-icon')).toHaveTextContent('fas fa-flask');
  });

  it('should render DataTable with correct props', () => {
    render(<LaboratoryPagePresenter {...mockProps} />);
    
    expect(screen.getByTestId('data-table')).toBeInTheDocument();
    expect(screen.getByTestId('table-data')).toHaveTextContent('John Doe');
    expect(screen.getByTestId('table-cursor')).toHaveTextContent('pointer');
    expect(screen.getByTestId('table-searchable')).toHaveTextContent('true');
    expect(screen.getByTestId('table-search-placeholder')).toHaveTextContent('Search laboratory results');
    expect(screen.getByTestId('table-viewport-height')).toHaveTextContent('true');
    expect(screen.getByTestId('table-bottom-padding')).toHaveTextContent('90');
  });

  it('should handle add test button click', () => {
    render(<LaboratoryPagePresenter {...mockProps} />);
    
    const addButton = screen.getByTestId('header-add-btn');
    addButton.click();
    
    expect(mockProps.onAddTest).toHaveBeenCalledTimes(1);
  });

  it('should handle row click', () => {
    render(<LaboratoryPagePresenter {...mockProps} />);
    
    const rowButton = screen.getByTestId('table-row-click');
    rowButton.click();
    
    expect(mockProps.onViewResult).toHaveBeenCalledWith({ id: '1' });
  });

  it('should display loading message when fetching', () => {
    const loadingProps = {
      ...mockProps,
      loadingStates: { fetching: true }
    };
    
    render(<LaboratoryPagePresenter {...loadingProps} />);
    
    expect(screen.getByTestId('table-empty-message')).toHaveTextContent('Loading laboratory results');
  });

  it('should display no results message when not loading and no data', () => {
    const emptyProps = {
      ...mockProps,
      laboratoryResults: []
    };
    
    render(<LaboratoryPagePresenter {...emptyProps} />);
    
    expect(screen.getByTestId('table-empty-message')).toHaveTextContent('No laboratory results found');
  });

  it('should display error message when there is a fetch error', () => {
    const errorProps = {
      ...mockProps,
      errorStates: { fetchError: 'Failed to load data' }
    };
    
    render(<LaboratoryPagePresenter {...errorProps} />);
    
    expect(screen.getByText(/Error loading laboratory results: Failed to load data/)).toBeInTheDocument();
  });

  it('should not display error message when there is no error', () => {
    render(<LaboratoryPagePresenter {...mockProps} />);
    
    expect(screen.queryByText(/Error loading laboratory results/)).not.toBeInTheDocument();
  });
});