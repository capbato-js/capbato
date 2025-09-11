import React from 'react';
import { Box, Text, useMantineTheme } from '@mantine/core';

export const LaboratoriesTab: React.FC = () => {
  const theme = useMantineTheme();
  
  return (
    <Box style={{ padding: '0 20px' }}>
      <Text
        style={{
          color: theme.colors.blue[9],
          fontSize: '20px',
          fontWeight: 'bold',
          marginBottom: '20px',
          marginTop: 0,
          borderBottom: `2px solid ${theme.colors.blue[9]}`,
          paddingBottom: '8px'
        }}
      >
        Laboratory Requests
      </Text>
      <Text style={{ fontSize: '16px', color: '#666' }}>
        Laboratory functionality will be implemented in future iterations.
      </Text>
    </Box>
  );
};