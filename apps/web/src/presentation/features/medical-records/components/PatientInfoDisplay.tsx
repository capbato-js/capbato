import React from 'react';
import { Text } from '@mantine/core';

interface PatientInfoDisplayProps {
  patientNumber: string;
}

export const PatientInfoDisplay: React.FC<PatientInfoDisplayProps> = ({
  patientNumber,
}) => {
  if (!patientNumber) {
    return null;
  }

  return (
    <Text size="sm" c="dimmed" mt={4}>
      Patient Number: {patientNumber}
    </Text>
  );
};