import React from 'react';
import { Box, Text, TextInput } from '@mantine/core';
import { getReportStyles } from '../../utils/urinalysisReportStyles'; // Reuse the urinalysis styles
import { getInputBackgroundColor } from '../../utils/labTestRangeValidator';

export type HematologyFieldSize = 'small' | 'medium' | 'large' | 'xlarge' | 'full';

interface HematologyReportFieldProps {
  label: string;
  value?: string;
  size?: HematologyFieldSize;
  referenceValue?: string;
  labelWidth?: 'normal' | 'wide';
  flex?: number;
  editable?: boolean;
  enabledFields?: string[];
  onChange?: (value: string) => void;
  error?: string;
  name?: string;
  showRadio?: boolean;
  radioName?: string;
  radioValue?: string;
  radioChecked?: boolean;
  onRadioChange?: (value: string) => void;
}

export const HematologyReportField: React.FC<HematologyReportFieldProps> = ({
  label,
  value,
  referenceValue,
  labelWidth = 'normal',
  flex = 1,
  editable = false,
  enabledFields = [],
  onChange,
  error,
  name,
  showRadio = false,
  radioName,
  radioValue,
  radioChecked = false,
  onRadioChange,
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

  const getLabelStyle = () => {
    return labelWidth === 'wide' ? styles.fieldLabelWide : styles.fieldLabel;
  };

  // Get background color based on value and reference range
  const backgroundColor = getInputBackgroundColor(value, referenceValue);

  return (
    <Box style={{ 
      display: 'flex', 
      alignItems: 'center', 
      marginBottom: '4px',
      flex 
    }}>
      {showRadio && editable && (
        <input
          type="radio"
          name={radioName}
          value={radioValue}
          checked={radioChecked}
          onChange={(e) => onRadioChange?.(e.target.value)}
          style={{ marginRight: '8px', cursor: 'pointer' }}
        />
      )}
      <Text style={{ 
        ...getLabelStyle(),
        minWidth: '80px',
        marginRight: '10px'
      }}>
        {label}
      </Text>
      {editable ? (
        <TextInput
          value={value || ''}
          onChange={(event) => fieldEnabled ? onChange?.(event.currentTarget.value) : undefined}
          style={{ 
            width: '120px',
            marginRight: '15px'
          }}
          styles={{
            input: {
              borderBottom: '1px solid black',
              borderTop: 'none',
              borderLeft: 'none',
              borderRight: 'none',
              borderRadius: '0',
              backgroundColor: backgroundColor !== 'transparent' ? backgroundColor : 'transparent',
              color: fieldEnabled ? 'inherit' : '#999',
              cursor: fieldEnabled ? 'text' : 'not-allowed',
              opacity: fieldEnabled ? 1 : 0.6,
              fontSize: '14px',
              paddingLeft: '2px',
              paddingRight: '2px',
              height: '20px'
            }
          }}
          name={name}
          error={error}
          disabled={!fieldEnabled || (showRadio && !radioChecked)}
          size='xs'
        />
      ) : (
        <Box style={{
          borderBottom: '1px solid black',
          minWidth: '120px',
          height: '20px',
          display: 'flex',
          alignItems: 'center',
          marginRight: '15px',
          paddingLeft: '2px',
          fontSize: '14px',
          backgroundColor: backgroundColor !== 'transparent' ? backgroundColor : 'transparent'
        }}>
          {value || ''}
        </Box>
      )}
      {referenceValue && (
        <Text style={{
          fontSize: '12px',
          color: '#333',
          whiteSpace: 'nowrap'
        }}>
          {referenceValue}
        </Text>
      )}
    </Box>
  );
};