import React from 'react';
import { Box } from '@mantine/core';
import { DataTable, DataTableHeader, TableColumn } from '../../../components/common/DataTable';
import { Doctor } from '../types';

interface DoctorsTableProps {
  doctors: Doctor[];
}

export const DoctorsTable: React.FC<DoctorsTableProps> = ({ doctors }) => {
  // Define columns for the DataTable
  const columns: TableColumn<Doctor>[] = [
    {
      key: 'name',
      header: 'Doctor\'s Name',
      width: '40%',
      align: 'left',
      searchable: true
    },
    {
      key: 'specialization',
      header: 'Specialization',
      width: '35%',
      align: 'center',
      searchable: true
    },
    {
      key: 'contactNumber',
      header: 'Contact Number',
      width: '25%',
      align: 'center',
      searchable: true
    }
  ];

  return (
    <Box style={{ marginBottom: '35px' }}>
      <DataTableHeader 
        title="Doctors"
      />
      
      <DataTable
        data={doctors}
        columns={columns}
        searchable={true}
        searchPlaceholder="Search doctors by name, specialization, or contact number..."
        emptyStateMessage="No doctors found"
      />
    </Box>
  );
};
