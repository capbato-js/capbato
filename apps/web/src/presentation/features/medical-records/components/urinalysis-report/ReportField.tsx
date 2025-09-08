import React from 'react';
import { Box, Text } from '@mantine/core';
import { getReportStyles } from '../../utils/urinalysisReportStyles';

export type FieldSize = 'small' | 'medium' | 'large' | 'xlarge' | 'full';

interface ReportFieldProps {
  label: string;
  value?: string;
  size?: FieldSize;
  referenceValue?: string;
  labelWidth?: 'normal' | 'wide';
  flex?: number;
}

export const ReportField: React.FC<ReportFieldProps> = ({
  label,
  value,
  size = 'large',
  referenceValue,
  labelWidth = 'normal',
  flex = 1,
}) => {
  const styles = getReportStyles();
  
  const getInputStyle = () => {
    switch (size) {
      case 'small': return styles.fieldInputSmall;
      case 'medium': return styles.fieldInputMedium;
      case 'large': return styles.fieldInputLarge;
      case 'xlarge': return styles.fieldInputXLarge;
      case 'full': return styles.fieldInputFull;
      default: return styles.fieldInputLarge;
    }
  };
  
  const getLabelStyle = () => {
    return labelWidth === 'wide' ? styles.fieldLabelWide : styles.fieldLabel;
  };

  return (
    <Box style={{ ...styles.fieldContainer, flex }}>
      <Text style={getLabelStyle()}>
        {label}
      </Text>
      <Text style={getInputStyle()}>
        {value || ''}
      </Text>
      {referenceValue && (
        <Text style={styles.referenceValue}>
          {referenceValue}
        </Text>
      )}
    </Box>
  );
};