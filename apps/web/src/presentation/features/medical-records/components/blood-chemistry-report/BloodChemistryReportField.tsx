import React from 'react';
import { Box, Text, TextInput } from '@mantine/core';

interface BloodChemistryReportFieldProps {
  label: string;
  value?: string;
  referenceValue?: string;
  editable?: boolean;
  enabledFields?: string[];
  onChange?: (value: string) => void;
  error?: string;
  name?: string;
}

export const BloodChemistryReportField: React.FC<BloodChemistryReportFieldProps> = ({
  label,
  value = '',
  referenceValue,
  editable = false,
  enabledFields = [],
  onChange,
  error,
  name = '',
}) => {
  const isFieldEnabled = (): boolean => {
    if (!editable) return false;
    if (!enabledFields || enabledFields.length === 0) return true;

    return enabledFields.some(enabledField => {
      const normalizedEnabledField = enabledField.toLowerCase().trim();
      const normalizedFieldName = name.toLowerCase().trim();
      const normalizedFieldLabel = label.toLowerCase().trim();

      return normalizedEnabledField === normalizedFieldName ||
             normalizedEnabledField === normalizedFieldLabel ||
             normalizedFieldName.includes(normalizedEnabledField) ||
             normalizedEnabledField.includes(normalizedFieldName) ||
             normalizedFieldLabel.includes(normalizedEnabledField) ||
             normalizedEnabledField.includes(normalizedFieldLabel);
    });
  };

  const fieldEnabled = isFieldEnabled();

  return (
    <Box style={{
      display: 'flex',
      alignItems: 'center',
      marginBottom: '8px',
      minHeight: '24px'
    }}>
      {/* Field Label */}
      <Text style={{
        fontWeight: 'bold',
        minWidth: '120px',
        marginRight: '10px',
        fontSize: '14px'
      }}>
        {label}
      </Text>

      {/* Value Field */}
      {editable ? (
        <TextInput
          value={value}
          onChange={(event) => fieldEnabled ? onChange?.(event.currentTarget.value) : undefined}
          style={{
            minWidth: '120px',
            marginRight: '10px'
          }}
          styles={{
            input: {
              border: error ? '1px solid red' : (fieldEnabled ? '1px solid #007bff' : '1px solid #e9ecef'),
              backgroundColor: fieldEnabled ? 'white' : '#f5f5f5',
              color: fieldEnabled ? 'inherit' : '#999',
              cursor: fieldEnabled ? 'text' : 'not-allowed',
              opacity: fieldEnabled ? 1 : 0.6,
              fontSize: '14px',
              textAlign: 'center',
              height: '24px',
              padding: '0 8px'
            }
          }}
          disabled={!fieldEnabled}
          size='xs'
          error={!!error}
        />
      ) : (
        <Box style={{
          borderBottom: '1px solid #000',
          minWidth: '120px',
          textAlign: 'center',
          marginRight: '10px',
          paddingBottom: '2px',
          height: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Text style={{ fontSize: '14px' }}>
            {value}
          </Text>
        </Box>
      )}

      {/* Reference Range */}
      <Text style={{
        fontSize: '12px',
        color: '#666',
        minWidth: '100px',
        flexShrink: 0
      }}>
        {referenceValue}
      </Text>
    </Box>
  );
};