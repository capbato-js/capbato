import React, { useEffect } from 'react';
import { Alert } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { MedicalClinicLayout } from '../../../components/layout';
import { TransactionsTable } from '../components';
import { useTransactionViewModel } from '../view-models';

export const TransactionsPage: React.FC = () => {
  const navigate = useNavigate();
  const { transactions, isLoading, error, loadTransactions, clearError } = useTransactionViewModel();

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  const handleAddTransaction = () => {
    // TODO: Navigate to add transaction page when implemented
    console.log('Add new transaction');
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
      />
    </MedicalClinicLayout>
  );
};