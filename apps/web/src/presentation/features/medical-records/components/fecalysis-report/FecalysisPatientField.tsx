import React from 'react';
import { Box, Text } from '@mantine/core';

interface FecalysisPatientFieldProps {
  label: string;
  value?: string;
  underlineWidth?: string;
  labelWidth?: string;
  extraStyle?: any;
}

export const FecalysisPatientField: React.FC<FecalysisPatientFieldProps> = ({
  label,
  value = '',
  underlineWidth = '200px',
  labelWidth = 'auto',
  extraStyle = {}
}) => {
  return (
    <Box style={{
      display: 'flex',
      alignItems: 'center',
      marginBottom: '8px',
      flex: 1,
      ...extraStyle
    }}>
      {/* Label */}
      <Text style={{
        fontWeight: 'bold',
        fontSize: '14px',
        marginRight: '15px',
        minWidth: labelWidth,
        whiteSpace: 'nowrap'
      }}>
        {label}
      </Text>

      {/* Underlined Field */}
      <Box style={{
        borderBottom: '1px solid #000',
        width: underlineWidth,
        textAlign: 'center',
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
    </Box>
  );
};