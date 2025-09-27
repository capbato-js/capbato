import React from 'react';
import { Box, Text } from '@mantine/core';
import { ReportField } from './ReportField';
import { FIELD_LABELS, SECTION_TITLES } from '../../config/urinalysisReportConfig';
import { getReportStyles } from '../../utils/urinalysisReportStyles';

interface UrinalysisPhysicalPropertiesProps {
  labData?: Record<string, string | undefined>;
  formatValue: (value?: string) => string;
  editable?: boolean;
  enabledFields?: string[];
  onChange?: (field: string, value: string) => void;
  errors?: Record<string, string>;
}

export const UrinalysisPhysicalProperties: React.FC<UrinalysisPhysicalPropertiesProps> = ({
  labData,
  formatValue,
  editable = false,
  enabledFields = [],
  onChange,
  errors = {},
}) => {
  const styles = getReportStyles();

  return (
    <Box style={{...styles.sectionContainer, marginBottom: 0}}>
      <Text style={styles.sectionTitle}>
        {SECTION_TITLES.microscopicExamination}
      </Text>

      {/* Color and Transparency */}
      <Box style={styles.fieldRow}>
        <ReportField
          label={FIELD_LABELS.color}
          value={editable ? labData?.color || '' : formatValue(labData?.color)}
          size="large"
          editable={editable}
          enabledFields={enabledFields}
          onChange={(value) => onChange?.('color', value)}
          error={errors.color}
          name="color"
        />
        <ReportField
          label={FIELD_LABELS.transparency}
          value={editable ? labData?.transparency || '' : formatValue(labData?.transparency)}
          size="large"
          labelWidth="wide"
          editable={editable}
          enabledFields={enabledFields}
          onChange={(value) => onChange?.('transparency', value)}
          error={errors.transparency}
          name="transparency"
        />
      </Box>

      {/* Specific Gravity and pH */}
      <Box style={styles.fieldRow}>
        <ReportField
          label={FIELD_LABELS.specificGravity}
          value={editable ? labData?.specificGravity || '' : formatValue(labData?.specificGravity)}
          size="large"
          editable={editable}
          enabledFields={enabledFields}
          onChange={(value) => onChange?.('specificGravity', value)}
          error={errors.specificGravity}
          name="specificGravity"
        />
        <ReportField
          label={FIELD_LABELS.ph}
          value={editable ? labData?.ph || '' : formatValue(labData?.ph)}
          size="large"
          labelWidth="wide"
          editable={editable}
          enabledFields={enabledFields}
          onChange={(value) => onChange?.('ph', value)}
          error={errors.ph}
          name="ph"
        />
      </Box>

      {/* Protein and Glucose */}
      <Box style={styles.fieldRow}>
        <ReportField
          label={FIELD_LABELS.protein}
          value={editable ? labData?.protein || '' : formatValue(labData?.protein)}
          size="large"
          editable={editable}
          enabledFields={enabledFields}
          onChange={(value) => onChange?.('protein', value)}
          error={errors.protein}
          name="protein"
        />
        <ReportField
          label={FIELD_LABELS.glucose}
          value={editable ? labData?.glucose || '' : formatValue(labData?.glucose)}
          size="large"
          labelWidth="wide"
          editable={editable}
          enabledFields={enabledFields}
          onChange={(value) => onChange?.('glucose', value)}
          error={errors.glucose}
          name="glucose"
        />
      </Box>
    </Box>
  );
};