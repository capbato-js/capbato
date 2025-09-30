import React from 'react';
import { Box, Text } from '@mantine/core';
import { FIELD_LABELS, REFERENCE_VALUES, TABLE_HEADERS } from '../../config/serologyReportConfig';
import { SerologyReportField } from './SerologyReportField';
import { getReportStyles } from '../../utils/serologyReportStyles';

interface SerologyFieldsTableProps {
  labData?: Record<string, string | undefined>;
  formatValue: (value?: string) => string;
  editable?: boolean;
  enabledFields?: string[];
  onChange?: (field: string, value: string) => void;
  errors?: Record<string, string>;
}

export const SerologyFieldsTable: React.FC<SerologyFieldsTableProps> = ({
  labData,
  formatValue,
  editable = false,
  enabledFields = [],
  onChange,
  errors = {},
}) => {
  const styles = getReportStyles(editable);

  const serologyFields = [
    { key: 'ft3', label: FIELD_LABELS.ft3, reference: REFERENCE_VALUES.ft3 },
    { key: 'ft4', label: FIELD_LABELS.ft4, reference: REFERENCE_VALUES.ft4 },
    { key: 'tsh', label: FIELD_LABELS.tsh, reference: REFERENCE_VALUES.tsh },
  ];

  return (
    <Box style={styles.tableContainer}>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.tableHeader}>{TABLE_HEADERS.test}</th>
            <th style={styles.tableHeader}>{TABLE_HEADERS.result}</th>
            <th style={styles.tableHeader}>{TABLE_HEADERS.referenceRange}</th>
          </tr>
        </thead>
        <tbody>
          {serologyFields.map((field) => (
            <SerologyReportField
              key={field.key}
              fieldKey={field.key}
              label={field.label}
              value={editable ? labData?.[field.key] || '' : formatValue(labData?.[field.key])}
              referenceValue={field.reference}
              editable={editable}
              enabledFields={enabledFields}
              onChange={(value) => onChange?.(field.key, value)}
              error={errors[field.key]}
            />
          ))}
        </tbody>
      </table>

      {/* Display validation errors below table */}
      {Object.keys(errors).length > 0 && (
        <Box style={{ marginTop: '10px' }}>
          {Object.entries(errors).map(([field, error]) => (
            <Text key={field} style={styles.errorText}>
              {FIELD_LABELS[field as keyof typeof FIELD_LABELS]}: {error}
            </Text>
          ))}
        </Box>
      )}
    </Box>
  );
};