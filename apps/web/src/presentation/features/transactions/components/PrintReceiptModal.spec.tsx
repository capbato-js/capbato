import React from 'react';
import { render, screen } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import { PrintReceiptModal } from './PrintReceiptModal';
import { Transaction } from '../types/TransactionTypes';

// Mock Mantine components
vi.mock('@mantine/core', () => {
  const MockTable = ({ children }: any) => <table>{children}</table>;
  MockTable.Thead = ({ children }: any) => <thead>{children}</thead>;
  MockTable.Tbody = ({ children }: any) => <tbody>{children}</tbody>;
  MockTable.Tr = ({ children }: any) => <tr>{children}</tr>;
  MockTable.Th = ({ children }: any) => <th>{children}</th>;
  MockTable.Td = ({ children }: any) => <td>{children}</td>;

  return {
    Modal: ({ children, opened, title }: any) => {
      return opened ? <div data-testid="modal" aria-label={title}>{children}</div> : null;
    },
    Box: ({ children }: any) => <div>{children}</div>,
    Text: ({ children }: any) => <span>{children}</span>,
    Group: ({ children }: any) => <div>{children}</div>,
    Stack: ({ children }: any) => <div>{children}</div>,
    Table: MockTable,
    Button: ({ children, onClick }: any) => <button onClick={onClick}>{children}</button>,
    Divider: () => <hr />,
    Paper: ({ children }: any) => <div>{children}</div>,
  };
});

vi.mock('../../../components/common', () => ({
  Icon: ({ icon }: any) => <span data-testid="icon">{icon}</span>,
}));

vi.mock('react-to-print', () => ({
  useReactToPrint: vi.fn(() => vi.fn()),
}));

describe('PrintReceiptModal', () => {
  const mockTransaction: Transaction = {
    id: '1',
    receiptNumber: 'RCP-001',
    date: '2024-01-15',
    patient: {
      id: 'patient-1',
      patientNumber: 'P001',
      firstName: 'John',
      lastName: 'Doe',
      middleName: 'M',
      fullName: 'John M. Doe',
      address: '123 Test Street',
      contactNumber: '09123456789',
      email: 'john.doe@example.com'
    },
    totalAmount: 1500.00,
    paymentMethod: 'Cash',
    receivedBy: 'Staff A',
    items: [
      {
        serviceName: 'Consultation',
        description: 'General consultation',
        quantity: 1,
        unitPrice: 500.00,
        subtotal: 500.00
      },
      {
        serviceName: 'Laboratory Test',
        description: 'Blood chemistry',
        quantity: 1,
        unitPrice: 1000.00,
        subtotal: 1000.00
      }
    ],
    itemsSummary: 'Consultation, Laboratory Test',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  };

  const defaultProps = {
    opened: true,
    onClose: vi.fn(),
    transaction: mockTransaction,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the modal when opened', () => {
    render(<PrintReceiptModal {...defaultProps} />);
    
    expect(screen.getByTestId('modal')).toBeInTheDocument();
    expect(screen.getByLabelText('Print Receipt')).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    render(<PrintReceiptModal {...defaultProps} opened={false} />);
    
    expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
  });

  it('does not render when transaction is null', () => {
    render(<PrintReceiptModal {...defaultProps} transaction={null} />);
    
    expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
  });

  it('displays receipt header and business placeholders', () => {
    render(<PrintReceiptModal {...defaultProps} />);
    
    expect(screen.getByText('RECEIPT')).toBeInTheDocument();
    expect(screen.getByText('M.G. Amores Medical Clinic')).toBeInTheDocument();
    expect(screen.getByText('[CLINIC ADDRESS]')).toBeInTheDocument();
    expect(screen.getByText('[PHONE NUMBER]')).toBeInTheDocument();
  });

  it('displays transaction information correctly', () => {
    render(<PrintReceiptModal {...defaultProps} />);
    
    expect(screen.getByText('RCP-001')).toBeInTheDocument();
    expect(screen.getByText('John M. Doe')).toBeInTheDocument();
    expect(screen.getByText('P001')).toBeInTheDocument();
    expect(screen.getByText('Cash')).toBeInTheDocument();
    expect(screen.getByText('Received by: Staff A')).toBeInTheDocument();
  });

  it('displays transaction items', () => {
    render(<PrintReceiptModal {...defaultProps} />);
    
    expect(screen.getByText('Consultation')).toBeInTheDocument();
    expect(screen.getByText('General consultation')).toBeInTheDocument();
    expect(screen.getByText('Laboratory Test')).toBeInTheDocument();
    expect(screen.getByText('Blood chemistry')).toBeInTheDocument();
  });

  it('displays formatted currency amounts', () => {
    render(<PrintReceiptModal {...defaultProps} />);
    
    // ₱500.00 appears twice (unit price and total for consultation)
    const fiveHundred = screen.getAllByText('₱500.00');
    expect(fiveHundred).toHaveLength(2);
    
    // ₱1,000.00 appears twice (unit price and total for lab test)  
    const oneThousand = screen.getAllByText('₱1,000.00');
    expect(oneThousand).toHaveLength(2);
    
    // ₱1,500.00 appears twice (amount paid and total)
    const fifteenHundred = screen.getAllByText('₱1,500.00');
    expect(fifteenHundred).toHaveLength(2);
  });

  it('displays customer information correctly', () => {
    render(<PrintReceiptModal {...defaultProps} />);
    
    expect(screen.getByText('123 Test Street')).toBeInTheDocument();
    expect(screen.getByText('09123456789')).toBeInTheDocument();
  });

  it('has a print button', () => {
    render(<PrintReceiptModal {...defaultProps} />);
    
    const printButton = screen.getByText('Print Receipt');
    expect(printButton).toBeInTheDocument();
  });

  it('displays payment summary section', () => {
    render(<PrintReceiptModal {...defaultProps} />);
    
    expect(screen.getByText('PAYMENT INFORMATION')).toBeInTheDocument();
    expect(screen.getByText('PAYMENT METHOD:')).toBeInTheDocument();
    expect(screen.getByText('AMOUNT PAID:')).toBeInTheDocument();
  });

  it('displays total correctly', () => {
    render(<PrintReceiptModal {...defaultProps} />);
    
    expect(screen.getByText('TOTAL:')).toBeInTheDocument();
  });

  it('displays received by information', () => {
    render(<PrintReceiptModal {...defaultProps} />);
    
    expect(screen.getByText('Received by: Staff A')).toBeInTheDocument();
  });

  it('formats date correctly', () => {
    render(<PrintReceiptModal {...defaultProps} />);
    
    // The date should be formatted as "January 15, 2024"
    expect(screen.getByText('January 15, 2024')).toBeInTheDocument();
  });
});