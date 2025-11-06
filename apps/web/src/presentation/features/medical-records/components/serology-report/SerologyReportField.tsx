import React from 'react';
import { TextInput } from '@mantine/core';
import { getReportStyles } from '../../utils/serologyReportStyles';
import { getInputBackgroundColor } from '../../utils/labTestRangeValidator';

interface SerologyReportFieldProps {
  fieldKey: string;
  label: string;
  value: string;
  referenceValue: string;
  editable?: boolean;
  enabledFields?: string[];
  onChange?: (value: string) => void;
  error?: string;
}

export const SerologyReportField: React.FC<SerologyReportFieldProps> = ({
  fieldKey,
  label,
  value,
  referenceValue,
  editable = false,
  enabledFields = [],
  onChange,
  error,
}) => {
  const styles = getReportStyles(editable);
  const isFieldEnabled = enabledFields.includes(fieldKey);

  // Get background color based on value and reference range
  const backgroundColor = getInputBackgroundColor(value, referenceValue);

  return (
    <tr>
      <td style={{...styles.tableCell, ...styles.testNameCell}}>
        {label}
      </td>
      <td style={{
        ...styles.tableCell,
        ...styles.resultCell,
        backgroundColor: backgroundColor !== 'transparent' ? backgroundColor : (styles.resultCell as any)?.backgroundColor
      }}>
        {editable && isFieldEnabled ? (
          <TextInput
            value={value}
            onChange={(event) => onChange?.(event.currentTarget.value)}
            style={{
              ...styles.tableInput,
              backgroundColor: backgroundColor !== 'transparent' ? backgroundColor : 'transparent'
            }}
            styles={{
              input: {
                backgroundColor: backgroundColor !== 'transparent' ? backgroundColor : 'transparent',
                border: 'none'
              }
            }}
            error={error}
            variant="unstyled"
            size="sm"
          />
        ) : (
          <span style={{
            display: 'block',
            width: '100%',
            padding: '4px'
          }}>{value}</span>
        )}
      </td>
      <td style={{...styles.tableCell, ...styles.referenceCell}}>
        {referenceValue}
      </td>
    </tr>
  );
};