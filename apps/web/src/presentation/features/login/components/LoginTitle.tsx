import React from 'react';
import { Title, useMantineTheme } from '@mantine/core';

export const LoginTitle: React.FC = () => {
  const theme = useMantineTheme();
  
  return (
    <Title order={2} ta="center" mb="lg" style={{ color: theme.other.titleColor }}>
      Login
    </Title>
  );
};