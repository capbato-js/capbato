import React from 'react';
import { Box } from '@mantine/core';
import { DataTable, DataTableHeader, TableColumn } from '../../../components/common';
import { Patient } from '../types';

interface PatientsTableProps {
  patients: Patient[];
  onAddPatient?: () => void;
}

export const PatientsTable: React.FC<PatientsTableProps> = ({
  patients,
  onAddPatient
}) => {
  const columns: TableColumn<Patient>[] = [
    {
      key: 'patientNumber',
      header: 'Patient #',
      width: '40%',
      align: 'center',
      searchable: true
    },
    {
      key: 'fullName',
      header: "Patient's Name",
      width: '60%',
      align: 'left',
      searchable: true
    }
  ];

  return (
    <Box>
      <DataTableHeader
        title="Patient Records"
        onAddItem={onAddPatient}
        addButtonText="Add New Patient"
        addButtonIcon="fas fa-user-plus"
      />
      
      <DataTable
        data={patients}
        columns={columns}
        searchable={true}
        searchPlaceholder="Search patients..."
        searchFields={['fullName', 'patientNumber', 'phoneNumber']}
        emptyStateMessage="No patients found"
      />
    </Box>
  );
};
