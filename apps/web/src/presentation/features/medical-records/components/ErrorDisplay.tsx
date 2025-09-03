import React from 'react';
import { Box, Text } from '@mantine/core';

interface ErrorDisplayProps {
  error: string | null;
}

const errorStyles = {
  color: 'red',
  marginTop: '10px',
  padding: '10px',
  backgroundColor: '#ffebee',
  borderRadius: '4px'
};

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error }) => {
  if (!error) return null;

  return (
    <Box style={errorStyles}>
      <Text size="sm">{error}</Text>
    </Box>
  );
};