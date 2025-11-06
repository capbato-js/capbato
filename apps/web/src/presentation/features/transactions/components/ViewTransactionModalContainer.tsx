import React, { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { ViewTransactionModalPresenter } from './ViewTransactionModalPresenter';
import { ReceiptContent } from './ReceiptContent';
import { Transaction } from '../types';

interface ViewTransactionModalContainerProps {
  opened: boolean;
  onClose: () => void;
  transaction: Transaction | null;
}

export const ViewTransactionModalContainer: React.FC<ViewTransactionModalContainerProps> = ({
  opened,
  onClose,
  transaction,
}) => {
  const receiptRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: receiptRef,
    documentTitle: transaction ? `Receipt-${transaction.receiptNumber}` : 'Receipt',
  });

  if (!transaction) {
    return null;
  }

  return (
    <>
      <ViewTransactionModalPresenter
        opened={opened}
        onClose={onClose}
        transaction={transaction}
        onPrint={handlePrint}
      />

      {/* Hidden receipt content for printing */}
      <div style={{ display: 'none' }}>
        <ReceiptContent ref={receiptRef} transaction={transaction} />
      </div>
    </>
  );
};