import React from 'react';
import { Box, Button, Text, Alert } from '@mantine/core';
import { DataTable, DataTableHeader, TableColumn } from '../../../components/common/DataTable';
import { DoctorDto } from '@nx-starter/application-shared';
import { useDoctorListViewModel } from '../view-models/useDoctorListViewModel';

export const DoctorsTable: React.FC = () => {
  const viewModel = useDoctorListViewModel();

  // Define columns for full doctor data (we'll use this as the default format)
  const columns: TableColumn<DoctorDto>[] = [
    {
      key: 'fullName',
      header: 'Doctor\'s Name',
      width: '30%',
      align: 'left',
      searchable: true
    },
    {
      key: 'specialization',
      header: 'Specialization',
      width: '25%',
      align: 'center',
      searchable: true
    },
    {
      key: 'formattedContactNumber',
      header: 'Contact Number',
      width: '20%',
      align: 'center',
      searchable: true
    },
    {
      key: 'email',
      header: 'Email',
      width: '25%',
      align: 'left',
      searchable: true
    }
  ];

  const handleRetry = () => {
    void viewModel.retry();
  };

  if (viewModel.hasError) {
    return (
      <Box style={{ marginBottom: '35px' }}>
        <DataTableHeader title="Doctors" />
        <Alert color="red" title="Error loading doctors">
          <Text>{viewModel.error}</Text>
          <Button onClick={handleRetry} mt="md" size="sm">
            Retry
          </Button>
        </Alert>
      </Box>
    );
  }

  return (
    <Box style={{ marginBottom: '35px' }}>
      <DataTableHeader title="Doctors" />
      
      <DataTable
        data={viewModel.filteredDoctors as DoctorDto[]}
        columns={columns}
        searchable={false}
        searchPlaceholder="Search doctors by name, specialization, or contact..."
        emptyStateMessage={
          viewModel.isEmpty 
            ? "No doctors found" 
            : "Loading doctors..."
        }
        isLoading={viewModel.isLoading}
        skeletonRowCount={2}
      />
    </Box>
  );
};
