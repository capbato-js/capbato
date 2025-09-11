import React from 'react';
import { 
  AddReceiptModal, 
  ViewTransactionModal, 
  DeleteTransactionModal, 
  PrintReceiptModal 
} from './';
import type { Transaction } from '../types';

interface TransactionModalsProps {
  // Add Modal
  isAddModalOpen: boolean;
  handleCloseModal: () => void;
  handleReceiptCreated: (transaction: any) => void;
  
  // View Modal
  isViewModalOpen: boolean;
  handleCloseViewModal: () => void;
  
  // Delete Modal
  isDeleteModalOpen: boolean;
  handleCloseDeleteModal: () => void;
  handleConfirmDelete: () => Promise<void>;
  isDeleting: boolean;
  
  // Print Modal
  isPrintModalOpen: boolean;
  handleClosePrintModal: () => void;
  
  // Selected Transaction
  selectedTransaction: Transaction | null;
}

export const TransactionModals: React.FC<TransactionModalsProps> = ({
  isAddModalOpen,
  handleCloseModal,
  handleReceiptCreated,
  isViewModalOpen,
  handleCloseViewModal,
  isDeleteModalOpen,
  handleCloseDeleteModal,
  handleConfirmDelete,
  isDeleting,
  isPrintModalOpen,
  handleClosePrintModal,
  selectedTransaction
}) => {
  return (
    <>
      <AddReceiptModal
        opened={isAddModalOpen}
        onClose={handleCloseModal}
        onReceiptCreated={handleReceiptCreated}
      />

      <ViewTransactionModal
        opened={isViewModalOpen}
        onClose={handleCloseViewModal}
        transaction={selectedTransaction}
      />

      <DeleteTransactionModal
        opened={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        transaction={selectedTransaction}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
      />

      <PrintReceiptModal
        opened={isPrintModalOpen}
        onClose={handleClosePrintModal}
        transaction={selectedTransaction}
      />
    </>
  );
};