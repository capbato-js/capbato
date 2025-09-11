import React from 'react';
import { Box, Grid, Text, Skeleton, useMantineTheme } from '@mantine/core';
import { CustomTabButton } from './CustomTabButton';
import { PatientInfoCard } from './PatientInfoCard';

interface PatientDetailsLoadingSkeletonProps {
  activeTab: string;
  onTabChange: (tabValue: string) => void;
}

export const PatientDetailsLoadingSkeleton: React.FC<PatientDetailsLoadingSkeletonProps> = ({ 
  activeTab, 
  onTabChange 
}) => {
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
        
        {(activeTab === 'medical-records' || activeTab === 'prescriptions' || activeTab === 'laboratories' || activeTab === 'appointments') && (
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
              {activeTab === 'prescriptions' ? 'Prescriptions' : 
               activeTab === 'appointments' ? 'Appointments' : 'Laboratory Requests'}
            </Text>
            <Skeleton height={200} />
          </Box>
        )}
      </Box>
    </>
  );
};