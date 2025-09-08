import React from 'react';
import { Box, Text } from '@mantine/core';
import { ReportField } from './ReportField';
import { FIELD_LABELS, SECTION_TITLES } from '../../config/urinalysisReportConfig';
import { getReportStyles } from '../../utils/urinalysisReportStyles';

interface UrinalysisPhysicalPropertiesProps {
  labData?: Record<string, string | undefined>;
  formatValue: (value?: string) => string;
}

export const UrinalysisPhysicalProperties: React.FC<UrinalysisPhysicalPropertiesProps> = ({
  labData,
  formatValue,
}) => {
  const styles = getReportStyles();

  return (
    <Box style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>
        {SECTION_TITLES.microscopicExamination}
      </Text>

      {/* Color and Transparency */}
      <Box style={styles.fieldRow}>
        <ReportField
          label={FIELD_LABELS.color}
          value={formatValue(labData?.color)}
          size="large"
        />
        <ReportField
          label={FIELD_LABELS.transparency}
          value={formatValue(labData?.transparency)}
          size="large"
          labelWidth="wide"
        />
      </Box>

      {/* Specific Gravity and pH */}
      <Box style={styles.fieldRow}>
        <ReportField
          label={FIELD_LABELS.specificGravity}
          value={formatValue(labData?.specificGravity)}
          size="large"
        />
        <ReportField
          label={FIELD_LABELS.ph}
          value={formatValue(labData?.ph)}
          size="large"
          labelWidth="wide"
        />
      </Box>

      {/* Protein and Glucose */}
      <Box style={styles.fieldRow}>
        <ReportField
          label={FIELD_LABELS.protein}
          value={formatValue(labData?.protein)}
          size="large"
        />
        <ReportField
          label={FIELD_LABELS.glucose}
          value={formatValue(labData?.glucose)}
          size="large"
          labelWidth="wide"
        />
      </Box>
    </Box>
  );
};