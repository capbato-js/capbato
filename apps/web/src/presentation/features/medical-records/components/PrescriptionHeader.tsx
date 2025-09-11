import React from 'react';
import { Group, Badge, Box, Text, Paper } from '@mantine/core';
import { Icon } from '../../../components/common';
import { formatPrescriptionDate } from '../utils/viewPrescriptionUtils';

interface PrescriptionHeaderProps {
  patientName: string;
  patientNumber: string;
  doctor: string;
  datePrescribed: string;
}

export const PrescriptionHeader: React.FC<PrescriptionHeaderProps> = ({
  patientName,
  patientNumber,
  doctor,
  datePrescribed,
}) => {
  return (
    <Paper p="md" style={{ backgroundColor: '#f8f9fa' }}>
      <Group justify="space-between" align="flex-start">
        <Box>
          <Group gap="xs" align="center" mb="xs">
            <Icon icon="fas fa-user" />
            <Text fw={600} size="lg">{patientName}</Text>
            <Badge variant="light" color="blue">
              {patientNumber}
            </Badge>
          </Group>
          <Group gap="xs" align="center">
            <Icon icon="fas fa-user-md" />
            <Text c="dimmed">{doctor}</Text>
          </Group>
        </Box>
        <Box ta="right">
          <Group gap="xs" align="center" justify="flex-end" mb="xs">
            <Icon icon="fas fa-calendar" />
            <Text fw={500}>Date Prescribed</Text>
          </Group>
          <Text size="lg" fw={600}>
            {formatPrescriptionDate(datePrescribed)}
          </Text>
        </Box>
      </Group>
    </Paper>
  );
};