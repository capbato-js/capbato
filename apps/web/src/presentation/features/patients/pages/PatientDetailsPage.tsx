import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Button, Grid, Text, Table, Alert, Skeleton, useMantineTheme } from '@mantine/core';
import { IconArrowLeft } from '@tabler/icons-react';
import { MedicalClinicLayout } from '../../../components/layout';
import { usePatientDetailsViewModel } from '../view-models/usePatientDetailsViewModel';
import { PatientDetails, Appointment } from '../types';
import { Icon } from '../../../components/common/Icon';

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

const AppointmentsTab: React.FC<{ appointments: Appointment[] }> = ({ appointments }) => {
  const theme = useMantineTheme();
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const formatTime = (timeStr: string) => {
    const [hour, minute] = timeStr.split(':');
    const h = parseInt(hour, 10);
    const suffix = h >= 12 ? 'PM' : 'AM';
    const hour12 = ((h + 11) % 12 + 1);
    return `${hour12}:${minute} ${suffix}`;
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
      <Table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          marginTop: '12px',
          borderRadius: '10px',
          overflow: 'hidden'
        }}
      >
        <Table.Thead style={{ background: theme.colors.tableBlue[0] }}>
          <Table.Tr>
            <Table.Th style={{ padding: '12px', textAlign: 'center', color: theme.colors.tableBlue[9], fontWeight: 600 }}>Date</Table.Th>
            <Table.Th style={{ padding: '12px', textAlign: 'center', color: theme.colors.tableBlue[9], fontWeight: 600 }}>Time</Table.Th>
            <Table.Th style={{ padding: '12px', textAlign: 'left', paddingLeft: '16px', color: theme.colors.tableBlue[9], fontWeight: 600 }}>Reason for Visit</Table.Th>
            <Table.Th style={{ padding: '12px', textAlign: 'left', paddingLeft: '16px', color: theme.colors.tableBlue[9], fontWeight: 600 }}>Lab Tests Done</Table.Th>
            <Table.Th style={{ padding: '12px', textAlign: 'left', paddingLeft: '16px', color: theme.colors.tableBlue[9], fontWeight: 600 }}>Prescriptions</Table.Th>
            <Table.Th style={{ padding: '12px', textAlign: 'center', color: theme.colors.tableBlue[9], fontWeight: 600 }}>Status</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {appointments.length === 0 ? (
            <Table.Tr>
              <Table.Td colSpan={6} style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #ddd' }}>
                No appointments found.
              </Table.Td>
            </Table.Tr>
          ) : (
            appointments.map((appointment) => (
              <Table.Tr key={appointment.id}>
                <Table.Td style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #ddd' }}>
                  {formatDate(appointment.date)}
                </Table.Td>
                <Table.Td style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #ddd' }}>
                  {formatTime(appointment.time)}
                </Table.Td>
                <Table.Td style={{ padding: '12px', textAlign: 'left', paddingLeft: '16px', borderBottom: '1px solid #ddd' }}>
                  {appointment.reasonForVisit}
                </Table.Td>
                <Table.Td style={{ padding: '12px', textAlign: 'left', paddingLeft: '16px', borderBottom: '1px solid #ddd' }}>
                  {appointment.labTestsDone}
                </Table.Td>
                <Table.Td style={{ padding: '12px', textAlign: 'left', paddingLeft: '16px', borderBottom: '1px solid #ddd' }}>
                  {appointment.prescriptions}
                </Table.Td>
                <Table.Td style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #ddd' }}>
                  {appointment.status}
                </Table.Td>
              </Table.Tr>
            ))
          )}
        </Table.Tbody>
      </Table>
    </Box>
  );
};

