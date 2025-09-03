import React from 'react';
import { Alert } from '@mantine/core';
import { MedicalClinicLayout } from '../../../components/layout';
import { TransactionsTable } from '../components';
import { TransactionModals } from '../components/TransactionModals';
import { TRANSACTIONS_PAGE_CONFIG } from '../config/transactionsPageConfig';
import type { Transaction } from '../types';

interface TransactionsPagePresenterProps {
  // Data & Loading
  transactions: Transaction[];
  isLoading: boolean;
  error: string | null;
  clearError: () => void;
  refetch: () => void;

  // Modal State
  isAddModalOpen: boolean;
  isViewModalOpen: boolean;
  isDeleteModalOpen: boolean;
  isPrintModalOpen: boolean;
  selectedTransaction: Transaction | null;

  // Modal Handlers
  handleAddTransaction: () => void;
  handleCloseModal: () => void;
  handleViewTransaction: (transaction: Transaction) => void;
  handleCloseViewModal: () => void;
  handleClosePrintModal: () => void;
  handlePrintTransaction: (transaction: Transaction) => void;
  handleDeleteTransaction: (transaction: Transaction) => void;
  handleCloseDeleteModal: () => void;

  // Action Handlers
  handleConfirmDelete: () => Promise<void>;
  handleReceiptCreated: (transaction: any) => void;
  isDeleting: boolean;
}

export const TransactionsPagePresenter: React.FC<TransactionsPagePresenterProps> = ({
  transactions,
  isLoading,
  error,
  clearError,
  refetch,
  isAddModalOpen,
  isViewModalOpen,
  isDeleteModalOpen,
  isPrintModalOpen,
  selectedTransaction,
  handleAddTransaction,
  handleCloseModal,
  handleViewTransaction,
  handleCloseViewModal,
  handleClosePrintModal,
  handlePrintTransaction,
  handleDeleteTransaction,
  handleCloseDeleteModal,
  handleConfirmDelete,
  handleReceiptCreated,
  isDeleting
}) => {
  return (
    <MedicalClinicLayout>
      {error && (
        <Alert 
          color={TRANSACTIONS_PAGE_CONFIG.error.color}
          title={TRANSACTIONS_PAGE_CONFIG.error.title}
          mb={TRANSACTIONS_PAGE_CONFIG.error.marginBottom}
          withCloseButton={TRANSACTIONS_PAGE_CONFIG.error.withCloseButton}
          onClose={clearError}
        >
          {error}
        </Alert>
      )}
        
      <TransactionsTable
        transactions={transactions}
        onAddTransaction={handleAddTransaction}
        isLoading={isLoading}
        onRefresh={refetch}
        onViewTransaction={handleViewTransaction}
        onDeleteTransaction={handleDeleteTransaction}
        onPrintTransaction={handlePrintTransaction}
      />

      <TransactionModals
        isAddModalOpen={isAddModalOpen}
        handleCloseModal={handleCloseModal}
        handleReceiptCreated={handleReceiptCreated}
        isViewModalOpen={isViewModalOpen}
        handleCloseViewModal={handleCloseViewModal}
        isDeleteModalOpen={isDeleteModalOpen}
        handleCloseDeleteModal={handleCloseDeleteModal}
        handleConfirmDelete={handleConfirmDelete}
        isDeleting={isDeleting}
        isPrintModalOpen={isPrintModalOpen}
        handleClosePrintModal={handleClosePrintModal}
        selectedTransaction={selectedTransaction}
      />
    </MedicalClinicLayout>
  );
};