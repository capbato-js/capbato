import React from 'react';
import { Box, Text } from '@mantine/core';
import { getReportStyles } from '../../utils/serologyReportStyles';

interface SerologyPatientFieldProps {
  label: string;
  value: string;
}

export const SerologyPatientField: React.FC<SerologyPatientFieldProps> = ({
  label,
  value,
}) => {
  const styles = getReportStyles();

  return (
    <Box style={styles.patientInfoField}>
      <Text style={styles.patientLabel}>{label}</Text>
      <Box style={styles.patientValue}>{value}</Box>
    </Box>
  );
};