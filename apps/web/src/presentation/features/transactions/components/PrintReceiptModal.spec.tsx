import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { PrintReceiptModal } from './PrintReceiptModal';
import { Transaction } from '../types';

// Mock Mantine components
jest.mock('@mantine/core', () => ({
  Modal: ({ children, opened, title }: any) => {
    return opened ? <div data-testid="modal" aria-label={title}>{children}</div> : null;
  },
  Box: ({ children }: any) => <div>{children}</div>,
  Text: ({ children }: any) => <span>{children}</span>,
  Group: ({ children }: any) => <div>{children}</div>,
  Stack: ({ children }: any) => <div>{children}</div>,
  Table: ({ children }: any) => <table>{children}</table>,
  Button: ({ children, onClick }: any) => <button onClick={onClick}>{children}</button>,
  Divider: () => <hr />,
  Paper: ({ children }: any) => <div>{children}</div>,
}));

jest.mock('../../../components/common', () => ({
  Icon: ({ icon }: any) => <span data-testid="icon">{icon}</span>,
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
      fullName: 'John M. Doe'
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
    onClose: jest.fn(),
    transaction: mockTransaction,
  };

  beforeEach(() => {
    jest.clearAllMocks();
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
    expect(screen.getByText('[YOUR BUSINESS NAME HERE]')).toBeInTheDocument();
    expect(screen.getByText('[BUSINESS ADDRESS]')).toBeInTheDocument();
    expect(screen.getByText('[PHONE NUMBER]')).toBeInTheDocument();
  });

  it('displays transaction information correctly', () => {
    render(<PrintReceiptModal {...defaultProps} />);
    
    expect(screen.getByText('RCP-001')).toBeInTheDocument();
    expect(screen.getByText('John M. Doe')).toBeInTheDocument();
    expect(screen.getByText('P001')).toBeInTheDocument();
    expect(screen.getByText('Cash')).toBeInTheDocument();
    expect(screen.getByText('Staff A')).toBeInTheDocument();
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
    
    expect(screen.getByText('₱500.00')).toBeInTheDocument();
    expect(screen.getByText('₱1,000.00')).toBeInTheDocument();
    expect(screen.getByText('₱1,500.00')).toBeInTheDocument();
  });

  it('displays customer information placeholders', () => {
    render(<PrintReceiptModal {...defaultProps} />);
    
    expect(screen.getByText('[CUSTOMER ADDRESS]')).toBeInTheDocument();
    expect(screen.getByText('[CUSTOMER PHONE]')).toBeInTheDocument();
    expect(screen.getByText('[CUSTOMER EMAIL]')).toBeInTheDocument();
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
    expect(screen.getByText('BALANCE:')).toBeInTheDocument();
    expect(screen.getByText('₱0.00')).toBeInTheDocument(); // Balance should be 0
  });

  it('displays totals section correctly', () => {
    render(<PrintReceiptModal {...defaultProps} />);
    
    expect(screen.getByText('SUBTOTAL:')).toBeInTheDocument();
    expect(screen.getByText('TAX:')).toBeInTheDocument();
    expect(screen.getByText('SHIPPING:')).toBeInTheDocument();
    expect(screen.getByText('DISCOUNT:')).toBeInTheDocument();
    expect(screen.getByText('TOTAL:')).toBeInTheDocument();
  });

  it('displays additional information section', () => {
    render(<PrintReceiptModal {...defaultProps} />);
    
    expect(screen.getByText('ADDITIONAL INFORMATION')).toBeInTheDocument();
    expect(screen.getByText('[ADDITIONAL NOTES OR INFORMATION]')).toBeInTheDocument();
  });

  it('formats date correctly', () => {
    render(<PrintReceiptModal {...defaultProps} />);
    
    // The date should be formatted as "January 15, 2024"
    expect(screen.getByText('January 15, 2024')).toBeInTheDocument();
  });
});