import { useState, useCallback } from 'react';
import { useTransactionStore } from '../../../../infrastructure/state/TransactionStore';
import type { CreateTransactionRequestDto } from '@nx-starter/application-shared';

export interface TransactionFormData {
  patientId: string;
  date: string;
  paymentMethod: string;
  receivedById: string;
  items: Array<{
    serviceName: string;
    description: string;
    quantity: number;
    unitPrice: number;
  }>;
}

/**
 * Transaction form view model hook
 * Handles transaction creation form state and operations
 */
export const useTransactionFormViewModel = () => {
  const { createTransaction } = useTransactionStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = useCallback(async (formData: TransactionFormData): Promise<boolean> => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const createTransactionData: CreateTransactionRequestDto = {
        patientId: formData.patientId,
        date: formData.date,
        paymentMethod: formData.paymentMethod,
        receivedById: formData.receivedById,
        items: formData.items,
      };

      await createTransaction(createTransactionData);
      return true; // Success
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create transaction';
      setSubmitError(errorMessage);
      return false; // Failure
    } finally {
      setIsSubmitting(false);
    }
  }, [createTransaction]);

  const clearSubmitError = useCallback(() => {
    setSubmitError(null);
  }, []);

  return {
    isSubmitting,
    submitError,
    handleSubmit,
    clearSubmitError,
  };
};