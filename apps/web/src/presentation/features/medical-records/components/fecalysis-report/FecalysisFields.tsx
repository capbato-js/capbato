import React from 'react';
import { Box, Text } from '@mantine/core';
import { FecalysisReportField } from './FecalysisReportField';
import { FIELD_LABELS, SECTION_TITLES, REFERENCE_VALUES } from '../../config/fecalysisReportConfig';
import { getReportStyles } from '../../utils/fecalysisReportStyles';

interface FecalysisFieldsProps {
  labData?: Record<string, string | undefined>;
  formatValue: (value?: string) => string;
  editable?: boolean;
  enabledFields?: string[];
  onChange?: (field: string, value: string) => void;
  errors?: Record<string, string>;
}

export const FecalysisFields: React.FC<FecalysisFieldsProps> = ({
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
        {SECTION_TITLES.macroscopicExamination}
      </Text>

      {/* Color and Consistency */}
      <Box style={styles.fieldRow}>
        <FecalysisReportField
          label={FIELD_LABELS.color}
          value={editable ? labData?.color || '' : formatValue(labData?.color)}
          size="full"
          editable={editable}
          enabledFields={enabledFields}
          onChange={(value) => onChange?.('color', value)}
          error={errors.color}
          name="color"
        />
      </Box>

      <Box style={styles.fieldRow}>
        <FecalysisReportField
          label={FIELD_LABELS.consistency}
          value={editable ? labData?.consistency || '' : formatValue(labData?.consistency)}
          size="full"
          editable={editable}
          enabledFields={enabledFields}
          onChange={(value) => onChange?.('consistency', value)}
          error={errors.consistency}
          name="consistency"
        />
      </Box>

      {/* RBC and WBC with reference values */}
      <Box style={styles.fieldRow}>
        <FecalysisReportField
          label={FIELD_LABELS.rbc}
          value={editable ? labData?.rbc || '' : formatValue(labData?.rbc)}
          size="xlarge"
          referenceValue={REFERENCE_VALUES.rbc}
          editable={editable}
          enabledFields={enabledFields}
          onChange={(value) => onChange?.('rbc', value)}
          error={errors.rbc}
          name="rbc"
        />
      </Box>

      <Box style={styles.fieldRow}>
        <FecalysisReportField
          label={FIELD_LABELS.wbc}
          value={editable ? labData?.wbc || '' : formatValue(labData?.wbc)}
          size="xlarge"
          referenceValue={REFERENCE_VALUES.wbc}
          editable={editable}
          enabledFields={enabledFields}
          onChange={(value) => onChange?.('wbc', value)}
          error={errors.wbc}
          name="wbc"
        />
      </Box>

      {/* Occult Blood and Urobilinogen */}
      <Box style={styles.fieldRow}>
        <FecalysisReportField
          label={FIELD_LABELS.occultBlood}
          value={editable ? labData?.occultBlood || '' : formatValue(labData?.occultBlood)}
          size="full"
          editable={editable}
          enabledFields={enabledFields}
          onChange={(value) => onChange?.('occultBlood', value)}
          error={errors.occultBlood}
          name="occultBlood"
        />
      </Box>

      <Box style={styles.fieldRow}>
        <FecalysisReportField
          label={FIELD_LABELS.urobilinogen}
          value={editable ? labData?.urobilinogen || '' : formatValue(labData?.urobilinogen)}
          size="full"
          editable={editable}
          enabledFields={enabledFields}
          onChange={(value) => onChange?.('urobilinogen', value)}
          error={errors.urobilinogen}
          name="urobilinogen"
        />
      </Box>

      {/* Others */}
      <Box style={styles.fieldRow}>
        <FecalysisReportField
          label={FIELD_LABELS.others}
          value={editable ? labData?.others || '' : formatValue(labData?.others)}
          size="full"
          editable={editable}
          enabledFields={enabledFields}
          onChange={(value) => onChange?.('others', value)}
          error={errors.others}
          name="others"
        />
      </Box>
    </Box>
  );
};