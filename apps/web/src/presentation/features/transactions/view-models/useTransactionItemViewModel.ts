import { useState, useCallback } from 'react';
import { useTransactionStore } from '../../../../infrastructure/state/TransactionStore';
import type { TransactionDto } from '@nx-starter/application-shared';

/**
 * Transaction item view model hook
 * Handles operations on individual transactions (view, delete)
 */
export const useTransactionItemViewModel = (transactionId?: string) => {
  const { deleteTransaction, getTransaction, getTransactionById } = useTransactionStore();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Get transaction from store if available
  const transaction = transactionId ? getTransactionById(transactionId) : undefined;

  const handleDelete = useCallback(async (id: string): Promise<boolean> => {
    setIsDeleting(true);
    setDeleteError(null);

    try {
      await deleteTransaction(id);
      return true; // Success
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete transaction';
      setDeleteError(errorMessage);
      return false; // Failure
    } finally {
      setIsDeleting(false);
    }
  }, [deleteTransaction]);

  const loadTransaction = useCallback(async (id: string): Promise<TransactionDto | null> => {
    setIsLoading(true);
    setLoadError(null);

    try {
      const transaction = await getTransaction(id);
      return transaction;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load transaction';
      setLoadError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [getTransaction]);

  const clearDeleteError = useCallback(() => {
    setDeleteError(null);
  }, []);

  const clearLoadError = useCallback(() => {
    setLoadError(null);
  }, []);

  return {
    transaction,
    isDeleting,
    isLoading,
    deleteError,
    loadError,
    handleDelete,
    loadTransaction,
    clearDeleteError,
    clearLoadError,
  };
};