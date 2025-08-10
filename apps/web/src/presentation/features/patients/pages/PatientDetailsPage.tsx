import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Button, Grid, Text, Alert, Skeleton, useMantineTheme } from '@mantine/core';
import { IconArrowLeft } from '@tabler/icons-react';
import { MedicalClinicLayout } from '../../../components/layout';
import { usePatientDetailsViewModel, usePatientPrescriptions, usePatientAppointments } from '../view-models';
import { PrescriptionsTable } from '../components';
import { PatientDetails } from '../types';
import { Icon } from '../../../components/common/Icon';
import { BaseAppointmentsTable } from '../../../components/common';

// Custom Tab Button Component that mimics legacy design
const CustomTabButton: React.FC<{
  isActive: boolean;
  icon: string;
  children: React.ReactNode;
  onClick: () => void;
}> = ({ isActive, icon, children, onClick }) => {
  const theme = useMantineTheme();
  return (
    <button
      onClick={onClick}
      style={{
        flex: '1 1 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        textAlign: 'center',
        background: isActive ? theme.colors.blue[7] : theme.colors.blue[1],
        color: isActive ? 'white' : theme.colors.blue[9],
        border: `2px solid ${isActive ? theme.colors.blue[7] : theme.colors.blue[1]}`,
        padding: '6px 15px',
        fontWeight: 'bold',
        borderRadius: '8px',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        minWidth: '110px',
        whiteSpace: 'nowrap',
        fontSize: '14px'
      }}
      onMouseEnter={(e) => {
        if (!isActive) {
          e.currentTarget.style.background = theme.colors.blue[2];
          e.currentTarget.style.border = `2px solid ${theme.colors.blue[2]}`;
        }
      }}
      onMouseLeave={(e) => {
        if (!isActive) {
          e.currentTarget.style.background = theme.colors.blue[1];
          e.currentTarget.style.border = `2px solid ${theme.colors.blue[1]}`;
        }
      }}
    >
      <Icon icon={icon} />
      {children}
    </button>
  );
};

const PatientInfoCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => {
  const theme = useMantineTheme();
  return (
  <Box
    style={{
      background: 'transparent',
      padding: 0,
      borderRadius: 0,
      border: 'none',
      boxShadow: 'none',
      textAlign: 'left'
    }}
  >
    <Text
      style={{
        marginBottom: '20px',
        color: theme.colors.blue[9],
        fontSize: '20px',
        fontWeight: 'bold',
        borderBottom: `2px solid ${theme.colors.blue[9]}`,
        paddingBottom: '8px'
      }}
    >
      {title}
    </Text>
    {children}
  </Box>
  );
};

const InfoRow: React.FC<{ 
  label: string; 
  value: string | number | null | undefined;
  fallback?: string;
  isRequired?: boolean;
}> = ({ label, value, fallback, isRequired = false }) => {
  const displayValue = (() => {
    // Handle null, undefined, or empty string
    if (value === null || value === undefined || value === '') {
      if (fallback) return fallback;
      if (isRequired) return <Text component="span" c="red" style={{ fontStyle: 'italic' }}>Required</Text>;
      return <Text component="span" c="dimmed" style={{ fontStyle: 'italic' }}>N/A</Text>;
    }
    
    // Handle valid values
    return String(value);
  })();

  return (
    <Text style={{ fontSize: '15px', margin: '8px 0', color: '#333' }}>
      <strong>{label}:</strong> {typeof displayValue === 'string' ? ` ${displayValue}` : <> {displayValue}</>}
    </Text>
  );
};

