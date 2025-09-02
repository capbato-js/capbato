import React from 'react';
import { Box, Text, Alert, Skeleton, useMantineTheme } from '@mantine/core';
import { usePatientAppointments } from '../../view-models';
import { BaseAppointmentsTable } from '../../../../components/common';

interface AppointmentsTabProps {
  patientId: string;
}

export const AppointmentsTab: React.FC<AppointmentsTabProps> = ({ patientId }) => {
  const theme = useMantineTheme();
  const { appointments, isLoading, error } = usePatientAppointments(patientId);

  const config = {
    showActions: false,
    showContactColumn: false,
    showDateColumn: true,
    showPatientColumns: false,
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