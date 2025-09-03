import { useCallback } from 'react';
import { useTransactionItemViewModel } from '../view-models/useTransactionItemViewModel';
import type { Transaction } from '../types';

interface UseTransactionsPageActionsProps {
  refetch: () => void;
  selectedTransaction: Transaction | null;
  handleCloseDeleteModal: () => void;
}

export const useTransactionsPageActions = ({ 
  refetch, 
  selectedTransaction, 
  handleCloseDeleteModal 
}: UseTransactionsPageActionsProps) => {
  const { handleDelete, isDeleting } = useTransactionItemViewModel();

  const handleConfirmDelete = useCallback(async () => {
    if (!selectedTransaction?.id) return;
    
    const success = await handleDelete(selectedTransaction.id);
    if (success) {
      handleCloseDeleteModal();
      refetch(); // Refresh the transactions list
    }
  }, [selectedTransaction?.id, handleDelete, handleCloseDeleteModal, refetch]);

  const handleReceiptCreated = useCallback((transaction: any) => {
    // Refresh the transactions list
    refetch();
    console.log('Receipt created:', transaction);
  }, [refetch]);

  return {
    handleConfirmDelete,
    handleReceiptCreated,
    isDeleting
  };
};