const PatientInfoTab: React.FC<{ patient: PatientDetails }> = ({ patient }) => {
  const formatAddress = (address: PatientDetails['address']) => {
    if (!address) return null;
    if (typeof address === 'string') return address;
    const parts = [address.street, address.city, address.province, address.zipCode].filter(Boolean);
    return parts.length > 0 ? parts.join(', ') : null;
  };

  const formatDateOfBirth = (dateStr: string | null | undefined) => {
    if (!dateStr) return null;
    try {
      return new Date(dateStr).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    } catch {
      return null;
    }
  };

  return (
    <Grid style={{ gap: '50px', maxWidth: '100%', margin: 0, padding: '0 20px' }}>
      <Grid.Col span={6}>
        <PatientInfoCard title="Patient Information">
          <InfoRow 
            label="Patient #" 
            value={patient.patientNumber} 
            isRequired={true}
          />
          <InfoRow 
            label="Full Name" 
            value={patient.fullName} 
            isRequired={true}
          />
          <InfoRow 
            label="Gender" 
            value={patient.gender} 
            fallback="Not specified"
          />
          <InfoRow 
            label="Age" 
            value={patient.age} 
            fallback="Not available"
          />
          <InfoRow 
            label="Date of Birth" 
            value={formatDateOfBirth(patient.dateOfBirth)} 
            isRequired={true}
          />
          <InfoRow 
            label="Contact Number" 
            value={patient.phoneNumber} 
            fallback="Not provided"
          />
          <InfoRow 
            label="Address" 
            value={formatAddress(patient.address)} 
            fallback="Not provided"
          />
        </PatientInfoCard>
      </Grid.Col>
      <Grid.Col span={6}>
        <PatientInfoCard title="Guardian Details">
          {patient.guardian ? (
            <>
              <InfoRow 
                label="Full Name" 
                value={patient.guardian.fullName} 
                fallback="Not provided"
              />
              <InfoRow 
                label="Gender" 
                value={patient.guardian.gender} 
                fallback="Not specified"
              />
              <InfoRow 
                label="Relationship" 
                value={patient.guardian.relationship} 
                fallback="Not specified"
              />
              <InfoRow 
                label="Contact Number" 
                value={patient.guardian.contactNumber} 
                fallback="Not provided"
              />
              <InfoRow 
                label="Address" 
                value={patient.guardian.address} 
                fallback="Not provided"
              />
            </>
          ) : (
            <Text style={{ fontSize: '15px', color: '#666', fontStyle: 'italic' }}>
              No guardian assigned to this patient
            </Text>
          )}
        </PatientInfoCard>
      </Grid.Col>
    </Grid>
  );
};

const AppointmentsTab: React.FC<{ patientId: string }> = ({ patientId }) => {
  const theme = useMantineTheme();
  const { appointments, isLoading, error } = usePatientAppointments(patientId);

  const config = {
    showActions: false, // No actions in patient view for now
    showContactColumn: false,
    showDateColumn: true,
    showPatientColumns: false, // Hide Patient # and Patient Name columns since we're in patient context
    compactMode: false,
    useViewportHeight: false,
    emptyStateMessage: "No appointments found for this patient"
  };

  return (
    <Box style={{ padding: '0 20px' }}>
      <Text
        style={{
          color: theme.colors.blue[9],
          fontSize: '20px',
          fontWeight: 'bold',
          marginBottom: '20px',
          marginTop: 0,
          borderBottom: `2px solid ${theme.colors.blue[9]}`,
          paddingBottom: '8px'
        }}
      >
        Appointments
      </Text>
      
      {isLoading && (
        <Box style={{ padding: '20px' }}>
          <Skeleton height={50} />
          <Skeleton height={50} mt="md" />
          <Skeleton height={50} mt="md" />
        </Box>
      )}
      
      {error && (
        <Alert color="red" style={{ marginBottom: '20px' }}>
          {error}
        </Alert>
      )}
      
      {!isLoading && !error && (
        <BaseAppointmentsTable
          appointments={appointments}
          config={config}
        />
      )}
    </Box>
  );
};

const PrescriptionsTab: React.FC<{ patientId: string }> = ({ patientId }) => {
  const theme = useMantineTheme();
  const { prescriptions, isLoading, error } = usePatientPrescriptions(patientId);

  if (isLoading) {
    return (
      <Box style={{ padding: '0 20px' }}>
        <Text
          style={{
            color: theme.colors.blue[9],
            fontSize: '20px',
            fontWeight: 'bold',
            marginBottom: '20px',
            marginTop: 0,
            borderBottom: `2px solid ${theme.colors.blue[9]}`,
            paddingBottom: '8px'
          }}
        >
          Prescriptions
        </Text>
        <Skeleton height={200} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box style={{ padding: '0 20px' }}>
        <Text
          style={{
            color: theme.colors.blue[9],
            fontSize: '20px',
            fontWeight: 'bold',
            marginBottom: '20px',
            marginTop: 0,
            borderBottom: `2px solid ${theme.colors.blue[9]}`,
            paddingBottom: '8px'
          }}
        >
          Prescriptions
        </Text>
        <Alert color="red" title="Error loading prescriptions">
          {error}
        </Alert>
      </Box>
    );
  }

  return (
    <Box style={{ padding: '0 20px' }}>
      <Text
        style={{
          color: theme.colors.blue[9],
          fontSize: '20px',
          fontWeight: 'bold',
          marginBottom: '20px',
          marginTop: 0,
          borderBottom: `2px solid ${theme.colors.blue[9]}`,
          paddingBottom: '8px'
        }}
      >
        Prescriptions
      </Text>
      <PrescriptionsTable prescriptions={prescriptions} />
    </Box>
  );
};

