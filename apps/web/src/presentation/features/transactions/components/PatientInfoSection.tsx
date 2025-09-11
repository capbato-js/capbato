import React from 'react';
import { Box, Group, Text, Paper } from '@mantine/core';
import { Transaction } from '../types';
import { ICONS } from '../config/viewTransactionModalConfig';

interface PatientInfoSectionProps {
  patient: Transaction['patient'];
}

export const PatientInfoSection: React.FC<PatientInfoSectionProps> = ({ patient }) => {
  return (
    <Box>
      <Group gap="xs" align="center" mb="md">
        {ICONS.userCircle}
        <Text fw={600} size="lg">Patient Information</Text>
      </Group>
      <Paper p="md" withBorder>
        <Group gap="xl">
          <Box>
            <Text size="sm" c="dimmed" fw={500}>Patient Number</Text>
            <Text size="sm">{patient.patientNumber}</Text>
          </Box>
          <Box>
            <Text size="sm" c="dimmed" fw={500}>Full Name</Text>
            <Text size="sm">{patient.fullName}</Text>
          </Box>
        </Group>
      </Paper>
    </Box>
  );
};