import React from 'react';
import { DataTable, TableColumn, TableActions } from '../../../components/common/DataTable';

// Define the prescription type to match the main prescriptions page format
interface PrescriptionDisplay {
  id: string;
  patientNumber: string;
  patientName: string;
  doctor: string;
  datePrescribed: string;
  medications: string | Array<{ name: string }>;
}

interface PrescriptionsTableProps {
  prescriptions: PrescriptionDisplay[];
  onViewPrescription?: (prescriptionId: string) => void;
  onEditPrescription?: (prescriptionId: string) => void;
  onDeletePrescription?: (prescriptionId: string) => void;
  canCreatePrescriptions?: boolean;
  showPatientInfo?: boolean; // Control whether to show Patient # and Patient's Name columns
}

export const PrescriptionsTable: React.FC<PrescriptionsTableProps> = ({
  prescriptions,
  onViewPrescription,
  onEditPrescription,
  onDeletePrescription,
  canCreatePrescriptions = false,
  showPatientInfo = true, // Default to true to show patient info
}) => {
  // Build columns conditionally based on showPatientInfo
  const allColumns: TableColumn<PrescriptionDisplay>[] = [
    ...(showPatientInfo ? [
      {
        key: 'patientNumber',
        header: 'Patient #',
        width: '15%',
        align: 'center',
        searchable: true
      },
      {
        key: 'patientName',
        header: "Patient's Name",
        width: '20%',
        align: 'left',
        searchable: true
      }
    ] as TableColumn<PrescriptionDisplay>[] : []),
    {
      key: 'doctor',
      header: "Doctor's Name",
      width: showPatientInfo ? '18%' : '25%',
      align: 'left',
      searchable: true
    },
    {
      key: 'datePrescribed',
      header: 'Date Prescribed',
      width: showPatientInfo ? '15%' : '20%',
      align: 'center',
      searchable: true,
      render: (value: string) => new Date(value).toLocaleDateString()
    },
    {
      key: 'medications',
      header: 'Medications',
      width: showPatientInfo ? '32%' : '55%',
      align: 'left',
      searchable: true,
      render: (value: string | Array<{ name: string }>) => {
        if (Array.isArray(value)) {
          return value.map(med => med.name).join(', ');
        }
        return value;
      }
    }
  ];

  const columns = allColumns;

  // Build actions based on permissions
  const actionButtons = [
    {
      icon: 'fas fa-eye',
      tooltip: 'View Prescription Details',
      onClick: (prescription: PrescriptionDisplay) => onViewPrescription?.(prescription.id),
    }
  ];

  // Only add edit and delete actions if user has prescription creation permissions
  if (canCreatePrescriptions) {
    actionButtons.push(
      {
        icon: 'fas fa-edit',
        tooltip: 'Update Prescription',
        onClick: (prescription: PrescriptionDisplay) => onEditPrescription?.(prescription.id),
      },
      {
        icon: 'fas fa-trash',
        tooltip: 'Delete Prescription',
        onClick: (prescription: PrescriptionDisplay) => onDeletePrescription?.(prescription.id),
      }
    );
  }

  const actions: TableActions<PrescriptionDisplay> = { buttons: actionButtons };

  const handleRowClick = (prescription: PrescriptionDisplay) => {
    onViewPrescription?.(prescription.id);
  };

  return (
    <DataTable
      data={prescriptions}
      columns={columns}
      actions={actions}
      onRowClick={handleRowClick}
      searchable={true}
      searchPlaceholder="Search prescriptions by patient, doctor, or medications..."
      emptyStateMessage="No prescriptions found for this patient"
      cursor="pointer"
      useViewportHeight={false}
    />
  );
};