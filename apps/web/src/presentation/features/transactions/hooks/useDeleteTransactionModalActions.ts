import { useCallback } from 'react';

interface UseDeleteTransactionModalActionsProps {
  onConfirm: () => void;
  onClose: () => void;
}

export const useDeleteTransactionModalActions = ({
  onConfirm,
  onClose
}: UseDeleteTransactionModalActionsProps) => {
  const handleConfirm = useCallback(() => {
    onConfirm();
  }, [onConfirm]);

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  return {
    handleConfirm,
    handleClose
  };
};