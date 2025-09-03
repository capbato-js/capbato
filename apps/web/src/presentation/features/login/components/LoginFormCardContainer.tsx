import React from 'react';
import { Box } from '@mantine/core';
import { LoginForm } from './LoginForm';

const containerStyles = {
  display: 'flex',
  justifyContent: 'center' as const,
  alignItems: 'center' as const,
  minHeight: '100vh',
  padding: '20px'
};

const cardStyles = {
  width: '100%',
  maxWidth: '400px',
  backgroundColor: 'white',
  borderRadius: '12px',
  border: '1px solid #e5e5e5',
  padding: '40px 32px'
};

export const LoginFormCardContainer: React.FC = () => {
  return (
    <Box style={containerStyles}>
      <Box style={cardStyles}>
        <LoginForm />
      </Box>
    </Box>
  );
};