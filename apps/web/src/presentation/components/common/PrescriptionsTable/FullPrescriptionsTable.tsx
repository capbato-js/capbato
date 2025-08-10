import React from 'react';
import { BasePrescriptionsTable, BasePrescription, PrescriptionsTableConfig, PrescriptionsTableCallbacks } from './BasePrescriptionsTable';

interface FullPrescriptionsTableProps {
  prescriptions: BasePrescription[];
  callbacks?: PrescriptionsTableCallbacks;
}

export const FullPrescriptionsTable: React.FC<FullPrescriptionsTableProps> = ({
  prescriptions,
  callbacks,
}) => {
  const config: PrescriptionsTableConfig = {
    showActions: true,
    showPatientInfo: true,
    showDoctorColumn: true,
    compactMode: false,
    useViewportHeight: true,
    bottomPadding: 90,
  };

  return (
    <BasePrescriptionsTable
      prescriptions={prescriptions}
      config={config}
      callbacks={callbacks}
    />
  );
};