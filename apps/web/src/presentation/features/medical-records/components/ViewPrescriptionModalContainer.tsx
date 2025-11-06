import React, { useState } from 'react';
import { Prescription } from '../types';
import { normalizeMedications } from '../utils/viewPrescriptionUtils';
import { ViewPrescriptionModalPresenter } from './ViewPrescriptionModalPresenter';
import { PrintPrescriptionModal } from './print-prescription-modal/PrintPrescriptionModal';

interface ViewPrescriptionModalContainerProps {
  opened: boolean;
  onClose: () => void;
  prescription: Prescription | null;
}

export const ViewPrescriptionModalContainer: React.FC<ViewPrescriptionModalContainerProps> = ({
  opened,
  onClose,
  prescription,
}) => {
  const [printModalOpen, setPrintModalOpen] = useState(false);

  if (!prescription) {
    return null;
  }

  const normalizedMedications = normalizeMedications(prescription);

  const handlePrint = () => {
    setPrintModalOpen(true);
  };

  const handleClosePrintModal = () => {
    setPrintModalOpen(false);
  };

  return (
    <>
      <ViewPrescriptionModalPresenter
        opened={opened}
        onClose={onClose}
        prescription={prescription}
        medications={normalizedMedications}
        onPrint={handlePrint}
      />

      <PrintPrescriptionModal
        opened={printModalOpen}
        onClose={handleClosePrintModal}
        prescription={prescription}
      />
    </>
  );
};