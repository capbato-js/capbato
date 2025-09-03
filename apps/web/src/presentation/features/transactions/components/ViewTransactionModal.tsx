import React from 'react';
import { ViewTransactionModalContainer } from './ViewTransactionModalContainer';
import { Transaction } from '../types';

interface ViewTransactionModalProps {
  opened: boolean;
  onClose: () => void;
  transaction: Transaction | null;
}

export const ViewTransactionModal: React.FC<ViewTransactionModalProps> = (props) => {
  return <ViewTransactionModalContainer {...props} />;
};