const PlaceholderTab: React.FC<{ title: string }> = ({ title }) => {
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
      {title}
    </Text>
    <Text style={{ fontSize: '16px', color: '#666' }}>
      {title} functionality will be implemented in future iterations.
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
      <CustomTabButton
        isActive={activeTab === 'medical-records'}
        icon="fas fa-notes-medical"
        onClick={() => onTabChange('medical-records')}
      >
        Medical Records
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
      
      {activeTab === 'appointments' && (
        <Box>
          {/* Real title, skeleton table */}
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
          <Table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              marginTop: '12px',
              borderRadius: '10px',
              overflow: 'hidden'
            }}
          >
            {/* Real table headers */}
            <Table.Thead style={{ background: theme.colors.tableBlue[0] }}>
              <Table.Tr>
                <Table.Th style={{ padding: '12px', textAlign: 'center', color: theme.colors.tableBlue[9], fontWeight: 600 }}>Date</Table.Th>
                <Table.Th style={{ padding: '12px', textAlign: 'center', color: theme.colors.tableBlue[9], fontWeight: 600 }}>Time</Table.Th>
                <Table.Th style={{ padding: '12px', textAlign: 'left', paddingLeft: '16px', color: theme.colors.tableBlue[9], fontWeight: 600 }}>Reason for Visit</Table.Th>
                <Table.Th style={{ padding: '12px', textAlign: 'left', paddingLeft: '16px', color: theme.colors.tableBlue[9], fontWeight: 600 }}>Lab Tests Done</Table.Th>
                <Table.Th style={{ padding: '12px', textAlign: 'left', paddingLeft: '16px', color: theme.colors.tableBlue[9], fontWeight: 600 }}>Prescriptions</Table.Th>
                <Table.Th style={{ padding: '12px', textAlign: 'center', color: theme.colors.tableBlue[9], fontWeight: 600 }}>Status</Table.Th>
              </Table.Tr>
            </Table.Thead>
            {/* Skeleton table rows */}
            <Table.Tbody>
              {[1, 2, 3].map((index) => (
                <Table.Tr key={index}>
                  <Table.Td style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #ddd' }}>
                    <Skeleton height={16} width={80} />
                  </Table.Td>
                  <Table.Td style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #ddd' }}>
                    <Skeleton height={16} width={60} />
                  </Table.Td>
                  <Table.Td style={{ padding: '12px', textAlign: 'left', paddingLeft: '16px', borderBottom: '1px solid #ddd' }}>
                    <Skeleton height={16} width={120} />
                  </Table.Td>
                  <Table.Td style={{ padding: '12px', textAlign: 'left', paddingLeft: '16px', borderBottom: '1px solid #ddd' }}>
                    <Skeleton height={16} width={100} />
                  </Table.Td>
                  <Table.Td style={{ padding: '12px', textAlign: 'left', paddingLeft: '16px', borderBottom: '1px solid #ddd' }}>
                    <Skeleton height={16} width={90} />
                  </Table.Td>
                  <Table.Td style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #ddd' }}>
                    <Skeleton height={16} width={70} />
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Box>
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
            {activeTab === 'medical-records' ? 'Medical Records' : 
             activeTab === 'prescriptions' ? 'Prescriptions' : 'Laboratory Requests'}
          </Text>
          <Text style={{ fontSize: '16px', color: '#666' }}>
            {activeTab === 'medical-records' ? 'Medical Records' : 
             activeTab === 'prescriptions' ? 'Prescriptions' : 'Laboratory Requests'} functionality will be implemented in future iterations.
          </Text>
        </Box>
      )}
    </Box>

    {/* Go Back Button Skeleton */}
    <Box
      style={{
        display: 'flex',
        justifyContent: 'center',
        marginTop: 'auto',
        paddingTop: '30px'
      }}
    >
      <Skeleton height={40} width={120} radius="md" />
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
        <Alert 
          color="red" 
          title="Patient Not Found"
          onClose={clearError}
          withCloseButton
        >
          {error || `The patient with ID "${id}" could not be found.`}
        </Alert>
        <Button 
          leftSection={<IconArrowLeft size={16} />}
          onClick={handleGoBack}
          style={{
            marginTop: '20px',
            background: theme.colors.blue[7],
            color: 'white'
          }}
        >
          Go Back to Patients
        </Button>
      </MedicalClinicLayout>
    );
  }

  return (
    <MedicalClinicLayout>
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
          <CustomTabButton
            isActive={activeTab === 'medical-records'}
            icon="fas fa-notes-medical"
            onClick={() => handleTabChange('medical-records')}
          >
            Medical Records
          </CustomTabButton>
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
          {activeTab === 'medical-records' && <PlaceholderTab title="Medical Records" />}
          {activeTab === 'appointments' && <AppointmentsTab appointments={patient.appointments || []} />}
          {activeTab === 'prescriptions' && <PlaceholderTab title="Prescriptions" />}
          {activeTab === 'laboratories' && <PlaceholderTab title="Laboratory Requests" />}
        </Box>

        {/* Go Back Button - At the very bottom of main content */}
        <Box
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: 'auto',
            paddingTop: '30px'
          }}
        >
          <Button
            leftSection={<IconArrowLeft size={16} />}
            onClick={handleGoBack}
            style={{
              padding: '12px 24px',
              background: theme.colors.blue[7],
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'background-color 0.3s ease',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = theme.colors.blue[8];
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = theme.colors.blue[7];
            }}
          >
            Go Back
          </Button>
        </Box>
    </MedicalClinicLayout>
  );
};