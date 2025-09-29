import React from 'react';
import { Box, Title, Text } from '@mantine/core';
import { LAB_INFO } from '../../config/ecgReportConfig';
import { getReportStyles } from '../../utils/ecgReportStyles';

export const EcgReportHeader: React.FC = () => {
  const styles = getReportStyles();

  return (
    <Box style={styles.headerContainer}>
      <Title
        order={2}
        size="h3"
        style={styles.labTitle}
      >
        {LAB_INFO.name}
      </Title>
      <Text size="sm" style={styles.labInfo}>
        {LAB_INFO.address}
      </Text>
      <Text size="sm" style={styles.labInfo}>
        {LAB_INFO.phone}
      </Text>
      <Text
        size="sm"
        fw={700}
        style={styles.licenseInfo}
      >
        {LAB_INFO.license}
      </Text>
      <Title
        order={3}
        style={styles.reportTitle}
      >
        {LAB_INFO.reportTitle}
      </Title>
    </Box>
  );
};