import React from 'react';
import { TextInput } from '@mantine/core';
import { getReportStyles } from '../../utils/serologyReportStyles';

interface DengueReportFieldProps {
  fieldKey: string;
  label: string;
  value: string;
  editable?: boolean;
  enabledFields?: string[];
  onChange?: (value: string) => void;
  error?: string;
}

export const DengueReportField: React.FC<DengueReportFieldProps> = ({
  fieldKey,
  label,
  value,
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
    </tr>
  );
};
