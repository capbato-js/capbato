import React from 'react';
import { Box, Text, Group, Stack, Table, Paper } from '@mantine/core';
import { Transaction } from '../types/TransactionTypes';

interface ReceiptContentProps {
  transaction: Transaction;
}

export const ReceiptContent = React.forwardRef<HTMLDivElement, ReceiptContentProps>(
  ({ transaction }, ref) => {
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
      <Paper
        ref={ref}
        p="md"
        withBorder
        style={{
          backgroundColor: 'white',
          fontFamily: 'Arial, sans-serif',
        }}
      >
        {/* Print-specific styles */}
        <style>
          {`
            @media print {
              * {
                -webkit-print-color-adjust: exact !important;
                color-adjust: exact !important;
                print-color-adjust: exact !important;
              }
              table, th, td {
                border: 1px solid #666 !important;
                border-collapse: collapse !important;
              }
            }
            .print-divider {
              border-bottom: 1px solid #dee2e6;
              margin: 12px 0;
            }
            .print-total-divider {
              border-top: 1px solid #dee2e6;
              margin: 8px 0;
            }
            @media print {
              .print-divider {
                border-bottom: 1px solid #666 !important;
                margin: 12px 0 !important;
              }
              .print-total-divider {
                border-top: 1px solid #666 !important;
                margin: 8px 0 !important;
              }
            }
          `}
        </style>
        {/* Receipt Header */}
        <Box ta="center" mb="md">
          <Text size="xl" fw={700} mb="xs">OFFICIAL RECEIPT</Text>
        </Box>

        {/* Business Information Section */}
        <Group justify="space-between" mb="md">
          <Box>
            <Text fw={600} size="sm">M.G. Amores Medical Clinic </Text>
            <Text size="sm">24 Malanting St. Amparo Subd.</Text>
            <Text size="sm">Novaliches, Caloocan City</Text>
            <Text size="sm">(02) / 8461 -3133 09951243675</Text>
          </Box>
          <Box ta="right">
            <Text fw={600} size="sm">INVOICE NO.</Text>
            <Text size="sm" mb="xs">{transaction.receiptNumber}</Text>
            <Text fw={600} size="sm">PAID DATE</Text>
            <Text size="sm">{formatDate(transaction.date)}</Text>
          </Box>
        </Group>

        <div className="print-divider" />

        {/* Customer Information */}
        <Box mb="md">
          <Text fw={600} size="sm" mb="sm">CUSTOMER INFORMATION</Text>
          <Group gap="xl">
            <Box>
              <Text size="sm" fw={500}>NAME:</Text>
              <Text size="sm">{transaction.patient.fullName}</Text>
            </Box>
            <Box>
              <Text size="sm" fw={500}>PATIENT NO:</Text>
              <Text size="sm">{transaction.patient.patientNumber}</Text>
            </Box>
          </Group>
          <Box mt="sm">
            <Text size="sm" fw={500}>ADDRESS:</Text>
            <Text size="sm">{transaction.patient.address || 'N/A'}</Text>
          </Box>
          <Group gap="xl" mt="sm">
            <Box>
              <Text size="sm" fw={500}>PHONE:</Text>
              <Text size="sm">{transaction.patient.contactNumber || 'N/A'}</Text>
            </Box>
          </Group>
        </Box>

        {/* Items Table */}
        <Box mb="md">
          <Table
            striped
            withTableBorder
            withColumnBorders
            style={{
              border: '1px solid #666',
              borderCollapse: 'collapse',
            }}
          >
            <Table.Thead>
              <Table.Tr>
                <Table.Th style={{ width: '40%', border: '1px solid #666', padding: '8px' }}>ITEM DESCRIPTION</Table.Th>
                <Table.Th style={{ width: '15%', textAlign: 'center', border: '1px solid #666', padding: '8px' }}>QUANTITY</Table.Th>
                <Table.Th style={{ width: '20%', textAlign: 'right', border: '1px solid #666', padding: '8px' }}>UNIT PRICE</Table.Th>
                <Table.Th style={{ width: '25%', textAlign: 'right', border: '1px solid #666', padding: '8px' }}>TOTAL</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {transaction.items && transaction.items.length > 0 ? (
                transaction.items.map((item, index) => (
                  <Table.Tr key={index}>
                    <Table.Td style={{ border: '1px solid #666', padding: '8px' }}>
                      <Text size="sm" fw={500}>{item.serviceName}</Text>
                      {item.description && (
                        <Text size="xs" c="dimmed">{item.description}</Text>
                      )}
                    </Table.Td>
                    <Table.Td ta="center" style={{ border: '1px solid #666', padding: '8px' }}>
                      <Text size="sm">{item.quantity}</Text>
                    </Table.Td>
                    <Table.Td ta="right" style={{ border: '1px solid #666', padding: '8px' }}>
                      <Text size="sm">{formatCurrency(item.unitPrice)}</Text>
                    </Table.Td>
                    <Table.Td ta="right" style={{ border: '1px solid #666', padding: '8px' }}>
                      <Text size="sm" fw={500}>{formatCurrency(item.subtotal)}</Text>
                    </Table.Td>
                  </Table.Tr>
                ))
              ) : (
                <Table.Tr>
                  <Table.Td colSpan={4} ta="center" style={{ border: '1px solid #666', padding: '8px' }}>
                    <Text size="sm" c="dimmed">No items found</Text>
                  </Table.Td>
                </Table.Tr>
              )}

              {/* Empty rows for spacing - reduced for print */}
              {Array.from({ length: Math.max(0, 2 - (transaction.items?.length || 0)) }).map((_, index) => (
                <Table.Tr key={`empty-${index}`}>
                  <Table.Td style={{ border: '1px solid #666', padding: '8px' }}>&nbsp;</Table.Td>
                  <Table.Td style={{ border: '1px solid #666', padding: '8px' }}>&nbsp;</Table.Td>
                  <Table.Td style={{ border: '1px solid #666', padding: '8px' }}>&nbsp;</Table.Td>
                  <Table.Td style={{ border: '1px solid #666', padding: '8px' }}>&nbsp;</Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Box>

        {/* Payment Information and Summary */}
        <Group justify="space-between" align="flex-start" mb="md">
          {/* Payment Information */}
          <Box style={{ width: '45%' }}>
            <Text fw={600} size="sm" mb="sm">PAYMENT INFORMATION</Text>
            <Stack gap="xs">
              <Group gap="xs">
                <Text size="sm" fw={500} style={{ width: '150px' }}>PAYMENT METHOD:</Text>
                <Text size="sm">{transaction.paymentMethod}</Text>
              </Group>
              <Group gap="xs">
                <Text size="sm" fw={500} style={{ width: '150px' }}>AMOUNT PAID:</Text>
                <Text size="sm">{formatCurrency(transaction.totalAmount)}</Text>
              </Group>
            </Stack>
          </Box>

          {/* Total Summary */}
          <Box style={{ width: '45%' }}>
            <Stack gap="xs" ta="right">
              <Group justify="space-between">
                <Text size="sm" fw={700}>TOTAL:</Text>
                <Text size="sm" fw={700}>{formatCurrency(transaction.totalAmount)}</Text>
              </Group>
            </Stack>
          </Box>
        </Group>

        {/* Footer */}
        <Box ta="center" mt="md">
          <Text size="xs" c="dimmed">Received by: {transaction.receivedBy}</Text>
        </Box>
      </Paper>
    );
  }
);

ReceiptContent.displayName = 'ReceiptContent';
