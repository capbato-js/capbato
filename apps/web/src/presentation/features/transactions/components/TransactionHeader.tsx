import React from 'react';
import { Paper, Group, Box, Text, Badge } from '@mantine/core';
import { Transaction } from '../types';
import { formatDate } from '../utils/transactionFormatUtils';
import { SECTION_CONFIG, BADGE_CONFIG, ICONS } from '../config/viewTransactionModalConfig';

interface TransactionHeaderProps {
  transaction: Transaction;
}

export const TransactionHeader: React.FC<TransactionHeaderProps> = ({ transaction }) => {
  return (
    <Paper p="md" style={{ backgroundColor: SECTION_CONFIG.header.backgroundColor }}>
      <Group justify="space-between" align="flex-start">
        <Box>
          <Group gap="xs" align="center" mb="xs">
            {ICONS.receipt}
            <Text fw={600} size="lg">Receipt #{transaction.receiptNumber}</Text>
            <Badge {...BADGE_CONFIG.paymentMethod}>
              {transaction.paymentMethod}
            </Badge>
          </Group>
          <Group gap="xs" align="center">
            {ICONS.user}
            <Text c="dimmed">{transaction.patient.fullName}</Text>
            <Badge {...BADGE_CONFIG.patientNumber}>
              {transaction.patient.patientNumber}
            </Badge>
          </Group>
        </Box>
        <Box ta="right">
          <Group gap="xs" align="center" justify="flex-end" mb="xs">
            {ICONS.calendar}
            <Text fw={500}>Transaction Date</Text>
          </Group>
          <Text size="lg" fw={600}>
            {formatDate(transaction.date)}
          </Text>
        </Box>
      </Group>
    </Paper>
  );
};