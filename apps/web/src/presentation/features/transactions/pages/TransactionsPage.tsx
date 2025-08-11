import React, { useEffect, useState } from 'react';
import { Alert } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { MedicalClinicLayout } from '../../../components/layout';
import { TransactionsTable, AddReceiptModal } from '../components';
import { useTransactionViewModel } from '../view-models';

export const TransactionsPage: React.FC = () => {
  const navigate = useNavigate();
  const { transactions, isLoading, error, refetch, clearError } = useTransactionViewModel();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

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
      />

      <AddReceiptModal
        opened={isAddModalOpen}
        onClose={handleCloseModal}
        onReceiptCreated={handleReceiptCreated}
      />
    </MedicalClinicLayout>
  );
};