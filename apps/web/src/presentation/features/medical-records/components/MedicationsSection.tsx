import React from 'react';
import { Stack, Group, Box, Text, Paper } from '@mantine/core';
import { Icon } from '../../../components/common';
import { MedicationCard } from './MedicationCard';
import { NormalizedMedication, hasMedicationDetails } from '../utils/viewPrescriptionUtils';

interface MedicationsSectionProps {
  medications: NormalizedMedication[];
}

export const MedicationsSection: React.FC<MedicationsSectionProps> = ({
  medications,
}) => {
  return (
    <Box>
      <Group gap="xs" align="center" mb="md">
        <Icon icon="fas fa-pills" />
        <Text fw={600} size="lg">Medications</Text>
      </Group>

      {hasMedicationDetails(medications) ? (
        <Stack gap="md">
          {medications.map((medication, index) => (
            <MedicationCard
              key={index}
              medication={medication}
              index={index}
            />
          ))}
        </Stack>
      ) : (
        <Paper p="md" withBorder>
          <Text c="dimmed" ta="center">
            No detailed medication information available
          </Text>
        </Paper>
      )}
    </Box>
  );
};