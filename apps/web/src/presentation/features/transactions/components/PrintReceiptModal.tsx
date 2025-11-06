import React, { useRef } from 'react';
import { Modal, Group, Stack, Button } from '@mantine/core';
import { useReactToPrint } from 'react-to-print';
import { Icon } from '../../../components/common';
import { Transaction } from '../types/TransactionTypes';
import { ReceiptContent } from './ReceiptContent';

interface PrintReceiptModalProps {
  opened: boolean;
  onClose: () => void;
  transaction: Transaction | null;
}

export const PrintReceiptModal: React.FC<PrintReceiptModalProps> = ({
  opened,
  onClose,
  transaction,
}) => {
  const componentRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: transaction ? `Receipt-${transaction.receiptNumber}` : 'Receipt',
  });

  if (!transaction) {
    return null;
  }

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Print Receipt"
      size="xl"
    >
      <Stack gap="lg">
        {/* Print Button */}
        <Group justify="flex-end">
          <Button
            leftSection={<Icon icon="fas fa-print" />}
            onClick={handlePrint}
            color="blue"
          >
            Print Receipt
          </Button>
        </Group>

        {/* Printable Receipt Layout */}
        <ReceiptContent ref={componentRef} transaction={transaction} />
      </Stack>
    </Modal>
  );
};