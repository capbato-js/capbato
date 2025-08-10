import React from 'react';
import { BasePrescriptionsTable, BasePrescription, PrescriptionsTableCallbacks } from '../../../components/common';

interface PrescriptionsTableProps {
  prescriptions: BasePrescription[];
  onModifyPrescription?: (prescriptionId: string) => void;
  onDiscontinuePrescription?: (prescriptionId: string) => void;
  onCompletePrescription?: (prescriptionId: string) => void;
  onReactivatePrescription?: (prescriptionId: string) => void;
}

export const PrescriptionsTable: React.FC<PrescriptionsTableProps> = ({
  prescriptions,
  onModifyPrescription,
  onDiscontinuePrescription,
  onCompletePrescription,
  onReactivatePrescription,
}) => {
  const callbacks: PrescriptionsTableCallbacks = {
    onModifyPrescription,
    onDiscontinuePrescription,
    onCompletePrescription,
    onReactivatePrescription,
  };

  const config = {
    showActions: true,
    showPatientInfo: false, // Since this is patient-specific, no need to show patient info
    showDoctorColumn: true,
    compactMode: false,
    useViewportHeight: false,
    emptyStateMessage: "No prescriptions found for this patient"
  };

  return (
    <BasePrescriptionsTable
      prescriptions={prescriptions}
      config={config}
      callbacks={callbacks}
    />
  );
};