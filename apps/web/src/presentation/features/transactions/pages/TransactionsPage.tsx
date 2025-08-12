import React, { useEffect, useState } from 'react';
import { Alert } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { MedicalClinicLayout } from '../../../components/layout';
import { TransactionsTable, AddReceiptModal, ViewTransactionModal, DeleteTransactionModal, PrintReceiptModal } from '../components';
import { useTransactionViewModel } from '../view-models';
import { useTransactionItemViewModel } from '../view-models/useTransactionItemViewModel';
import type { Transaction } from '../types';

export const TransactionsPage: React.FC = () => {
  const navigate = useNavigate();
  const { transactions, isLoading, error, refetch, clearError } = useTransactionViewModel();
  const { handleDelete, isDeleting } = useTransactionItemViewModel();
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  useEffect(() => {
    // loadTransactions is no longer needed - the view model handles loading automatically
  }, []);

  const handleAddTransaction = () => {
    setIsAddModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsAddModalOpen(false);
  };

  const handleViewTransaction = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsViewModalOpen(true);
  };

  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
    setSelectedTransaction(null);
  };

  const handleClosePrintModal = () => {
    setIsPrintModalOpen(false);
    setSelectedTransaction(null);
  };

  const handlePrintTransaction = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsPrintModalOpen(true);
  };

  const handleDeleteTransaction = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedTransaction(null);
  };

  const handleConfirmDelete = async () => {
    if (!selectedTransaction?.id) return;
    
    const success = await handleDelete(selectedTransaction.id);
    if (success) {
      handleCloseDeleteModal();
      refetch(); // Refresh the transactions list
    }
  };

  const handleReceiptCreated = (transaction: any) => {
    // Refresh the transactions list
    refetch();
    console.log('Receipt created:', transaction);
  };

  return (
    <MedicalClinicLayout>
      {/* No boxing - content flows naturally */}
      {error && (
        <Alert 
          color="red" 
          title="Error"
          mb="md"
          withCloseButton
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
    </MedicalClinicLayout>
  );
};