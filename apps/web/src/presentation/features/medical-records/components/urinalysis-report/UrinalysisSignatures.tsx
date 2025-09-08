import React from 'react';
import { Box, Text } from '@mantine/core';
import { SIGNATURES } from '../../config/urinalysisReportConfig';
import { getReportStyles } from '../../utils/urinalysisReportStyles';

export const UrinalysisSignatures: React.FC = () => {
  const styles = getReportStyles();

  return (
    <Box style={styles.signatureContainer}>
      <Box style={styles.signatureBox}>
        <Text style={styles.signatureName}>
          {SIGNATURES.medicalTechnologist.name}
        </Text>
        <Text style={styles.signatureTitle}>
          {SIGNATURES.medicalTechnologist.title}
        </Text>
      </Box>
      <Box style={styles.signatureBox}>
        <Text style={styles.signatureName}>
          {SIGNATURES.pathologist.name}
        </Text>
        <Text style={styles.signatureTitle}>
          {SIGNATURES.pathologist.title}
        </Text>
      </Box>
    </Box>
  );
};