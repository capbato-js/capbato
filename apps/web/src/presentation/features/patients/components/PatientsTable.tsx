import React from 'react';
import { Box } from '@mantine/core';
import { DataTable, DataTableHeader, TableColumn } from '../../../components/common';
import { PatientListDto } from '@nx-starter/application-shared';

interface PatientsTableProps {
  patients: PatientListDto[];
  onAddPatient?: () => void;
}

export const PatientsTable: React.FC<PatientsTableProps> = ({
  patients,
  onAddPatient
}) => {
  // Transform patients to include fullName for display
  const patientsWithFullName = patients.map(patient => ({
    ...patient,
    fullName: [patient.firstName, patient.middleName, patient.lastName].filter(Boolean).join(' ')
  }));

  const columns: TableColumn<typeof patientsWithFullName[0]>[] = [
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
        data={patientsWithFullName}
        columns={columns}
        searchable={true}
        searchPlaceholder="Search patients..."
        searchFields={['fullName', 'patientNumber']}
        emptyStateMessage="No patients found"
      />
    </Box>
  );
};