const LaboratoriesTab: React.FC = () => {
  const theme = useMantineTheme();
  return (
    <Box style={{ padding: '0 20px' }}>
      <Text
        style={{
          color: theme.colors.blue[9],
          fontSize: '20px',
          fontWeight: 'bold',
          marginBottom: '20px',
          marginTop: 0,
          borderBottom: `2px solid ${theme.colors.blue[9]}`,
          paddingBottom: '8px'
        }}
      >
        Laboratory Requests
      </Text>
      <Text style={{ fontSize: '16px', color: '#666' }}>
        Laboratory functionality will be implemented in future iterations.
      </Text>
    </Box>
  );
};

// Skeleton Loading Component
const PatientDetailsLoadingSkeleton: React.FC<{ 
  activeTab: string;
  onTabChange: (tabValue: string) => void;
}> = ({ activeTab, onTabChange }) => {
  const theme = useMantineTheme();
  return (
  <>
    {/* Real Tab Navigation - Always Visible */}
    <Box
      style={{
        display: 'flex',
        gap: '8px',
        marginBottom: '30px'
      }}
    >
      <CustomTabButton
        isActive={activeTab === 'patient-info'}
        icon="fas fa-user"
        onClick={() => onTabChange('patient-info')}
      >
        Patient Info
      </CustomTabButton>
      {/* <CustomTabButton
        isActive={activeTab === 'medical-records'}
        icon="fas fa-notes-medical"
        onClick={() => onTabChange('medical-records')}
      >
        Medical Records
      </CustomTabButton> */}
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

    {/* Content Skeleton - Changes based on active tab */}
    <Box style={{ flex: 1, padding: '0 20px' }}>
      {activeTab === 'patient-info' && (
        <Grid style={{ gap: '50px', maxWidth: '100%', margin: 0 }}>
          <Grid.Col span={6}>
            {/* Patient Information - Real structure with skeleton values */}
            <PatientInfoCard title="Patient Information">
              <Text style={{ fontSize: '15px', margin: '8px 0', color: '#333' }}>
                <strong>Patient #:</strong> <Skeleton height={16} width={100} display="inline-block" ml="sm" />
              </Text>
              <Text style={{ fontSize: '15px', margin: '8px 0', color: '#333' }}>
                <strong>Full Name:</strong> <Skeleton height={16} width={150} display="inline-block" ml="sm" />
              </Text>
              <Text style={{ fontSize: '15px', margin: '8px 0', color: '#333' }}>
                <strong>Gender:</strong> <Skeleton height={16} width={60} display="inline-block" ml="sm" />
              </Text>
              <Text style={{ fontSize: '15px', margin: '8px 0', color: '#333' }}>
                <strong>Age:</strong> <Skeleton height={16} width={30} display="inline-block" ml="sm" />
              </Text>
              <Text style={{ fontSize: '15px', margin: '8px 0', color: '#333' }}>
                <strong>Date of Birth:</strong> <Skeleton height={16} width={120} display="inline-block" ml="sm" />
              </Text>
              <Text style={{ fontSize: '15px', margin: '8px 0', color: '#333' }}>
                <strong>Contact Number:</strong> <Skeleton height={16} width={100} display="inline-block" ml="sm" />
              </Text>
              <Text style={{ fontSize: '15px', margin: '8px 0', color: '#333' }}>
                <strong>Address:</strong> <Skeleton height={16} width={200} display="inline-block" ml="sm" />
              </Text>
            </PatientInfoCard>
          </Grid.Col>
          <Grid.Col span={6}>
            {/* Guardian Details - Real structure with skeleton values */}
            <PatientInfoCard title="Guardian Details">
              <Text style={{ fontSize: '15px', margin: '8px 0', color: '#333' }}>
                <strong>Full Name:</strong> <Skeleton height={16} width={150} display="inline-block" ml="sm" />
              </Text>
              <Text style={{ fontSize: '15px', margin: '8px 0', color: '#333' }}>
                <strong>Gender:</strong> <Skeleton height={16} width={60} display="inline-block" ml="sm" />
              </Text>
              <Text style={{ fontSize: '15px', margin: '8px 0', color: '#333' }}>
                <strong>Relationship:</strong> <Skeleton height={16} width={80} display="inline-block" ml="sm" />
              </Text>
              <Text style={{ fontSize: '15px', margin: '8px 0', color: '#333' }}>
                <strong>Contact Number:</strong> <Skeleton height={16} width={100} display="inline-block" ml="sm" />
              </Text>
              <Text style={{ fontSize: '15px', margin: '8px 0', color: '#333' }}>
                <strong>Address:</strong> <Skeleton height={16} width={200} display="inline-block" ml="sm" />
              </Text>
            </PatientInfoCard>
          </Grid.Col>
        </Grid>
      )}
      
      {(activeTab === 'medical-records' || activeTab === 'prescriptions' || activeTab === 'laboratories') && (
        <Box>
          <Text
            style={{
              color: theme.colors.blue[9],
              fontSize: '20px',
              fontWeight: 'bold',
              marginBottom: '20px',
              marginTop: 0,
              borderBottom: `2px solid ${theme.colors.blue[9]}`,
              paddingBottom: '8px'
            }}
          >
            {activeTab === 'prescriptions' ? 'Prescriptions' : 'Laboratory Requests'}
          </Text>
          <Skeleton height={200} />
        </Box>
      )}
    </Box>
  </>
  );
};

