import React from 'react';
import { Prescription } from '../types';
import { normalizeMedications } from '../utils/viewPrescriptionUtils';
import { ViewPrescriptionModalPresenter } from './ViewPrescriptionModalPresenter';

interface ViewPrescriptionModalContainerProps {
  opened: boolean;
  onClose: () => void;
  prescription: Prescription | null;
  onPrint?: () => void;
  printRef?: React.RefObject<HTMLDivElement | null>;
  patientAge?: number;
  patientSex?: string;
  patientAddress?: string;
}

export const ViewPrescriptionModalContainer: React.FC<ViewPrescriptionModalContainerProps> = ({
  opened,
  onClose,
  prescription,
  onPrint,
  printRef,
  patientAge = 0,
  patientSex = '',
  patientAddress = '',
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
      onPrint={onPrint}
      printRef={printRef}
      patientAge={patientAge}
      patientSex={patientSex}
      patientAddress={patientAddress}
    />
  );
};