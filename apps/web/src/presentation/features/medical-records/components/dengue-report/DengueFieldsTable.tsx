import React from 'react';
import { Box, Text, TextInput } from '@mantine/core';
import { FIELD_LABELS, SECTION_TITLES, TABLE_HEADERS } from '../../config/dengueReportConfig';
import { getReportStyles } from '../../utils/serologyReportStyles';

interface DengueFieldsTableProps {
  labData?: Record<string, string | undefined>;
  formatValue: (value?: string) => string;
  editable?: boolean;
  enabledFields?: string[];
  onChange?: (field: string, value: string) => void;
  errors?: Record<string, string>;
}

export const DengueFieldsTable: React.FC<DengueFieldsTableProps> = ({
  labData,
  formatValue,
  editable = false,
  enabledFields = [],
  onChange,
  errors = {},
}) => {
  const styles = getReportStyles(editable);

  const dengueFields = [
    { key: 'igg', label: FIELD_LABELS.igg },
    { key: 'igm', label: FIELD_LABELS.igm },
    { key: 'ns1', label: FIELD_LABELS.ns1 },
  ];

  return (
    <Box style={styles.tableContainer}>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={{...styles.tableHeader, width: '30%'}}>{TABLE_HEADERS.test}</th>
            <th style={{...styles.tableHeader, width: '40%'}}></th>
            <th style={{...styles.tableHeader, width: '30%'}}>{TABLE_HEADERS.result}</th>
          </tr>
        </thead>
        <tbody>
          {dengueFields.map((field, index) => (
            <tr key={field.key}>
              {index === 0 && (
                <td
                  style={{
                    ...styles.tableCell,
                    ...styles.testNameCell,
                    fontWeight: 'bold',
                    textAlign: 'center',
                    fontSize: '16px'
                  }}
                  rowSpan={dengueFields.length}
                >
                  {SECTION_TITLES.testName}
                </td>
              )}
              <td style={{...styles.tableCell, ...styles.testNameCell}}>
                {field.label}
              </td>
              <td style={{...styles.tableCell, ...styles.resultCell}}>
                {editable && enabledFields.includes(field.key) ? (
                  <TextInput
                    value={labData?.[field.key] || ''}
                    onChange={(event) => onChange?.(field.key, event.currentTarget.value)}
                    style={styles.tableInput}
                    error={errors[field.key]}
                    variant="unstyled"
                    size="sm"
                  />
                ) : (
                  <span>{editable ? labData?.[field.key] || '' : formatValue(labData?.[field.key])}</span>
                )}
              </td>
            </tr>
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
