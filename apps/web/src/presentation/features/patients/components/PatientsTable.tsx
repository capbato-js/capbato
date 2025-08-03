import React from 'react';
import { Box, Text, useMantineTheme } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { DataTable, DataTableHeader, TableColumn, TableActions } from '../../../components/common';
import { PatientListDto } from '@nx-starter/application-shared';

interface PatientsTableProps {
  patients: PatientListDto[];
  onAddPatient?: () => void;
  isLoading?: boolean;
}

export const PatientsTable: React.FC<PatientsTableProps> = ({
  patients,
  onAddPatient,
  isLoading = false
}) => {
  const theme = useMantineTheme();
  const navigate = useNavigate();

  // Transform patients to include fullName for display
  const patientsWithFullName = patients.map(patient => ({
    ...patient,
    fullName: [patient.firstName, patient.middleName, patient.lastName].filter(Boolean).join(' ')
  }));

  const handlePatientClick = (patientId: string) => {
    navigate(`/patients/${patientId}`);
  };

  const handleEditPatient = (patient: typeof patientsWithFullName[0]) => {
    // TODO: Implement edit functionality
    console.log('Edit patient:', patient);
  };

  const actions: TableActions<typeof patientsWithFullName[0]> = {
    buttons: [
      {
        icon: 'fas fa-eye',
        tooltip: 'View Patient Info',
        onClick: (patient) => handlePatientClick(patient.id)
      },
      {
        icon: 'fas fa-edit',
        tooltip: 'Update Patient Info',
        onClick: handleEditPatient
      }
    ]
  };

  const columns: TableColumn<typeof patientsWithFullName[0]>[] = [
    {
      key: 'patientNumber',
      header: 'Patient #',
      width: '40%',
      align: 'center',
      searchable: true,
      render: (value) => (
        <Text
          style={{
            color: theme.colors.customGray[8],
            fontWeight: 400,
            fontSize: '16px'
          }}
        >
          {value}
        </Text>
      )
    },
    {
      key: 'fullName',
      header: "Patient's Name",
      width: '60%',
      align: 'left',
      searchable: true,
      render: (value) => (
        <Text
          style={{
            color: theme.colors.customGray[8],
            fontWeight: 400,
            fontSize: '16px'
          }}
        >
          {value}
        </Text>
      )
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
        actions={actions}
        onRowClick={(patient) => handlePatientClick(patient.id)}
        searchable={true}
        searchPlaceholder="Search patients..."
        searchFields={['fullName', 'patientNumber']}
        emptyStateMessage="No patients found"
        isLoading={isLoading}
        cursor="pointer"
      />
    </Box>
  );
};
