import React from 'react';
import { Transaction } from '../types';
import { useDeleteTransactionModalActions } from '../hooks/useDeleteTransactionModalActions';
import { DeleteTransactionModalPresenter } from './DeleteTransactionModalPresenter';

interface DeleteTransactionModalContainerProps {
  opened: boolean;
  onClose: () => void;
  transaction: Transaction | null;
  onConfirm: () => void;
  isLoading?: boolean;
}

export const DeleteTransactionModalContainer: React.FC<DeleteTransactionModalContainerProps> = ({
  opened,
  onClose,
  transaction,
  onConfirm,
  isLoading = false,
}) => {
  const { handleConfirm, handleClose } = useDeleteTransactionModalActions({
    onConfirm,
    onClose
  });

  if (!transaction) {
    return null;
  }

  return (
    <DeleteTransactionModalPresenter
      opened={opened}
      onClose={handleClose}
      transaction={transaction}
      onConfirm={handleConfirm}
      isLoading={isLoading}
    />
  );
};