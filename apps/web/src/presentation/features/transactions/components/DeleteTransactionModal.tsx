import React from 'react';
import { DeleteTransactionModalContainer } from './DeleteTransactionModalContainer';
import { Transaction } from '../types';

interface DeleteTransactionModalProps {
  opened: boolean;
  onClose: () => void;
  transaction: Transaction | null;
  onConfirm: () => void;
  isLoading?: boolean;
}

export const DeleteTransactionModal: React.FC<DeleteTransactionModalProps> = (props) => {
  return <DeleteTransactionModalContainer {...props} />;
};