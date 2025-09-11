import React from 'react';
import { Stack, Group, Text, Badge } from '@mantine/core';
import { Transaction } from '../types';
import { formatCurrency, formatDateLong } from '../utils/transactionFormatUtils';

interface TransactionSummaryCardProps {
  transaction: Transaction;
}

export const TransactionSummaryCard: React.FC<TransactionSummaryCardProps> = ({
  transaction
}) => {
  return (
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
        <Text>{formatDateLong(transaction.date)}</Text>
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
  );
};