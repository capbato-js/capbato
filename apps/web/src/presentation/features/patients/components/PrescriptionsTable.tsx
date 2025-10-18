import React from 'react';
import { DataTable, TableColumn } from '../../../components/common/DataTable';
import { BasePrescription } from '../../../components/common';

interface PrescriptionsTableProps {
  prescriptions: BasePrescription[];
  onViewPrescription?: (prescriptionId: string) => void;
  onEditPrescription?: (prescriptionId: string) => void;
  onDeletePrescription?: (prescriptionId: string) => void;
}

export const PrescriptionsTable: React.FC<PrescriptionsTableProps> = ({
  prescriptions,
  onViewPrescription,
  onEditPrescription,
  onDeletePrescription,
}) => {
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  const columns: TableColumn<BasePrescription>[] = [
    {
      key: 'medicationName',
      header: 'Medication',
      width: '20%',
      align: 'left',
    },
    {
      key: 'dosage',
      header: 'Dosage',
      width: '15%',
      align: 'left',
    },
    {
      key: 'frequency',
      header: 'Frequency',
      width: '15%',
      align: 'left',
    },
    {
      key: 'duration',
      header: 'Duration',
      width: '12%',
      align: 'left',
    },
    {
      key: 'prescribedDate',
      header: 'Date Prescribed',
      width: '13%',
      align: 'center',
      render: (value) => formatDate(value),
    },
    {
      key: 'doctor',
      header: "Doctor's Name",
      width: '17%',
      align: 'left',
    },
    {
      key: 'status',
      header: 'Status',
      width: '8%',
      align: 'center',
    },
  ];

  const actions = {
    buttons: [
      {
        icon: 'fas fa-eye',
        tooltip: 'View Prescription Details',
        onClick: (prescription: BasePrescription) => onViewPrescription?.(prescription.id),
      },
      {
        icon: 'fas fa-edit',
        tooltip: 'Update Prescription',
        onClick: (prescription: BasePrescription) => onEditPrescription?.(prescription.id),
      },
      {
        icon: 'fas fa-trash',
        tooltip: 'Delete Prescription',
        onClick: (prescription: BasePrescription) => onDeletePrescription?.(prescription.id),
      },
    ],
  };

  const handleRowClick = (prescription: BasePrescription) => {
    onViewPrescription?.(prescription.id);
  };

  return (
    <DataTable
      data={prescriptions}
      columns={columns}
      actions={actions}
      onRowClick={handleRowClick}
      searchable={true}
      searchPlaceholder="Search prescriptions by medication, doctor, or status..."
      emptyStateMessage="No prescriptions found for this patient"
      cursor="pointer"
      useViewportHeight={false}
    />
  );
};