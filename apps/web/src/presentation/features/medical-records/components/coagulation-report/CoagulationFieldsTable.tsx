import React from 'react';
import { Box, Text, TextInput } from '@mantine/core';
import { PT_FIELDS, PTT_FIELDS, REFERENCE_VALUES, SECTION_TITLES, TABLE_HEADERS, STATIC_NOTES } from '../../config/coagulationReportConfig';
import { getReportStyles } from '../../utils/serologyReportStyles';

interface CoagulationFieldsTableProps {
  labData?: Record<string, string | undefined>;
  formatValue: (value?: string) => string;
  editable?: boolean;
  enabledFields?: string[];
  onChange?: (field: string, value: string) => void;
  errors?: Record<string, string>;
}

export const CoagulationFieldsTable: React.FC<CoagulationFieldsTableProps> = ({
  labData,
  formatValue,
  editable = false,
  enabledFields = [],
  onChange,
  errors = {},
}) => {
  const styles = getReportStyles(editable);

  const ptFields = [
    { key: 'patientPt', label: PT_FIELDS.patientPt, reference: REFERENCE_VALUES.patientPt },
    { key: 'controlPt', label: PT_FIELDS.controlPt, reference: REFERENCE_VALUES.controlPt },
    { key: 'inr', label: PT_FIELDS.inr, reference: REFERENCE_VALUES.inr },
    { key: 'activityPercent', label: PT_FIELDS.activityPercent, reference: REFERENCE_VALUES.activityPercent },
  ];

  const pttFields = [
    { key: 'patientPtt', label: PTT_FIELDS.patientPtt, reference: REFERENCE_VALUES.patientPtt },
    { key: 'controlPtt', label: PTT_FIELDS.controlPtt, reference: REFERENCE_VALUES.controlPtt },
  ];

  const renderTable = (title: string, fields: typeof ptFields) => (
    <Box style={{ marginBottom: '20px' }}>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={{...styles.tableHeader, width: '40%', color: 'red' }}>{title}</th>
            <th style={{...styles.tableHeader, width: '30%'}}>{TABLE_HEADERS.result}</th>
            <th style={{...styles.tableHeader, width: '30%'}}>{TABLE_HEADERS.normalValue}</th>
          </tr>
        </thead>
        <tbody>
          {fields.map((field) => (
            <tr key={field.key}>
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
              <td style={{...styles.tableCell, ...styles.referenceCell}}>
                {field.reference}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Box>
  );

  return (
    <Box style={styles.tableContainer}>
      {/* Prothrombin Time Table */}
      {renderTable(SECTION_TITLES.prothrombinTime, ptFields)}

      {/* Partial Thromboplastin Time Table */}
      {renderTable(SECTION_TITLES.partialThromboplastinTime, pttFields)}

      {/* Static Notes */}
      <Box style={{ marginTop: '30px' }}>
        <Text style={{ fontSize: '12px', color: 'red', fontWeight: 'bold' }}>
          NOTE:
        </Text>
        <Text style={{ fontSize: '12px', marginBottom: '10px' }}>
          {STATIC_NOTES.note}
        </Text>
        <Text style={{ fontSize: '12px', color: 'red', fontWeight: 'bold' }}>
          REMARKS:
        </Text>
        <Text style={{ fontSize: '12px' }}>
          {STATIC_NOTES.remarks}
        </Text>
      </Box>

      {/* Display validation errors */}
      {Object.keys(errors).length > 0 && (
        <Box style={{ marginTop: '10px' }}>
          {Object.entries(errors).map(([field, error]) => (
            <Text key={field} style={styles.errorText}>
              {field}: {error}
            </Text>
          ))}
        </Box>
      )}
    </Box>
  );
};
