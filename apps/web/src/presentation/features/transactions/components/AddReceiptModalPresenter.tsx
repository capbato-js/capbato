import React from 'react';
import { Modal } from '../../../components/common';
import { AddReceiptForm } from './AddReceiptForm';
import { AddTransactionFormData } from '@nx-starter/application-shared';

interface AddReceiptModalPresenterProps {
  opened: boolean;
  onClose: () => void;
  onSubmit: (data: AddTransactionFormData) => Promise<boolean>;
  isLoading: boolean;
  error: string | null;
  onClearError: () => void;
}

export const AddReceiptModalPresenter: React.FC<AddReceiptModalPresenterProps> = ({
  opened,
  onClose,
  onSubmit,
  isLoading,
  error,
  onClearError
}) => {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Create Receipt/Transaction"
      size="xl"
    >
      <AddReceiptForm
        onSubmit={onSubmit}
        isLoading={isLoading}
        error={error}
        onClearError={onClearError}
      />
    </Modal>
  );
};