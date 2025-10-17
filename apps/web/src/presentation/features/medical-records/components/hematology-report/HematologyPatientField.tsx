import React from 'react';
import { Box, Text } from '@mantine/core';
import { getReportStyles } from '../../utils/serologyReportStyles';

interface HematologyPatientFieldProps {
  label: string;
  value: string;
}

export const HematologyPatientField: React.FC<HematologyPatientFieldProps> = ({ label, value }) => {
  const styles = getReportStyles();

  return (
    <Box style={styles.patientInfoField}>
      <Text style={styles.patientLabel}>{label}</Text>
      <Box style={styles.patientValue}>{value}</Box>
    </Box>
  );
};
