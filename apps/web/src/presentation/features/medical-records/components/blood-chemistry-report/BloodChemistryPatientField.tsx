import React from 'react';
import { Box, Text } from '@mantine/core';

interface BloodChemistryPatientFieldProps {
  label: string;
  value?: string;
  underlineWidth?: string;
  labelWidth?: string;
  extraStyle?: any;
}

export const BloodChemistryPatientField: React.FC<BloodChemistryPatientFieldProps> = ({
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
      // justifyContent: 'space-between',
      marginBottom: '8px',
      flex: 1,
      ...extraStyle
    }}>
      {/* Label */}
      <Text style={{
        fontWeight: 'bold',
        fontSize: '14px',
        marginRight: '15px', // Consistent spacing between label and field
        minWidth: labelWidth, // Dynamic label width
        whiteSpace: 'nowrap' // Prevent text wrapping
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