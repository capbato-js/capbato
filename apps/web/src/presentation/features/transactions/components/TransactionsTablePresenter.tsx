import React from 'react';
import { Box } from '@mantine/core';
import { DataTable, DataTableHeader } from '../../../components/common';
import { Transaction } from '../types';
import { useTransactionsTableConfig, createTransactionActions, transactionsTableSearchFields } from '../config/transactionsTableConfig';

type EnhancedTransaction = Transaction & {
  patientNumber: string;
  patientName: string;
};

interface TransactionsTablePresenterProps {
  enhancedTransactions: EnhancedTransaction[];
  onAddTransaction?: () => void;
  isLoading: boolean;
  onRefresh?: () => void;
  onTransactionClick: (transactionId: string | null) => void;
  onEditTransaction: (transaction: Transaction) => void;
  onPrintTransaction: (transaction: Transaction) => void;
  onDeleteTransaction: (transaction: Transaction) => void;
}

export const TransactionsTablePresenter: React.FC<TransactionsTablePresenterProps> = ({
  enhancedTransactions,
  onAddTransaction,
  isLoading,
  onRefresh,
  onTransactionClick,
  onEditTransaction,
  onPrintTransaction,
  onDeleteTransaction
}) => {
  const { columns } = useTransactionsTableConfig();

  const actions = createTransactionActions(
    onTransactionClick,
    onPrintTransaction,
    onDeleteTransaction
  );

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
        onRowClick={(transaction) => onTransactionClick(transaction.id)}
        searchable={true}
        searchPlaceholder="Search transactions..."
        searchFields={transactionsTableSearchFields}
        emptyStateMessage="No transactions found"
        isLoading={isLoading}
        cursor="pointer"
        useViewportHeight={true}
        bottomPadding={90}
      />
    </Box>
  );
};