export const PatientDetailsPage: React.FC = () => {
  const theme = useMantineTheme();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { patient, isLoading, error, hasError, clearError } = usePatientDetailsViewModel(id);
  const [activeTab, setActiveTab] = useState<string>('patient-info');

  const handleGoBack = () => {
    navigate('/patients');
  };

  const handleTabChange = (tabValue: string) => {
    setActiveTab(tabValue);
  };

  if (isLoading) {
    return (
      <MedicalClinicLayout>
        {/* Page Header with Back Button */}
        <Box
          style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '30px',
            paddingBottom: '20px',
            borderBottom: `2px solid ${theme.colors.gray[3]}`
          }}
        >
          <Button
            variant="filled"
            color="gray"
            leftSection={<IconArrowLeft size={16} />}
            onClick={handleGoBack}
            size="sm"
            style={{
              fontSize: '14px'
            }}
          >
            Back to Patients
          </Button>
        </Box>

        <PatientDetailsLoadingSkeleton 
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />
      </MedicalClinicLayout>
    );
  }

  if (hasError || !patient) {
    return (
      <MedicalClinicLayout>
        {/* Page Header with Back Button */}
        <Box
          style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '30px',
            paddingBottom: '20px',
            borderBottom: `2px solid ${theme.colors.gray[3]}`
          }}
        >
          <Button
            variant="filled"
            color="gray"
            leftSection={<IconArrowLeft size={16} />}
            onClick={handleGoBack}
            size="sm"
            style={{
              fontSize: '14px'
            }}
          >
            Back to Patients
          </Button>
        </Box>

        <Alert 
          color="red" 
          title="Patient Not Found"
          onClose={clearError}
          withCloseButton
        >
          {error || `The patient with ID "${id}" could not be found.`}
        </Alert>
      </MedicalClinicLayout>
    );
  }

  return (
    <MedicalClinicLayout>
      {/* Page Header with Back Button */}
      <Box
        style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: '30px',
          paddingBottom: '20px',
          borderBottom: `2px solid ${theme.colors.gray[3]}`
        }}
      >
        <Button
          variant="filled"
          color="gray"
          leftSection={<IconArrowLeft size={16} />}
          onClick={handleGoBack}
          size="sm"
          style={{
            fontSize: '14px'
          }}
        >
          Back to Patients
        </Button>
      </Box>

      {/* Custom Tab Navigation */}
      <Box
        style={{
          display: 'flex',
          gap: '8px',
          marginBottom: '30px'
        }}
      >
          <CustomTabButton
            isActive={activeTab === 'patient-info'}
            icon="fas fa-user"
            onClick={() => handleTabChange('patient-info')}
          >
            Patient Info
          </CustomTabButton>
          {/* <CustomTabButton
            isActive={activeTab === 'medical-records'}
            icon="fas fa-notes-medical"
            onClick={() => handleTabChange('medical-records')}
          >
            Medical Records
          </CustomTabButton> */}
          <CustomTabButton
            isActive={activeTab === 'appointments'}
            icon="fas fa-calendar-check"
            onClick={() => handleTabChange('appointments')}
          >
            Appointments
          </CustomTabButton>
          <CustomTabButton
            isActive={activeTab === 'prescriptions'}
            icon="fas fa-prescription-bottle"
            onClick={() => handleTabChange('prescriptions')}
          >
            Prescriptions
          </CustomTabButton>
          <CustomTabButton
            isActive={activeTab === 'laboratories'}
            icon="fas fa-flask"
            onClick={() => handleTabChange('laboratories')}
          >
            Laboratories
          </CustomTabButton>
        </Box>

        {/* Tab Content */}
        <Box style={{ flex: 1 }}>
          {activeTab === 'patient-info' && <PatientInfoTab patient={patient} />}
          {/* {activeTab === 'medical-records' && <PlaceholderTab title="Medical Records" />} */}
          {activeTab === 'appointments' && <AppointmentsTab patientId={patient.id} />}
          {activeTab === 'prescriptions' && <PrescriptionsTab patientId={patient.id} />}
          {activeTab === 'laboratories' && <LaboratoriesTab />}
        </Box>
    </MedicalClinicLayout>
  );
};