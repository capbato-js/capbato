import React from 'react';
import { Box, Button, Alert, useMantineTheme } from '@mantine/core';
import { IconArrowLeft } from '@tabler/icons-react';
import { MedicalClinicLayout } from '../../../components/layout';
import { PatientDetails } from '../types';
import { CustomTabButton } from '../components/CustomTabButton';
import { PatientInfoTab } from '../components/tabs/PatientInfoTab';
import { AppointmentsTab } from '../components/tabs/AppointmentsTab';
import { PrescriptionsTab } from '../components/tabs/PrescriptionsTab';
import { LaboratoriesTab } from '../components/tabs/LaboratoriesTab';
import { PatientDetailsLoadingSkeleton } from '../components/PatientDetailsLoadingSkeleton';

interface PatientDetailsPagePresenterProps {
  // Data
  patient: PatientDetails | null;
  isLoading: boolean;
  error: string | null;
  hasError: boolean;
  patientId: string | undefined;
  
  // Navigation
  activeTab: string;
  onGoBack: () => void;
  onTabChange: (tabValue: string) => void;
  onClearError: () => void;
}

export const PatientDetailsPagePresenter: React.FC<PatientDetailsPagePresenterProps> = ({
  patient,
  isLoading,
  error,
  hasError,
  patientId,
  activeTab,
  onGoBack,
  onTabChange,
  onClearError,
}) => {
  const theme = useMantineTheme();

  const headerStyle = {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '30px',
    paddingBottom: '20px',
    borderBottom: `2px solid ${theme.colors.gray[3]}`
  };

  const backButtonStyle = {
    fontSize: '14px'
  };

  const tabContainerStyle = {
    display: 'flex',
    gap: '8px',
    marginBottom: '30px'
  };

  // Loading state
  if (isLoading) {
    return (
      <MedicalClinicLayout>
        <Box style={headerStyle}>
          <Button
            variant="filled"
            color="gray"
            leftSection={<IconArrowLeft size={16} />}
            onClick={onGoBack}
            size="sm"
            style={backButtonStyle}
          >
            Back to Patients
          </Button>
        </Box>

        <PatientDetailsLoadingSkeleton 
          activeTab={activeTab}
          onTabChange={onTabChange}
        />
      </MedicalClinicLayout>
    );
  }

  // Error state
  if (hasError || !patient) {
    return (
      <MedicalClinicLayout>
        <Box style={headerStyle}>
          <Button
            variant="filled"
            color="gray"
            leftSection={<IconArrowLeft size={16} />}
            onClick={onGoBack}
            size="sm"
            style={backButtonStyle}
          >
            Back to Patients
          </Button>
        </Box>

        <Alert 
          color="red" 
          title="Patient Not Found"
          onClose={onClearError}
          withCloseButton
        >
          {error || `The patient with ID "${patientId}" could not be found.`}
        </Alert>
      </MedicalClinicLayout>
    );
  }

  // Success state
  return (
    <MedicalClinicLayout>
      {/* Page Header with Back Button */}
      <Box style={headerStyle}>
        <Button
          variant="filled"
          color="gray"
          leftSection={<IconArrowLeft size={16} />}
          onClick={onGoBack}
          size="sm"
          style={backButtonStyle}
        >
          Back to Patients
        </Button>
      </Box>

      {/* Custom Tab Navigation */}
      <Box style={tabContainerStyle}>
        <CustomTabButton
          isActive={activeTab === 'patient-info'}
          icon="fas fa-user"
          onClick={() => onTabChange('patient-info')}
        >
          Patient Info
        </CustomTabButton>
        <CustomTabButton
          isActive={activeTab === 'appointments'}
          icon="fas fa-calendar-check"
          onClick={() => onTabChange('appointments')}
        >
          Appointments
        </CustomTabButton>
        <CustomTabButton
          isActive={activeTab === 'prescriptions'}
          icon="fas fa-prescription-bottle"
          onClick={() => onTabChange('prescriptions')}
        >
          Prescriptions
        </CustomTabButton>
        <CustomTabButton
          isActive={activeTab === 'laboratories'}
          icon="fas fa-flask"
          onClick={() => onTabChange('laboratories')}
        >
          Laboratories
        </CustomTabButton>
      </Box>

      {/* Tab Content */}
      <Box style={{ flex: 1 }}>
        {activeTab === 'patient-info' && <PatientInfoTab patient={patient} />}
        {activeTab === 'appointments' && <AppointmentsTab patientId={patient.id} />}
        {activeTab === 'prescriptions' && <PrescriptionsTab patientId={patient.id} />}
        {activeTab === 'laboratories' && <LaboratoriesTab />}
      </Box>
    </MedicalClinicLayout>
  );
};