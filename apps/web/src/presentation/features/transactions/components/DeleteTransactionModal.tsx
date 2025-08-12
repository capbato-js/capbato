import React from 'react';
import { Modal } from '../../../components/common';
import { 
  Text, 
  Group, 
  Button,
  Stack,
  Alert,
  Badge,
} from '@mantine/core';
import { Icon } from '../../../components/common';
import { Transaction } from '../types';

interface DeleteTransactionModalProps {
  opened: boolean;
  onClose: () => void;
  transaction: Transaction | null;
  onConfirm: () => void;
  isLoading?: boolean;
}

export const DeleteTransactionModal: React.FC<DeleteTransactionModalProps> = ({
  opened,
  onClose,
  transaction,
  onConfirm,
  isLoading = false,
}) => {
  if (!transaction) {
    return null;
  }

  const formatCurrency = (amount: number): string => {
    return `₱${amount.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleConfirm = () => {
    onConfirm();
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Delete Transaction"
      size="md"
    >
      <Stack gap="md">
        <Alert
          variant="light"
          color="red"
          icon={<Icon icon="fas fa-exclamation-triangle" />}
          title="Warning"
        >
          This action cannot be undone. The transaction will be permanently deleted.
        </Alert>

        <Text>
          Are you sure you want to delete the following transaction?
        </Text>

        <Stack gap="sm" p="md" style={{ backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
          <Group>
            <Text fw={500}>Receipt Number:</Text>
            <Text>{transaction.receiptNumber}</Text>
            <Badge variant="light" color="green">
              {transaction.paymentMethod}
            </Badge>
          </Group>
          <Group>
            <Text fw={500}>Patient:</Text>
            <Text>{transaction.patient.fullName}</Text>
            <Badge variant="light" color="blue">
              {transaction.patient.patientNumber}
            </Badge>
          </Group>
          <Group>
            <Text fw={500}>Date:</Text>
            <Text>{formatDate(transaction.date)}</Text>
          </Group>
          <Group>
            <Text fw={500}>Total Amount:</Text>
            <Text fw={600} c="green">
              {formatCurrency(transaction.totalAmount)}
            </Text>
          </Group>
          <Group>
            <Text fw={500}>Items:</Text>
            <Text>
              {transaction.itemsSummary || 'No items summary available'}
            </Text>
          </Group>
          <Group>
            <Text fw={500}>Received by:</Text>
            <Text>{transaction.receivedBy}</Text>
          </Group>
        </Stack>

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
            onClick={handleConfirm}
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