import React from 'react';
import { Box, Anchor, Text } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { DataTable, DataTableHeader, TableColumn } from '../../../components/common';
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
  const navigate = useNavigate();

  // Transform patients to include fullName for display
  const patientsWithFullName = patients.map(patient => ({
    ...patient,
    fullName: [patient.firstName, patient.middleName, patient.lastName].filter(Boolean).join(' ')
  }));

  const handlePatientClick = (patientId: string) => {
    navigate(`/patients/${patientId}`);
  };

  const columns: TableColumn<typeof patientsWithFullName[0]>[] = [
    {
      key: 'patientNumber',
      header: 'Patient #',
      width: '40%',
      align: 'center',
      searchable: true,
      render: (value, record) => (
        <Anchor
          onClick={() => handlePatientClick(record.id)}
          style={{
            color: '#0047ab',
            textDecoration: 'none',
            cursor: 'pointer',
            fontWeight: 500
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.textDecoration = 'underline';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.textDecoration = 'none';
          }}
        >
          {value}
        </Anchor>
      )
    },
    {
      key: 'fullName',
      header: "Patient's Name",
      width: '60%',
      align: 'left',
      searchable: true,
      render: (value, record) => (
        <Anchor
          onClick={() => handlePatientClick(record.id)}
          style={{
            color: '#333',
            textDecoration: 'none',
            cursor: 'pointer',
            fontWeight: 'normal'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.textDecoration = 'underline';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.textDecoration = 'none';
          }}
        >
          {value}
        </Anchor>
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
        searchable={true}
        searchPlaceholder="Search patients..."
        searchFields={['fullName', 'patientNumber']}
        emptyStateMessage="No patients found"
        isLoading={isLoading}
      />
    </Box>
  );
};
