import React from 'react';
import { Box } from '@mantine/core';
import { BloodChemistryLabData } from '../../utils/bloodChemistryReportUtils';
import { getReportStyles } from '../../utils/bloodChemistryReportStyles';
import { FIELD_LABELS, REFERENCE_VALUES, RIGHT_COLUMN_FIELDS } from '../../config/bloodChemistryReportConfig';
import { BloodChemistryReportField } from './BloodChemistryReportField';

interface BloodChemistryRightFieldsProps {
  labData?: Record<string, string | undefined>;
  formatValue: (value?: string) => string;
  editable?: boolean;
  enabledFields?: string[];
  onChange?: (field: string, value: string) => void;
  errors?: Record<string, string>;
}

export const BloodChemistryRightFields: React.FC<BloodChemistryRightFieldsProps> = ({
  labData,
  formatValue,
  editable = false,
  enabledFields = [],
  onChange,
  errors = {},
}) => {
  const styles = getReportStyles();

  const handleFieldChange = (fieldName: string, value: string) => {
    onChange?.(fieldName, value);
  };

  return (
    <Box style={styles.columnContainer}>
      {RIGHT_COLUMN_FIELDS.map((fieldName) => (
        <BloodChemistryReportField
          key={fieldName}
          label={FIELD_LABELS[fieldName as keyof typeof FIELD_LABELS]}
          value={formatValue(labData?.[fieldName])}
          referenceValue={REFERENCE_VALUES[fieldName as keyof typeof REFERENCE_VALUES]}
          editable={editable}
          enabledFields={enabledFields}
          onChange={(value) => handleFieldChange(fieldName, value)}
          error={errors[fieldName]}
          name={fieldName}
        />
      ))}
    </Box>
  );
};