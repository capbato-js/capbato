import React from 'react';
import { Box, Button, Group, Title, useMantineTheme } from '@mantine/core';
import { IconArrowLeft } from '@tabler/icons-react';
import { MedicalClinicLayout } from '../../../components/layout';
import { AddLabTestForm } from '../components';
import { useAddLabTestFormViewModel } from '../view-models/useAddLabTestFormViewModel';

export const AddLabTestPage: React.FC = () => {
  const theme = useMantineTheme();
  const viewModel = useAddLabTestFormViewModel();

  return (
    <MedicalClinicLayout>
      {/* Page Header - matching AddPatientPage structure */}
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
              Back to Laboratory
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
              Add Lab Test Request
            </Title>
          </Group>
        </Box>

        <AddLabTestForm
          onSubmit={viewModel.handleFormSubmit}
          isLoading={viewModel.isLoading}
          error={viewModel.error}
        />
    </MedicalClinicLayout>
  );
};