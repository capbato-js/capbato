import React from 'react';
import { Box, Button, Group, Title, useMantineTheme } from '@mantine/core';
import { IconArrowLeft } from '@tabler/icons-react';
import { MedicalClinicLayout } from '../../../components/layout';
import { AddLabTestResultForm } from '../components';
import { useAddLabTestResultViewModel } from '../view-models/useAddLabTestResultViewModel';

export const AddLabTestResultPage: React.FC = () => {
  const theme = useMantineTheme();
  const viewModel = useAddLabTestResultViewModel();

  return (
    <MedicalClinicLayout>
      {/* Page Header - matching AddLabTestPage structure */}
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
            Back to Laboratory Tests
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
            Add Lab Test Result
          </Title>
        </Group>
      </Box>

      <AddLabTestResultForm
        testType={viewModel.selectedLabTest?.testCategory}
        enabledFields={viewModel.selectedLabTest?.enabledFields || []}
        existingData={undefined}
        isLoadingData={viewModel.isLoading}
        submitButtonText="Submit Result"
        patientData={{
          patientNumber: viewModel.patientInfo?.patientNumber || '',
          patientName: viewModel.patientInfo?.patientName || '',
          age: viewModel.patientInfo?.age || 0,
          sex: viewModel.patientInfo?.sex || ''
        }}
        onSubmit={viewModel.handleFormSubmit}
        onCancel={viewModel.handleCancel}
        isSubmitting={viewModel.isSubmitting}
        error={viewModel.error}
      />
    </MedicalClinicLayout>
  );
};
