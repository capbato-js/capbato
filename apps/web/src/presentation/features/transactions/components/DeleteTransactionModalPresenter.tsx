import React from 'react';
import { Modal } from '../../../components/common';
import { 
  Text, 
  Group, 
  Button,
  Stack,
} from '@mantine/core';
import { Icon } from '../../../components/common';
import { Transaction } from '../types';
import { TransactionSummaryCard } from './TransactionSummaryCard';
import { ConfirmationAlert } from './ConfirmationAlert';

interface DeleteTransactionModalPresenterProps {
  opened: boolean;
  onClose: () => void;
  transaction: Transaction;
  onConfirm: () => void;
  isLoading: boolean;
}

export const DeleteTransactionModalPresenter: React.FC<DeleteTransactionModalPresenterProps> = ({
  opened,
  onClose,
  transaction,
  onConfirm,
  isLoading,
}) => {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Delete Transaction"
      size="md"
    >
      <Stack gap="md">
        <ConfirmationAlert 
          message="This action cannot be undone. The transaction will be permanently deleted."
        />

        <Text>
          Are you sure you want to delete the following transaction?
        </Text>

        <TransactionSummaryCard transaction={transaction} />

        <Group justify="flex-end" gap="sm">
          <Button
            variant="light"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            color="red"
            onClick={onConfirm}
            loading={isLoading}
            leftSection={<Icon icon="fas fa-trash" />}
          >
            Delete Transaction
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
};