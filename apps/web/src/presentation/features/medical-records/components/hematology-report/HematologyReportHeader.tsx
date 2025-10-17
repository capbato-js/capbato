import React from 'react';
import { Box, Text } from '@mantine/core';
import { LAB_INFO, SECTION_TITLE } from '../../config/hematologyReportConfig';
import { getReportStyles } from '../../utils/urinalysisReportStyles'; // Use urinalysis styles for consistency

export const HematologyReportHeader: React.FC = () => {
  const styles = getReportStyles();

  return (
    <Box style={styles.headerContainer}>
      <Text style={styles.labTitle}>
        {LAB_INFO.name}
      </Text>
      <Text style={styles.labInfo}>
        {LAB_INFO.address}
      </Text>
      <Text style={styles.labInfo}>
        {LAB_INFO.phone}
      </Text>
      <Text style={styles.licenseInfo}>
        {LAB_INFO.license}
      </Text>
      <Text style={styles.reportTitle}>
        {SECTION_TITLE}
      </Text>
    </Box>
  );
};
