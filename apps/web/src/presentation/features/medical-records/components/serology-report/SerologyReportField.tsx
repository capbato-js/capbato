import React from 'react';
import { TextInput } from '@mantine/core';
import { getReportStyles } from '../../utils/serologyReportStyles';

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

  return (
    <tr>
      <td style={{...styles.tableCell, ...styles.testNameCell}}>
        {label}
      </td>
      <td style={{...styles.tableCell, ...styles.resultCell}}>
        {editable && isFieldEnabled ? (
          <TextInput
            value={value}
            onChange={(event) => onChange?.(event.currentTarget.value)}
            style={styles.tableInput}
            error={error}
            variant="unstyled"
            size="sm"
          />
        ) : (
          <span>{value}</span>
        )}
      </td>
      <td style={{...styles.tableCell, ...styles.referenceCell}}>
        {referenceValue}
      </td>
    </tr>
  );
};