import React from 'react';
import { TableColumn, TableActions } from '../../../components/common/DataTable';
import { Prescription } from '../types';
import { DisplayPrescription } from '../hooks/usePrescriptionData';

export const getPrescriptionTableColumns = (): TableColumn<Prescription>[] => [
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
  },
  {
    key: 'doctor',
    header: "Doctor's Name",
    width: '18%',
    align: 'left',
    searchable: true
  },
  {
    key: 'datePrescribed',
    header: 'Date Prescribed',
    width: '15%',
    align: 'center',
    searchable: true,
    render: (value: string) => new Date(value).toLocaleDateString()
  },
  {
    key: 'medications',
    header: 'Medications',
    width: '32%',
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

export const getPrescriptionTableActions = (handlers: {
  onView: (prescription: DisplayPrescription) => void;
  onEdit: (prescription: DisplayPrescription) => void;
  onDelete: (prescription: DisplayPrescription) => void;
}): TableActions<DisplayPrescription> => ({
  buttons: [
    {
      icon: 'fas fa-eye',
      tooltip: 'View Prescription Details',
      onClick: handlers.onView
    },
    {
      icon: 'fas fa-edit',
      tooltip: 'Update Prescription',
      onClick: handlers.onEdit
    },
    {
      icon: 'fas fa-trash',
      tooltip: 'Delete Prescription',
      onClick: handlers.onDelete
    }
  ]
});