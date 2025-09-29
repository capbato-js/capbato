import React from 'react';
import { Box, Text, TextInput, Textarea } from '@mantine/core';
import { getReportStyles } from '../../utils/ecgReportStyles';

export type FieldSize = 'small' | 'medium' | 'large' | 'xlarge' | 'full' | 'interpretation';

interface EcgReportFieldProps {
  label: string;
  value?: string;
  size?: FieldSize;
  referenceValue?: string;
  labelWidth?: 'normal' | 'wide';
  flex?: number;
  editable?: boolean;
  enabledFields?: string[];
  onChange?: (value: string) => void;
  error?: string;
  name?: string;
  isTextarea?: boolean;
}

export const EcgReportField: React.FC<EcgReportFieldProps> = ({
  label,
  value,
  size = 'large',
  referenceValue,
  labelWidth = 'normal',
  flex = 1,
  editable = false,
  enabledFields = [],
  onChange,
  error,
  name,
  isTextarea = false,
}) => {
  const styles = getReportStyles(editable);

  // Determine if this field should be enabled based on enabledFields
  const isFieldEnabled = (): boolean => {
    // If not in editable mode, field is effectively disabled for editing
    if (!editable) return false;

    // If no enabledFields specified, enable all fields
    if (!enabledFields || enabledFields.length === 0) return true;

    // Check if this field is in the enabled list
    const fieldName = name || '';
    return enabledFields.some(enabledField => {
      const normalizedEnabledField = enabledField.toLowerCase().trim();
      const normalizedFieldName = fieldName.toLowerCase().trim();
      const normalizedFieldLabel = label.toLowerCase().trim();

      // Match by field name, label, or bidirectional partial matching
      return normalizedEnabledField === normalizedFieldName ||
             normalizedEnabledField === normalizedFieldLabel ||
             normalizedFieldLabel.includes(normalizedEnabledField) ||
             normalizedFieldName.includes(normalizedEnabledField) ||
             normalizedEnabledField.includes(normalizedFieldLabel) ||
             normalizedEnabledField.includes(normalizedFieldName);
    });
  };

  const fieldEnabled = isFieldEnabled();

  const getInputStyle = () => {
    switch (size) {
      case 'small': return styles.fieldInputSmall;
      case 'medium': return styles.fieldInputMedium;
      case 'large': return styles.fieldInputLarge;
      case 'xlarge': return styles.fieldInputXLarge;
      case 'full': return styles.fieldInputFull;
      case 'interpretation': return styles.fieldInputInterpretation;
      default: return styles.fieldInputLarge;
    }
  };

  const getLabelStyle = () => {
    return labelWidth === 'wide' ? styles.fieldLabelWide : styles.fieldLabel;
  };

  const isInterpretation = isTextarea;

  return (
    <Box style={{
      ...styles.fieldContainer,
      flex,
      flexDirection: isInterpretation ? 'column' : 'row',
      alignItems: isInterpretation ? 'flex-start' : 'center'
    }}>
      <Text style={{
        ...getLabelStyle(),
        marginBottom: isInterpretation ? '0' : getLabelStyle().marginBottom,
        marginRight: isInterpretation ? '0' : 'auto',
      }}>
        {label}
      </Text>
      {editable ? (
        isTextarea ? (
          <Textarea
            value={value || ''}
            onChange={(event) => fieldEnabled ? onChange?.(event.currentTarget.value) : undefined}
            style={getInputStyle()}
            styles={{
              input: {
                ...getInputStyle(),
                border: error ? '1px solid red' : (fieldEnabled ? '1px solid #007bff' : '1px solid #e9ecef'),
                backgroundColor: fieldEnabled ? 'white' : '#f5f5f5',
                color: fieldEnabled ? 'inherit' : '#999',
                cursor: fieldEnabled ? 'text' : 'not-allowed',
                opacity: fieldEnabled ? 1 : 0.6,
                fontSize: '15px',
                resize: 'vertical'
              }
            }}
            name={name}
            error={error}
            disabled={!fieldEnabled}
            minRows={1}
            autosize
          />
        ) : (
          <TextInput
            value={value || ''}
            onChange={(event) => fieldEnabled ? onChange?.(event.currentTarget.value) : undefined}
            style={getInputStyle()}
            styles={{
              input: {
                ...getInputStyle(),
                border: error ? '1px solid red' : (fieldEnabled ? '1px solid #007bff' : '1px solid #e9ecef'),
                backgroundColor: fieldEnabled ? 'white' : '#f5f5f5',
                color: fieldEnabled ? 'inherit' : '#999',
                cursor: fieldEnabled ? 'text' : 'not-allowed',
                opacity: fieldEnabled ? 1 : 0.6,
                fontSize: '15px',
              }
            }}
            name={name}
            error={error}
            disabled={!fieldEnabled}
            size='xs'
          />
        )
      ) : (
        <Text style={getInputStyle()}>
          {value || ''}
        </Text>
      )}
      {referenceValue && (
        <Text style={styles.referenceValue}>
          {referenceValue}
        </Text>
      )}
    </Box>
  );
};