import React from 'react';
import { Box, Button, Group, Title, useMantineTheme } from '@mantine/core';
import { IconArrowLeft } from '@tabler/icons-react';
import { MedicalClinicLayout } from '../../../components/layout';
import { AddPatientForm } from '../components';
import { useAddPatientFormViewModel } from '../view-models/useAddPatientFormViewModel';

export const AddPatientPage: React.FC = () => {
  const theme = useMantineTheme();
  const viewModel = useAddPatientFormViewModel();

  return (
    <MedicalClinicLayout>
      {/* Page Header - matching legacy HTML structure */}
      <Box
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '30px',
          paddingBottom: '20px',
          borderBottom: `2px solid ${theme.colors.gray[3]}`
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
                color: '#0F0F0F',
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
    </MedicalClinicLayout>
  );
};