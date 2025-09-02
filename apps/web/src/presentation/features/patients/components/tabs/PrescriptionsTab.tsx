import React from 'react';
import { Box, Text, Alert, Skeleton, useMantineTheme } from '@mantine/core';
import { usePatientPrescriptions } from '../../view-models';
import { PrescriptionsTable } from '../../components';

interface PrescriptionsTabProps {
  patientId: string;
}

export const PrescriptionsTab: React.FC<PrescriptionsTabProps> = ({ patientId }) => {
  const theme = useMantineTheme();
  const { prescriptions, isLoading, error } = usePatientPrescriptions(patientId);

  const titleStyle = {
    color: theme.colors.blue[9],
    fontSize: '20px',
    fontWeight: 'bold',
    marginBottom: '20px',
    marginTop: 0,
    borderBottom: `2px solid ${theme.colors.blue[9]}`,
    paddingBottom: '8px'
  };

  if (isLoading) {
    return (
      <Box style={{ padding: '0 20px' }}>
        <Text style={titleStyle}>
          Prescriptions
        </Text>
        <Skeleton height={200} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box style={{ padding: '0 20px' }}>
        <Text style={titleStyle}>
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
      <Text style={titleStyle}>
        Prescriptions
      </Text>
      <PrescriptionsTable prescriptions={prescriptions} />
    </Box>
  );
};