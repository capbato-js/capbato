import { useCallback } from 'react';
import { Transaction } from '../types';

interface UseTransactionsTableActionsProps {
  transactions: Transaction[];
  onViewTransaction?: (transaction: Transaction) => void;
  onDeleteTransaction?: (transaction: Transaction) => void;
  onPrintTransaction?: (transaction: Transaction) => void;
}

export const useTransactionsTableActions = ({
  transactions,
  onViewTransaction,
  onDeleteTransaction,
  onPrintTransaction
}: UseTransactionsTableActionsProps) => {
  const handleTransactionClick = useCallback((transactionId: string | null) => {
    if (!transactionId) return;
    const transaction = transactions.find(t => t.id === transactionId);
    if (transaction && onViewTransaction) {
      onViewTransaction(transaction);
    }
  }, [transactions, onViewTransaction]);

  const handleEditTransaction = useCallback((transaction: Transaction) => {
    if (!transaction.id) return;
    // TODO: Navigate to edit transaction page when implemented
    console.log('Edit transaction:', transaction.id);
  }, []);

  const handlePrintTransaction = useCallback((transaction: Transaction) => {
    if (!transaction.id) return;
    if (onPrintTransaction) {
      onPrintTransaction(transaction);
    }
  }, [onPrintTransaction]);

  const handleDeleteTransaction = useCallback((transaction: Transaction) => {
    if (!transaction.id) return;
    if (onDeleteTransaction) {
      onDeleteTransaction(transaction);
    }
  }, [onDeleteTransaction]);

  return {
    handleTransactionClick,
    handleEditTransaction,
    handlePrintTransaction,
    handleDeleteTransaction
  };
};