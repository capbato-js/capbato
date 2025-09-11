import React from 'react';
import { TransactionsTableContainer } from './TransactionsTableContainer';
import { Transaction } from '../types';

interface TransactionsTableProps {
  transactions: Transaction[];
  onAddTransaction?: () => void;
  isLoading?: boolean;
  onRefresh?: () => void;
  onViewTransaction?: (transaction: Transaction) => void;
  onDeleteTransaction?: (transaction: Transaction) => void;
  onPrintTransaction?: (transaction: Transaction) => void;
}

export const TransactionsTable: React.FC<TransactionsTableProps> = (props) => {
  return <TransactionsTableContainer {...props} />;
};