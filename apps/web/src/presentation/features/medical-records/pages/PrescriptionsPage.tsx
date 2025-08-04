import React from 'react';
import { Box, Button } from '@mantine/core';
import { Icon } from '../../../components/common';
import { DataTable, DataTableHeader, TableColumn, TableActions } from '../../../components/common/DataTable';
import { MedicalClinicLayout } from '../../../components/layout';
import { Prescription } from '../types';

// Dummy data for prescriptions based on legacy structure
const dummyPrescriptions: Prescription[] = [
  {
    id: '1',
    patientNumber: 'P001',
    patientName: 'John Doe',
    doctor: 'Dr. Smith',
    datePrescribed: '2025-07-28',
    medications: 'Amoxicillin 500mg, Paracetamol 500mg'
  },
  {
    id: '2',
    patientNumber: 'P002',
    patientName: 'Jane Smith',
    doctor: 'Dr. Johnson',
    datePrescribed: '2025-07-27',
    medications: 'Ibuprofen 400mg, Cetirizine 10mg'
  },
  {
    id: '3',
    patientNumber: 'P003',
    patientName: 'Mike Wilson',
    doctor: 'Dr. Brown',
    datePrescribed: '2025-07-26',
    medications: 'Metformin 850mg, Lisinopril 10mg'
  },
  {
    id: '4',
    patientNumber: 'P004',
    patientName: 'Sarah Davis',
    doctor: 'Dr. Garcia',
    datePrescribed: '2025-07-25',
    medications: 'Omeprazole 20mg, Simvastatin 40mg'
  }
];

export const PrescriptionsPage: React.FC = () => {
  const handleAddPrescription = () => {
    console.log('Add prescription clicked');
    // TODO: Implement add prescription functionality
  };

  const handleViewPrescription = (prescription: Prescription) => {
    console.log('View prescription:', prescription);
    // TODO: Implement view prescription functionality
  };

  const handleEditPrescription = (prescription: Prescription) => {
    console.log('Edit prescription:', prescription);
    // TODO: Implement edit prescription functionality
  };

  const handleDeletePrescription = (prescription: Prescription) => {
    console.log('Delete prescription:', prescription);
    // TODO: Implement delete prescription functionality
  };

  const actions: TableActions<Prescription> = {
    buttons: [
      {
        icon: 'fas fa-eye',
        tooltip: 'View Prescription Details',
        onClick: handleViewPrescription
      },
      {
        icon: 'fas fa-edit',
        tooltip: 'Update Prescription',
        onClick: handleEditPrescription
      },
      {
        icon: 'fas fa-trash',
        tooltip: 'Delete Prescription',
        onClick: handleDeletePrescription
      }
    ]
  };

  // Define columns for the DataTable based on legacy structure
  const columns: TableColumn<Prescription>[] = [
    {
      key: 'patientNumber',
      header: 'Patient #',
      width: '18%',
      align: 'center',
      searchable: true
    },
    {
      key: 'patientName',
      header: "Patient's Name",
      width: '22%',
      align: 'left',
      searchable: true
    },
    {
      key: 'doctor',
      header: "Doctor's Name",
      width: '20%',
      align: 'left',
      searchable: true
    },
    {
      key: 'datePrescribed',
      header: 'Date Prescribed',
      width: '18%',
      align: 'center',
      searchable: true
    },
    {
      key: 'medications',
      header: 'Medications',
      width: '22%',
      align: 'left',
      searchable: true
    }
  ];

  return (
    <MedicalClinicLayout>
      <DataTableHeader 
        title="Prescriptions"
        onAddItem={handleAddPrescription}
        addButtonText="Add Prescription"
        addButtonIcon="fas fa-pills"
      />
      
      <DataTable
        data={dummyPrescriptions}
        columns={columns}
        actions={actions}
        onRowClick={handleViewPrescription}
        searchable={true}
        searchPlaceholder="Search prescriptions by patient, doctor, or medications..."
        emptyStateMessage="No prescriptions found"
        cursor="pointer"
        useViewportHeight={true}
        bottomPadding={90}
      />
    </MedicalClinicLayout>
  );
};
