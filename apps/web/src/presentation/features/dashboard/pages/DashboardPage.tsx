import React from 'react';
import { Box, Title, Text } from '@mantine/core';
import { MedicalClinicLayout } from '../../../components/layout';

export const DashboardPage: React.FC = () => {
  return (
    <MedicalClinicLayout>
      {/* No boxing - content flows naturally */}
      <Box style={{ marginBottom: '32px' }}>
        <Title 
          order={1}
          style={{
            color: '#111827',
            fontSize: '24px',
            fontWeight: 700,
            margin: 0,
            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
          }}
        >
          Dashboard
        </Title>
        <Text 
          size="sm" 
          style={{ color: '#6b7280', marginTop: '4px' }}
        >
          Welcome to your medical clinic dashboard
        </Text>
      </Box>

      <Box style={{ textAlign: 'center', marginTop: '80px' }}>
        <Text size="lg" style={{ color: '#9ca3af' }}>
          Dashboard content will be implemented here
        </Text>
      </Box>
    </MedicalClinicLayout>
  );
};
