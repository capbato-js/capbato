import React from 'react';
import { Box, Button, Group, Title, useMantineTheme } from '@mantine/core';
import { IconArrowLeft } from '@tabler/icons-react';
import { MedicalClinicLayout } from '../../../components/layout';
import { AddLabTestResultForm } from '../components';
import { useViewLabTestResultViewModel } from '../view-models/useViewLabTestResultViewModel';

export const ViewLabTestResultPage: React.FC = () => {
  const theme = useMantineTheme();
  const viewModel = useViewLabTestResultViewModel();

  return (
    <MedicalClinicLayout>
      {/* Page Header - matching other page structures */}
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
            onClick={viewModel.handleBack}
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
            View Lab Test Result
          </Title>
        </Group>
      </Box>

      <AddLabTestResultForm
        testType={viewModel.selectedLabTest?.testCategory}
        viewMode={true}
        enabledFields={viewModel.selectedLabTest?.enabledFields || []}
        existingData={viewModel.bloodChemistryData}
        isLoadingData={!viewModel.selectedLabTest || !viewModel.patientInfo}
        patientData={{
          patientNumber: viewModel.patientInfo?.patientNumber || '',
          patientName: viewModel.patientInfo?.patientName || '',
          age: viewModel.patientInfo?.age || 0,
          sex: viewModel.patientInfo?.sex || ''
        }}
        onSubmit={() => { /* No-op for view mode */ }}
        onCancel={viewModel.handleBack}
        error={viewModel.error}
      />
    </MedicalClinicLayout>
  );
};
