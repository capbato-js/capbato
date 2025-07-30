import React from 'react';
import { Box, Title, Text } from '@mantine/core';
import { MedicalClinicLayout } from '../../../components/layout';

export const DoctorsPage: React.FC = () => {
  return (
    <MedicalClinicLayout>
      <Box
        style={{
          background: 'white',
          borderRadius: '15px',
          padding: '30px',
          boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
          minHeight: 'calc(100vh - 140px)'
        }}
      >
        <Box style={{ textAlign: 'center', marginBottom: '25px' }}>
          <Title 
            order={1}
            style={{
              color: '#0b4f6c',
              fontSize: '28px',
              fontWeight: 'bold',
              margin: 0
            }}
          >
            Doctors
          </Title>
        </Box>

        <Box style={{ textAlign: 'center', marginTop: '50px' }}>
          <Text size="lg" c="dimmed">
            Doctors content will be implemented here
          </Text>
        </Box>
      </Box>
    </MedicalClinicLayout>
  );
};
