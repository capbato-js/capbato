import React from 'react';
import { Box, Text, TextInput } from '@mantine/core';
import { SIGNATURES } from '../../config/ecgReportConfig';
import { getReportStyles } from '../../utils/ecgReportStyles';

interface EcgSignaturesProps {
  labData?: Record<string, string | undefined>;
  editable?: boolean;
  enabledFields?: string[];
  onChange?: (field: string, value: string) => void;
  errors?: Record<string, string>;
}

export const EcgSignatures: React.FC<EcgSignaturesProps> = ({
  labData = {},
  editable = false,
  enabledFields = [],
  onChange,
  errors = {},
}) => {
  const styles = getReportStyles(editable);

  // Determine if this field should be enabled based on enabledFields
  const isFieldEnabled = (): boolean => {
    if (!editable) return false;
    if (!enabledFields || enabledFields.length === 0) return true;

    return enabledFields.some(enabledField => {
      const normalizedEnabledField = enabledField.toLowerCase().trim();
      return normalizedEnabledField === 'interpreter' ||
             normalizedEnabledField.includes('interpreter') ||
             'interpreter'.includes(normalizedEnabledField);
    });
  };

  const fieldEnabled = isFieldEnabled();

  const handleFieldChange = (value: string) => {
    if (fieldEnabled) {
      onChange?.('interpreter', value);
    }
  };

  return (
    <Box style={styles.signatureContainer}>
      <Box style={styles.signatureBox}>
        {editable ? (
          <>
            <TextInput
              value={labData.interpreter || ''}
              onChange={(event) => handleFieldChange(event.currentTarget.value)}
              styles={{
                input: {
                  border: errors.interpreter ? '1px solid red' : (fieldEnabled ? '1px solid #007bff' : '1px solid #e9ecef'),
                  backgroundColor: fieldEnabled ? 'white' : '#f5f5f5',
                  textAlign: 'center',
                  fontSize: '15px',
                  fontWeight: 'bold',
                  minWidth: '200px',
                  color: fieldEnabled ? 'inherit' : '#999',
                  cursor: fieldEnabled ? 'text' : 'not-allowed',
                  opacity: fieldEnabled ? 1 : 0.6,
                }
              }}
              error={errors.interpreter}
              disabled={!fieldEnabled}
              size='xs'
            />
            <Text style={styles.signatureTitle}>
              {SIGNATURES.interpreter.title}
            </Text>
          </>
        ) : (
          <>
            <Text style={styles.signatureName}>
              {labData.interpreter || SIGNATURES.interpreter.name}
            </Text>
            <Text style={styles.signatureTitle}>
              {SIGNATURES.interpreter.title}
            </Text>
          </>
        )}
      </Box>
    </Box>
  );
};