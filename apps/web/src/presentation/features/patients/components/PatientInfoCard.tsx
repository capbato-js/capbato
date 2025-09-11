import React from 'react';
import { Box, Text, useMantineTheme } from '@mantine/core';

interface PatientInfoCardProps {
  title: string;
  children: React.ReactNode;
}

export const PatientInfoCard: React.FC<PatientInfoCardProps> = ({ title, children }) => {
  const theme = useMantineTheme();
  
  return (
    <Box
      style={{
        background: 'transparent',
        padding: 0,
        borderRadius: 0,
        border: 'none',
        boxShadow: 'none',
        textAlign: 'left'
      }}
    >
      <Text
        style={{
          marginBottom: '20px',
          color: theme.colors.blue[9],
          fontSize: '20px',
          fontWeight: 'bold',
          borderBottom: `2px solid ${theme.colors.blue[9]}`,
          paddingBottom: '8px'
        }}
      >
        {title}
      </Text>
      {children}
    </Box>
  );
};