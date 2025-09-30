import React from 'react';
import { Box, Text } from '@mantine/core';
import { SIGNATURES } from '../../config/serologyReportConfig';
import { getReportStyles } from '../../utils/serologyReportStyles';

export const SerologySignatures: React.FC = () => {
  const styles = getReportStyles();

  return (
    <Box style={styles.signatureContainer}>
      <Box style={styles.signatureBox}>
        <Text style={styles.signatureName}>
          {SIGNATURES.technologist.name}
        </Text>
        <br />
        <Text style={styles.signatureLicense}>
          {SIGNATURES.technologist.license}
        </Text>
        <br />
        <Text style={styles.signatureTitle}>
          {SIGNATURES.technologist.title}
        </Text>
      </Box>

      <Box style={styles.signatureBox}>
        <Text style={styles.signatureName}>
          {SIGNATURES.pathologist.name}
        </Text>
        <br />
        <Text style={styles.signatureLicense}>
          {SIGNATURES.pathologist.license}
        </Text>
        <br />
        <Text style={styles.signatureTitle}>
          {SIGNATURES.pathologist.title}
        </Text>
      </Box>
    </Box>
  );
};