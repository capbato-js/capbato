import React from 'react';
import { Box } from '@mantine/core';

interface LoadingStateProps {
  message: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ message }) => {
  return (
    <Box style={{ textAlign: 'center', padding: '50px' }}>
      {message}
    </Box>
  );
};