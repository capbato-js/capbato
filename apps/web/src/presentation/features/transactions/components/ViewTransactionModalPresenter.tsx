import React from 'react';
import { Modal } from '../../../components/common';
import { Stack, Divider, Button, Group } from '@mantine/core';
import { IconPrinter } from '@tabler/icons-react';
import { TransactionHeader } from './TransactionHeader';
import { PatientInfoSection } from './PatientInfoSection';
import { TransactionItemsTable } from './TransactionItemsTable';
import { PaymentSummary } from './PaymentSummary';
import { Transaction } from '../types';
import { VIEW_TRANSACTION_MODAL_CONFIG, SECTION_CONFIG } from '../config/viewTransactionModalConfig';

interface ViewTransactionModalPresenterProps {
  opened: boolean;
  onClose: () => void;
  transaction: Transaction | null;
  onPrint: () => void;
}

export const ViewTransactionModalPresenter: React.FC<ViewTransactionModalPresenterProps> = ({
  opened,
  onClose,
  transaction,
  onPrint,
}) => {
  if (!transaction) {
    return null;
  }

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={VIEW_TRANSACTION_MODAL_CONFIG.title}
      size={VIEW_TRANSACTION_MODAL_CONFIG.size}
    >
      <Stack gap={SECTION_CONFIG.spacing.gap}>
        {/* Header Information */}
        <TransactionHeader transaction={transaction} />

        <Divider />

        {/* Patient Information */}
        <PatientInfoSection patient={transaction.patient} />

        <Divider />

        {/* Transaction Items */}
        <TransactionItemsTable items={transaction.items} />

        <Divider />

        {/* Payment Summary */}
        <PaymentSummary
          paymentMethod={transaction.paymentMethod}
          receivedBy={transaction.receivedBy}
          totalAmount={transaction.totalAmount}
        />

        {/* Action Buttons */}
        <Group justify="flex-end" mt="md">
          <Button
            variant="filled"
            leftSection={<IconPrinter size={20} />}
            onClick={onPrint}
          >
            Print Receipt
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
};