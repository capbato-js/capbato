import React from 'react';
import { AddReceiptModalContainer } from './AddReceiptModalContainer';

interface AddReceiptModalProps {
  opened: boolean;
  onClose: () => void;
  onReceiptCreated?: (transaction: any) => void;
}

export const AddReceiptModal: React.FC<AddReceiptModalProps> = (props) => {
  return <AddReceiptModalContainer {...props} />;
};