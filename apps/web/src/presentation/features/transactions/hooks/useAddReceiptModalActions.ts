import { useCallback } from 'react';
import { useTransactionFormViewModel } from '../view-models/useTransactionFormViewModel';
import { transformFormDataToTransaction } from '../utils/transactionFormatUtils';
import { AddTransactionFormData } from '@nx-starter/application-shared';

interface UseAddReceiptModalActionsProps {
  onReceiptCreated?: (transaction: any) => void;
  onClose: () => void;
}

export const useAddReceiptModalActions = ({
  onReceiptCreated,
  onClose
}: UseAddReceiptModalActionsProps) => {
  const { isSubmitting, submitError, handleSubmit, clearSubmitError } = useTransactionFormViewModel();

  const handleFormSubmit = useCallback(async (data: AddTransactionFormData): Promise<boolean> => {
    const transactionData = transformFormDataToTransaction(data);
    const success = await handleSubmit(transactionData);
    
    if (success) {
      onReceiptCreated?.(transactionData);
      onClose();
      return true;
    }
    
    return false;
  }, [handleSubmit, onReceiptCreated, onClose]);

  const handleCloseModal = useCallback(() => {
    clearSubmitError();
    onClose();
  }, [clearSubmitError, onClose]);

  return {
    isSubmitting,
    submitError,
    clearSubmitError,
    handleFormSubmit,
    handleCloseModal
  };
};