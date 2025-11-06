import React from 'react';
import { Box, Text } from '@mantine/core';
import { UseFormRegister, Control, useWatch } from 'react-hook-form';
import { LabTestFieldConfig } from '../constants/labTestFormConfig';
import { useFieldRendering } from '../hooks/useFieldRendering';
import type { AddLabTestResultFormData } from '../hooks/useLabTestResultFormState';
import { getInputBackgroundColor } from '../utils/labTestRangeValidator';
import classes from '../components/AddLabTestResultForm.module.css';

interface LabTestFieldProps {
  field: LabTestFieldConfig;
  register: UseFormRegister<AddLabTestResultFormData>;
  control: Control<AddLabTestResultFormData>;
  enabledFields?: string[];
  viewMode: boolean;
}

export const LabTestField: React.FC<LabTestFieldProps> = ({
  field,
  register,
  control,
  enabledFields,
  viewMode,
}) => {
  const { isFieldEnabled, getFieldStyles } = useFieldRendering({ enabledFields, viewMode });
  const enabled = isFieldEnabled(field);
  const styles = getFieldStyles(enabled);

  // Watch the field value to determine background color based on range
  const fieldValue = useWatch({
    control,
    name: field.id,
  });

  // Get background color based on value and normal range
  const backgroundColor = getInputBackgroundColor(fieldValue, field.normalRange);

  return (
    <Box
      key={field.id}
      component="label"
      style={styles.container}
    >
      <Text size="sm" fw={500} style={styles.label}>
        {field.label}
      </Text>
      <input
        {...register(field.id)}
        type="text"
        className={classes.nativeInput}
        disabled={viewMode || !enabled}
        readOnly={viewMode}
        style={{
          ...styles.input,
          backgroundColor: backgroundColor !== 'transparent' ? backgroundColor : styles.input?.backgroundColor,
        }}
      />
      <Text size="sm" style={styles.normalRange}>
        {field.normalRange ? ` ${field.normalRange} ` : ''}
      </Text>
    </Box>
  );
};