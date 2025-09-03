import React from 'react';
import { Text } from '@mantine/core';

interface PatientNumberDisplayProps {
  patientNumber: string;
}

export const PatientNumberDisplay: React.FC<PatientNumberDisplayProps> = ({
  patientNumber
}) => {
  if (!patientNumber) return null;

  return (
    <Text size="sm" c="dimmed" mt={4}>
      Patient #: {patientNumber}
    </Text>
  );
};