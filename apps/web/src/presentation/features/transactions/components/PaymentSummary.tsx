import React from 'react';
import { Box, Group, Text, Paper, Badge } from '@mantine/core';
import { Transaction } from '../types';
import { formatCurrency } from '../utils/transactionFormatUtils';
import { BADGE_CONFIG, ICONS } from '../config/viewTransactionModalConfig';

interface PaymentSummaryProps {
  paymentMethod: Transaction['paymentMethod'];
  receivedBy: Transaction['receivedBy'];
  totalAmount: Transaction['totalAmount'];
}

export const PaymentSummary: React.FC<PaymentSummaryProps> = ({
  paymentMethod,
  receivedBy,
  totalAmount
}) => {
  return (
    <Box>
      <Group gap="xs" align="center" mb="md">
        {ICONS.moneyBill}
        <Text fw={600} size="lg">Payment Summary</Text>
      </Group>
      <Paper p="md" withBorder>
        <Group justify="space-between" align="center">
          <Box>
            <Group gap="xl">
              <Box>
                <Text size="sm" c="dimmed" fw={500}>Payment Method</Text>
                <Badge {...BADGE_CONFIG.paymentMethodLarge}>
                  {paymentMethod}
                </Badge>
              </Box>
              <Box>
                <Text size="sm" c="dimmed" fw={500}>Received by</Text>
                <Text size="sm">{receivedBy}</Text>
              </Box>
            </Group>
          </Box>
          <Box ta="right">
            <Text size="sm" c="dimmed" fw={500}>Total Amount</Text>
            <Text size="xl" fw={700} c="green">
              {formatCurrency(totalAmount)}
            </Text>
          </Box>
        </Group>
      </Paper>
    </Box>
  );
};