import { useState } from 'react';
import type { Transaction } from '../types';

export const useTransactionsPageModals = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

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

  return {
    // State
    isAddModalOpen,
    isViewModalOpen,
    isDeleteModalOpen,
    isPrintModalOpen,
    selectedTransaction,
    
    // Handlers
    handleAddTransaction,
    handleCloseModal,
    handleViewTransaction,
    handleCloseViewModal,
    handleClosePrintModal,
    handlePrintTransaction,
    handleDeleteTransaction,
    handleCloseDeleteModal
  };
};