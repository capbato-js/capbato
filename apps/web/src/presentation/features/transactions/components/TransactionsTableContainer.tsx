import React from 'react';
import { Transaction } from '../types';
import { useTransactionsTableActions } from '../hooks/useTransactionsTableActions';
import { enhanceTransactionWithSearchFields } from '../utils/transactionFormatUtils';
import { TransactionsTablePresenter } from './TransactionsTablePresenter';

interface TransactionsTableContainerProps {
  transactions: Transaction[];
  onAddTransaction?: () => void;
  isLoading?: boolean;
  onRefresh?: () => void;
  onViewTransaction?: (transaction: Transaction) => void;
  onDeleteTransaction?: (transaction: Transaction) => void;
  onPrintTransaction?: (transaction: Transaction) => void;
}

export const TransactionsTableContainer: React.FC<TransactionsTableContainerProps> = (props) => {
  const {
    transactions,
    onAddTransaction,
    isLoading = false,
    onRefresh,
    onViewTransaction,
    onDeleteTransaction,
    onPrintTransaction
  } = props;

  const {
    handleTransactionClick,
    handleEditTransaction,
    handlePrintTransaction,
    handleDeleteTransaction
  } = useTransactionsTableActions({
    transactions,
    onViewTransaction,
    onDeleteTransaction,
    onPrintTransaction
  });

  const enhancedTransactions = transactions.map(enhanceTransactionWithSearchFields);

  return (
    <TransactionsTablePresenter
      enhancedTransactions={enhancedTransactions}
      onAddTransaction={onAddTransaction}
      isLoading={isLoading}
      onRefresh={onRefresh}
      onTransactionClick={handleTransactionClick}
      onEditTransaction={handleEditTransaction}
      onPrintTransaction={handlePrintTransaction}
      onDeleteTransaction={handleDeleteTransaction}
    />
  );
};