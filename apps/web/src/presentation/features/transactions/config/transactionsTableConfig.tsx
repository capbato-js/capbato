import React from 'react';
import { TableColumn, TableActions } from '../../../components/common';
import { Transaction } from '../types';
import { formatCurrency, formatDate } from '../utils/transactionFormatUtils';
import { TableTextCell } from '../components/TableTextCell';

type EnhancedTransaction = Transaction & {
  patientNumber: string;
  patientName: string;
};

export const useTransactionsTableConfig = () => {
  const columns: TableColumn<EnhancedTransaction>[] = [
    {
      key: 'receiptNumber',
      header: 'Receipt #',
      width: '12%',
      align: 'center',
      searchable: true,
      render: (value) => (
        <TableTextCell>
          {value}
        </TableTextCell>
      )
    },
    {
      key: 'date',
      header: 'Date',
      width: '12%',
      align: 'center',
      searchable: false,
      render: (value) => (
        <Text style={textStyle}>
          {formatDate(value as string)}
        </Text>
      )
    },
    {
      key: 'patientNumber',
      header: 'Patient #',
      width: '12%',
      align: 'center',
      searchable: true,
      render: (value, transaction) => (
        <TableTextCell>
          {transaction.patient.patientNumber}
        </TableTextCell>
      )
    },
    {
      key: 'patientName',
      header: 'Patient Name',
      width: '18%',
      align: 'left',
      searchable: true,
      render: (value, transaction) => (
        <TableTextCell align="left">
          {transaction.patient.fullName}
        </TableTextCell>
      )
    },
    {
      key: 'itemsSummary',
      header: 'Items',
      width: '20%',
      align: 'left',
      searchable: true,
      render: (value) => (
        <TableTextCell align="left">
          {value}
        </TableTextCell>
      )
    },
    {
      key: 'totalAmount',
      header: 'Amount Paid',
      width: '12%',
      align: 'center',
      searchable: false,
      render: (value) => (
        <Text style={textStyle}>
          {formatCurrency(value as number)}
        </Text>
      )
    },
    {
      key: 'paymentMethod',
      header: 'Payment Method',
      width: '12%',
      align: 'center',
      searchable: true,
      render: (value) => (
        <TableTextCell>
          {value}
        </TableTextCell>
      )
    },
    {
      key: 'receivedBy',
      header: 'Received by',
      width: '15%',
      align: 'left',
      searchable: true,
      render: (value) => (
        <TableTextCell align="left">
          {value}
        </TableTextCell>
      )
    }
  ];

  return { columns };
};

export const createTransactionActions = (
  onViewTransaction: (transactionId: string | null) => void,
  onPrintTransaction: (transaction: Transaction) => void,
  onDeleteTransaction: (transaction: Transaction) => void
): TableActions<EnhancedTransaction> => ({
  buttons: [
    {
      icon: 'fas fa-eye',
      tooltip: 'View Transaction Details',
      onClick: (transaction) => onViewTransaction(transaction.id)
    },
    {
      icon: 'fas fa-print',
      tooltip: 'Print Receipt',
      onClick: onPrintTransaction
    },
    {
      icon: 'fas fa-trash',
      tooltip: 'Delete Transaction',
      onClick: onDeleteTransaction
    }
  ]
});

export const transactionsTableSearchFields = [
  'receiptNumber', 
  'patientNumber', 
  'patientName', 
  'itemsSummary', 
  'paymentMethod', 
  'receivedBy'
] as const;