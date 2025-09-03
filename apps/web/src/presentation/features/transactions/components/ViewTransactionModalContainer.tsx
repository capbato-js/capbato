import React from 'react';
import { ViewTransactionModalPresenter } from './ViewTransactionModalPresenter';
import { Transaction } from '../types';

interface ViewTransactionModalContainerProps {
  opened: boolean;
  onClose: () => void;
  transaction: Transaction | null;
}

export const ViewTransactionModalContainer: React.FC<ViewTransactionModalContainerProps> = (props) => {
  return <ViewTransactionModalPresenter {...props} />;
};