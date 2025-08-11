import React from 'react';
import { Modal } from '../../../components/common';
import { AddReceiptForm } from './AddReceiptForm';
import { AddTransactionFormData, CreateTransactionCommand } from '@nx-starter/application-shared';

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
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = async (data: AddTransactionFormData): Promise<boolean> => {
    try {
      setIsSubmitting(true);
      setError(null);

      // Convert form data to the expected backend payload format
      const createCommand: CreateTransactionCommand = {
        patientId: data.patientId,
        date: new Date(data.date).toISOString(),
        paymentMethod: data.paymentMethod,
        receivedById: data.receivedById,
        items: data.items.map(item => ({
          serviceName: item.serviceName,
          description: item.description || '',
          quantity: item.quantity,
          unitPrice: item.unitPrice,
        })),
      };

      // For now, just log the expected payload since backend integration is not yet implemented
      console.log('Expected backend payload:', createCommand);

      // Simulate successful creation
      setTimeout(() => {
        // Create a dummy transaction object for UI feedback
        const newTransaction = {
          id: Date.now(),
          receiptNumber: `R${Date.now().toString().slice(-6)}`,
          date: data.date,
          patient: {
            id: data.patientId,
            patientNumber: 'P001', // This would come from the actual patient data
            firstName: 'Patient',
            lastName: 'Name',
            fullName: 'Patient Name',
          },
          totalAmount: data.items.reduce((total, item) => total + (item.quantity * item.unitPrice), 0),
          paymentMethod: data.paymentMethod,
          receivedBy: 'Current Staff',
          items: data.items,
          itemsSummary: data.items.map(item => item.serviceName).join(', '),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        onReceiptCreated?.(newTransaction);
        onClose();
        setIsSubmitting(false);
      }, 1000);

      return true;
    } catch (error) {
      console.error('Failed to create receipt:', error);
      setError('Failed to create receipt. Please try again.');
      setIsSubmitting(false);
      return false;
    }
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Create Receipt/Transaction"
      size="xl"
    >
      <AddReceiptForm
        onSubmit={handleSubmit}
        isLoading={isSubmitting}
        error={error}
        onClearError={clearError}
      />
    </Modal>
  );
};