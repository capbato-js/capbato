import { useEffect } from 'react';
import { useTransactionStore } from '../../../../infrastructure/state/TransactionStore';

/**
 * Transaction view model hook
 * Handles transaction data management and operations
 * Now uses real API integration instead of dummy data
 */
export const useTransactionViewModel = () => {
  const {
    transactions,
    status,
    error,
    getIsLoading,
    getHasError,
    getStats,
    loadTransactions,
    clearError,
  } = useTransactionStore();

  // Load transactions on mount
  useEffect(() => {
    if (status === 'idle') {
      loadTransactions();
    }
  }, [status, loadTransactions]);

  return {
    transactions,
    isLoading: getIsLoading(),
    error,
    stats: getStats(),
    hasError: getHasError(),
    loadTransactions,
    clearError,
    refetch: loadTransactions, // Alias for consistency
  };
};