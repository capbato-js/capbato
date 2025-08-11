import React from 'react';
import { Modal } from '../../../components/common';
import { AddReceiptForm } from './AddReceiptForm';
import { AddTransactionFormData } from '@nx-starter/application-shared';
import { useTransactionFormViewModel } from '../view-models/useTransactionFormViewModel';
import type { TransactionFormData } from '../view-models/useTransactionFormViewModel';

interface AddReceiptModalProps {
  opened: boolean;
  onClose: () => void;
  onReceiptCreated?: (transaction: any) => void;
}

export const AddReceiptModal: React.FC<AddReceiptModalProps> = ({
  opened,
  onClose,
  onReceiptCreated,
}) => {
  const { isSubmitting, submitError, handleSubmit, clearSubmitError } = useTransactionFormViewModel();

  const handleFormSubmit = async (data: AddTransactionFormData): Promise<boolean> => {
    // Convert the form data to our TransactionFormData format
    const transactionData: TransactionFormData = {
      patientId: data.patientId,
      date: data.date,
      paymentMethod: data.paymentMethod,
      receivedById: data.receivedById,
      items: data.items.map(item => ({
        serviceName: item.serviceName,
        description: item.description || '',
        quantity: item.quantity,
        unitPrice: item.unitPrice,
      })),
    };

    const success = await handleSubmit(transactionData);
    
    if (success) {
      onReceiptCreated?.(transactionData);
      onClose();
      return true;
    }
    
    return false;
  };
  const handleCloseModal = () => {
    clearSubmitError();
    onClose();
  };

  return (
    <Modal
      opened={opened}
      onClose={handleCloseModal}
      title="Create Receipt/Transaction"
      size="xl"
    >
      <AddReceiptForm
        onSubmit={handleFormSubmit}
        isLoading={isSubmitting}
        error={submitError}
        onClearError={clearSubmitError}
      />
    </Modal>
  );
};