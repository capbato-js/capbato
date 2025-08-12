import React from 'react';
import { Box, Text, useMantineTheme } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { DataTable, DataTableHeader, TableColumn, TableActions } from '../../../components/common';
import { Transaction } from '../types';

interface TransactionsTableProps {
  transactions: Transaction[];
  onAddTransaction?: () => void;
  isLoading?: boolean;
  onRefresh?: () => void;
  onViewTransaction?: (transaction: Transaction) => void;
  onDeleteTransaction?: (transaction: Transaction) => void;
}

export const TransactionsTable: React.FC<TransactionsTableProps> = ({
  transactions,
  onAddTransaction,
  isLoading = false,
  onRefresh,
  onViewTransaction,
  onDeleteTransaction
}) => {
  const theme = useMantineTheme();
  const navigate = useNavigate();

  // Enhance transactions with flattened search fields
  const enhancedTransactions = transactions.map(transaction => ({
    ...transaction,
    patientNumber: transaction.patient.patientNumber,
    patientName: transaction.patient.fullName,
  }));

  const handleTransactionClick = (transactionId: string | null) => {
    if (!transactionId) return;
    const transaction = transactions.find(t => t.id === transactionId);
    if (transaction && onViewTransaction) {
      onViewTransaction(transaction);
    }
  };

  const handleEditTransaction = (transaction: Transaction) => {
    if (!transaction.id) return;
    // TODO: Navigate to edit transaction page when implemented
    console.log('Edit transaction:', transaction.id);
  };

  const handleDeleteTransaction = (transaction: Transaction) => {
    if (!transaction.id) return;
    if (onDeleteTransaction) {
      onDeleteTransaction(transaction);
    }
  };

  const actions: TableActions<typeof enhancedTransactions[0]> = {
    buttons: [
      {
        icon: 'fas fa-eye',
        tooltip: 'View Transaction Details',
        onClick: (transaction) => handleTransactionClick(transaction.id)
      },
      // {
      //   icon: 'fas fa-edit',
      //   tooltip: 'Edit Transaction',
      //   onClick: handleEditTransaction
      // },
      {
        icon: 'fas fa-trash',
        tooltip: 'Delete Transaction',
        onClick: handleDeleteTransaction
      }
    ]
  };

  const formatCurrency = (amount: number): string => {
    return `₱${amount.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-PH', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  const columns: TableColumn<typeof enhancedTransactions[0]>[] = [
    {
      key: 'receiptNumber',
      header: 'Receipt #',
      width: '12%',
      align: 'center',
      searchable: true,
      render: (value) => (
        <Text
          style={{
            color: theme.colors.customGray[8],
            fontWeight: 400,
            fontSize: '16px'
          }}
        >
          {value}
        </Text>
      )
    },
    {
      key: 'date',
      header: 'Date',
      width: '12%',
      align: 'center',
      searchable: false,
      render: (value) => (
        <Text
          style={{
            color: theme.colors.customGray[8],
            fontWeight: 400,
            fontSize: '16px'
          }}
        >
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
        <Text
          style={{
            color: theme.colors.customGray[8],
            fontWeight: 400,
            fontSize: '16px'
          }}
        >
          {transaction.patient.patientNumber}
        </Text>
      )
    },
    {
      key: 'patientName',
      header: 'Patient Name',
      width: '18%',
      align: 'left',
      searchable: true,
      render: (value, transaction) => (
        <Text
          style={{
            color: theme.colors.customGray[8],
            fontWeight: 400,
            fontSize: '16px'
          }}
        >
          {transaction.patient.fullName}
        </Text>
      )
    },
    {
      key: 'itemsSummary',
      header: 'Items',
      width: '20%',
      align: 'left',
      searchable: true,
      render: (value) => (
        <Text
          style={{
            color: theme.colors.customGray[8],
            fontWeight: 400,
            fontSize: '16px'
          }}
        >
          {value}
        </Text>
      )
    },
    {
      key: 'totalAmount',
      header: 'Amount Paid',
      width: '12%',
      align: 'center',
      searchable: false,
      render: (value) => (
        <Text
          style={{
            color: theme.colors.customGray[8],
            fontWeight: 400,
            fontSize: '16px'
          }}
        >
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
        <Text
          style={{
            color: theme.colors.customGray[8],
            fontWeight: 400,
            fontSize: '16px'
          }}
        >
          {value}
        </Text>
      )
    },
    {
      key: 'receivedBy',
      header: 'Received by',
      width: '15%',
      align: 'left',
      searchable: true,
      render: (value) => (
        <Text
          style={{
            color: theme.colors.customGray[8],
            fontWeight: 400,
            fontSize: '16px'
          }}
        >
          {value}
        </Text>
      )
    }
  ];

  return (
    <Box>
      <DataTableHeader
        title="Transaction Records"
        onAddItem={onAddTransaction}
        addButtonText="Add Transaction"
        addButtonIcon="fas fa-plus"
      />
      
      <DataTable
        data={enhancedTransactions}
        columns={columns}
        actions={actions}
        onRowClick={(transaction) => handleTransactionClick(transaction.id)}
        searchable={true}
        searchPlaceholder="Search transactions..."
        searchFields={['receiptNumber', 'patientNumber', 'patientName', 'itemsSummary', 'paymentMethod', 'receivedBy']}
        emptyStateMessage="No transactions found"
        isLoading={isLoading}
        cursor="pointer"
        useViewportHeight={true}
        bottomPadding={90}
      />
    </Box>
  );
};