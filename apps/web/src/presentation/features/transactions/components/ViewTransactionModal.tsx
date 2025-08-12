import React from 'react';
import { Modal } from '../../../components/common';
import { 
  Stack, 
  Text, 
  Group, 
  Badge, 
  Divider, 
  Box,
  Paper,
  Table,
} from '@mantine/core';
import { Icon } from '../../../components/common';
import { Transaction } from '../types';

interface ViewTransactionModalProps {
  opened: boolean;
  onClose: () => void;
  transaction: Transaction | null;
}

export const ViewTransactionModal: React.FC<ViewTransactionModalProps> = ({
  opened,
  onClose,
  transaction,
}) => {
  if (!transaction) {
    return null;
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatCurrency = (amount: number): string => {
    return `₱${amount.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Transaction Details"
      size="lg"
    >
      <Stack gap="lg">
        {/* Header Information */}
        <Paper p="md" style={{ backgroundColor: '#f8f9fa' }}>
          <Group justify="space-between" align="flex-start">
            <Box>
              <Group gap="xs" align="center" mb="xs">
                <Icon icon="fas fa-receipt" />
                <Text fw={600} size="lg">Receipt #{transaction.receiptNumber}</Text>
                <Badge variant="light" color="green">
                  {transaction.paymentMethod}
                </Badge>
              </Group>
              <Group gap="xs" align="center">
                <Icon icon="fas fa-user" />
                <Text c="dimmed">{transaction.patient.fullName}</Text>
                <Badge variant="light" color="blue">
                  {transaction.patient.patientNumber}
                </Badge>
              </Group>
            </Box>
            <Box ta="right">
              <Group gap="xs" align="center" justify="flex-end" mb="xs">
                <Icon icon="fas fa-calendar" />
                <Text fw={500}>Transaction Date</Text>
              </Group>
              <Text size="lg" fw={600}>
                {formatDate(transaction.date)}
              </Text>
            </Box>
          </Group>
        </Paper>

        <Divider />

        {/* Patient Information */}
        <Box>
          <Group gap="xs" align="center" mb="md">
            <Icon icon="fas fa-user-circle" />
            <Text fw={600} size="lg">Patient Information</Text>
          </Group>
          <Paper p="md" withBorder>
            <Group gap="xl">
              <Box>
                <Text size="sm" c="dimmed" fw={500}>Patient Number</Text>
                <Text size="sm">{transaction.patient.patientNumber}</Text>
              </Box>
              <Box>
                <Text size="sm" c="dimmed" fw={500}>Full Name</Text>
                <Text size="sm">{transaction.patient.fullName}</Text>
              </Box>
            </Group>
          </Paper>
        </Box>

        <Divider />

        {/* Transaction Items */}
        <Box>
          <Group gap="xs" align="center" mb="md">
            <Icon icon="fas fa-list" />
            <Text fw={600} size="lg">Services & Items</Text>
          </Group>

          {transaction.items && transaction.items.length > 0 ? (
            <Paper withBorder>
              <Table striped highlightOnHover>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Service/Item</Table.Th>
                    <Table.Th>Description</Table.Th>
                    <Table.Th ta="center">Qty</Table.Th>
                    <Table.Th ta="right">Unit Price</Table.Th>
                    <Table.Th ta="right">Subtotal</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {transaction.items.map((item, index) => (
                    <Table.Tr key={index}>
                      <Table.Td>
                        <Text fw={500}>{item.serviceName}</Text>
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm" c="dimmed">{item.description}</Text>
                      </Table.Td>
                      <Table.Td ta="center">
                        <Badge variant="light">{item.quantity}</Badge>
                      </Table.Td>
                      <Table.Td ta="right">
                        <Text>{formatCurrency(item.unitPrice)}</Text>
                      </Table.Td>
                      <Table.Td ta="right">
                        <Text fw={500}>{formatCurrency(item.subtotal)}</Text>
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </Paper>
          ) : (
            <Paper p="md" withBorder>
              <Text c="dimmed" ta="center">
                No items found for this transaction
              </Text>
            </Paper>
          )}
        </Box>

        <Divider />

        {/* Payment Summary */}
        <Box>
          <Group gap="xs" align="center" mb="md">
            <Icon icon="fas fa-money-bill-wave" />
            <Text fw={600} size="lg">Payment Summary</Text>
          </Group>
          <Paper p="md" withBorder>
            <Group justify="space-between" align="center">
              <Box>
                <Group gap="xl">
                  <Box>
                    <Text size="sm" c="dimmed" fw={500}>Payment Method</Text>
                    <Badge variant="light" color="green" size="lg">
                      {transaction.paymentMethod}
                    </Badge>
                  </Box>
                  <Box>
                    <Text size="sm" c="dimmed" fw={500}>Received by</Text>
                    <Text size="sm">{transaction.receivedBy}</Text>
                  </Box>
                </Group>
              </Box>
              <Box ta="right">
                <Text size="sm" c="dimmed" fw={500}>Total Amount</Text>
                <Text size="xl" fw={700} c="green">
                  {formatCurrency(transaction.totalAmount)}
                </Text>
              </Box>
            </Group>
          </Paper>
        </Box>
      </Stack>
    </Modal>
  );
};