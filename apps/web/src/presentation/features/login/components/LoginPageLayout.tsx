import React from 'react';
import { Box } from '@mantine/core';

interface LoginPageLayoutProps {
  children: React.ReactNode;
}

const pageStyles = {
  minHeight: '100vh',
  backgroundColor: '#f8f9fa',
  fontFamily: 'Roboto, Arial, sans-serif'
};

export const LoginPageLayout: React.FC<LoginPageLayoutProps> = ({ children }) => {
  return (
    <Box
      style={pageStyles}
      data-testid="login-page"
    >
      {children}
    </Box>
  );
};