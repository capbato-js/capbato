import React from 'react';
import { TransactionsPagePresenter } from './TransactionsPagePresenter';
import { useTransactionViewModel } from '../view-models';
import { useTransactionsPageModals } from '../hooks/useTransactionsPageModals';
import { useTransactionsPageActions } from '../hooks/useTransactionsPageActions';
import { useOverflowHidden } from '../../../hooks/useOverflowHidden';

export const TransactionsPageContainer: React.FC = () => {
  const { transactions, isLoading, error, refetch, clearError } = useTransactionViewModel();
  
  const modalHandlers = useTransactionsPageModals();
  
  const actionHandlers = useTransactionsPageActions({
    refetch,
    selectedTransaction: modalHandlers.selectedTransaction,
    handleCloseDeleteModal: modalHandlers.handleCloseDeleteModal
  });

  useOverflowHidden();

  return (
    <TransactionsPagePresenter
      transactions={transactions}
      isLoading={isLoading}
      error={error}
      clearError={clearError}
      refetch={refetch}
      
      // Modal State
      isAddModalOpen={modalHandlers.isAddModalOpen}
      isViewModalOpen={modalHandlers.isViewModalOpen}
      isDeleteModalOpen={modalHandlers.isDeleteModalOpen}
      isPrintModalOpen={modalHandlers.isPrintModalOpen}
      selectedTransaction={modalHandlers.selectedTransaction}
      
      // Modal Handlers
      handleAddTransaction={modalHandlers.handleAddTransaction}
      handleCloseModal={modalHandlers.handleCloseModal}
      handleViewTransaction={modalHandlers.handleViewTransaction}
      handleCloseViewModal={modalHandlers.handleCloseViewModal}
      handleClosePrintModal={modalHandlers.handleClosePrintModal}
      handlePrintTransaction={modalHandlers.handlePrintTransaction}
      handleDeleteTransaction={modalHandlers.handleDeleteTransaction}
      handleCloseDeleteModal={modalHandlers.handleCloseDeleteModal}
      
      // Action Handlers
      handleConfirmDelete={actionHandlers.handleConfirmDelete}
      handleReceiptCreated={actionHandlers.handleReceiptCreated}
      isDeleting={actionHandlers.isDeleting}
    />
  );
};