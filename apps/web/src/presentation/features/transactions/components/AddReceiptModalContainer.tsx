import React from 'react';
import { useAddReceiptModalActions } from '../hooks/useAddReceiptModalActions';
import { AddReceiptModalPresenter } from './AddReceiptModalPresenter';

interface AddReceiptModalContainerProps {
  opened: boolean;
  onClose: () => void;
  onReceiptCreated?: (transaction: any) => void;
}

export const AddReceiptModalContainer: React.FC<AddReceiptModalContainerProps> = ({
  opened,
  onClose,
  onReceiptCreated,
}) => {
  const {
    isSubmitting,
    submitError,
    clearSubmitError,
    handleFormSubmit,
    handleCloseModal
  } = useAddReceiptModalActions({
    onReceiptCreated,
    onClose
  });

  return (
    <AddReceiptModalPresenter
      opened={opened}
      onClose={handleCloseModal}
      onSubmit={handleFormSubmit}
      isLoading={isSubmitting}
      error={submitError}
      onClearError={clearSubmitError}
    />
  );
};