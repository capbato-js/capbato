import React from 'react';
import { Box, Button, Group, Title } from '@mantine/core';
import { IconArrowLeft } from '@tabler/icons-react';
import { MedicalClinicLayout } from '../../../components/layout';
import { AddPatientForm } from '../components';
import { useAddPatientFormViewModel } from '../view-models/useAddPatientFormViewModel';

export const AddPatientPage: React.FC = () => {
  const viewModel = useAddPatientFormViewModel();

  return (
    <MedicalClinicLayout>
      <Box
        style={{
          background: 'white',
          borderRadius: '15px',
          padding: '30px',
          boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
          minHeight: 'calc(100vh - 140px)',
          position: 'relative'
        }}
      >
        {/* Page Header - matching legacy HTML structure */}
        <Box
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '30px',
            paddingBottom: '20px',
            borderBottom: '2px solid #e9ecef'
          }}
        >
          <Group align="center" gap="lg">
            <Button
              variant="filled"
              color="gray"
              leftSection={<IconArrowLeft size={16} />}
              onClick={viewModel.handleCancel}
              size="sm"
              style={{
                backgroundColor: '#6c757d',
                fontSize: '14px'
              }}
            >
              Back to Patients
            </Button>
            <Title
              order={2}
              style={{
                fontSize: '32px',
                fontWeight: 700,
                color: '#333',
                margin: 0
              }}
            >
              Add New Patient
            </Title>
          </Group>
        </Box>

        <AddPatientForm
          onSubmit={viewModel.handleFormSubmit}
          onCancel={viewModel.handleCancel}
          isLoading={viewModel.isLoading}
          error={viewModel.error}
        />
      </Box>
    </MedicalClinicLayout>
  );
};