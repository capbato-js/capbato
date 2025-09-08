import React from 'react';
import { Prescription } from '../types';
import { normalizeMedications } from '../utils/viewPrescriptionUtils';
import { ViewPrescriptionModalPresenter } from './ViewPrescriptionModalPresenter';

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
  if (!prescription) {
    return null;
  }

  const normalizedMedications = normalizeMedications(prescription);

  return (
    <ViewPrescriptionModalPresenter
      opened={opened}
      onClose={onClose}
      prescription={prescription}
      medications={normalizedMedications}
    />
  );
};