import React from 'react';
import { Box, Text, Group, Button } from '@mantine/core';
import { COMMON_MEDICATIONS } from '../config/prescriptionConfig';
import { addCommonMedication } from '../utils/prescriptionFormUtils';

interface CommonMedicationsQuickAddProps {
  onAddMedication: (medication: any) => void;
}

export const CommonMedicationsQuickAdd: React.FC<CommonMedicationsQuickAddProps> = ({
  onAddMedication,
}) => {
  const handleAddCommonMedication = (medicationName: string) => {
    addCommonMedication(medicationName, onAddMedication);
  };

  return (
    <Box mb="md">
      <Text size="sm" c="dimmed" mb="xs">Quick add common medications:</Text>
      <Group gap="xs">
        {COMMON_MEDICATIONS.slice(0, 4).map((medication) => (
          <Button
            key={medication.name}
            variant="light"
            size="compact-xs"
            onClick={() => handleAddCommonMedication(medication.name)}
          >
            {medication.name}
          </Button>
        ))}
      </Group>
    </Box>
  );
};