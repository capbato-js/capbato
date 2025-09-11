import React from 'react';
import { Stack, Group, Badge, Box, Text, Paper } from '@mantine/core';
import { NormalizedMedication, hasAdditionalMedicationInfo } from '../utils/viewPrescriptionUtils';

interface MedicationCardProps {
  medication: NormalizedMedication;
  index: number;
}

export const MedicationCard: React.FC<MedicationCardProps> = ({
  medication,
  index,
}) => {
  return (
    <Paper key={index} p="md" withBorder>
      <Stack gap="sm">
        <Group justify="space-between" align="flex-start">
          <Text fw={600} size="lg" c="blue">
            {medication.name}
          </Text>
          {medication.dosage && (
            <Badge variant="light" size="lg">
              {medication.dosage}
            </Badge>
          )}
        </Group>

        {hasAdditionalMedicationInfo(medication) && (
          <Group gap="xl">
            {medication.frequency && (
              <Box>
                <Text size="sm" c="dimmed" fw={500}>Frequency</Text>
                <Text size="sm">{medication.frequency}</Text>
              </Box>
            )}
            {medication.duration && (
              <Box>
                <Text size="sm" c="dimmed" fw={500}>Duration</Text>
                <Text size="sm">{medication.duration}</Text>
              </Box>
            )}
          </Group>
        )}

        {medication.instructions && (
          <Box>
            <Text size="sm" c="dimmed" fw={500}>Instructions</Text>
            <Text size="sm">{medication.instructions}</Text>
          </Box>
        )}
      </Stack>
    </Paper>
  );
};