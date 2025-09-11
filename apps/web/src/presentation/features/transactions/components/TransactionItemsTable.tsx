import React from 'react';
import { Box, Group, Text, Paper, Table, Badge } from '@mantine/core';
import { Transaction } from '../types';
import { formatCurrency } from '../utils/transactionFormatUtils';
import { TABLE_CONFIG, BADGE_CONFIG, ICONS, MESSAGES } from '../config/viewTransactionModalConfig';

interface TransactionItemsTableProps {
  items: Transaction['items'];
}

export const TransactionItemsTable: React.FC<TransactionItemsTableProps> = ({ items }) => {
  return (
    <Box>
      <Group gap="xs" align="center" mb="md">
        {ICONS.list}
        <Text fw={600} size="lg">Services & Items</Text>
      </Group>

      {items && items.length > 0 ? (
        <Paper withBorder>
          <Table striped={TABLE_CONFIG.striped} highlightOnHover={TABLE_CONFIG.highlightOnHover}>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>{TABLE_CONFIG.columns.service}</Table.Th>
                <Table.Th>{TABLE_CONFIG.columns.description}</Table.Th>
                <Table.Th ta="center">{TABLE_CONFIG.columns.quantity}</Table.Th>
                <Table.Th ta="right">{TABLE_CONFIG.columns.unitPrice}</Table.Th>
                <Table.Th ta="right">{TABLE_CONFIG.columns.subtotal}</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {items.map((item, index) => (
                <Table.Tr key={index}>
                  <Table.Td>
                    <Text fw={500}>{item.serviceName}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm" c="dimmed">{item.description}</Text>
                  </Table.Td>
                  <Table.Td ta="center">
                    <Badge {...BADGE_CONFIG.quantity}>{item.quantity}</Badge>
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
            {MESSAGES.noItems}
          </Text>
        </Paper>
      )}
    </Box>
  );
};