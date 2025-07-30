import React from 'react';
import { Box, Title, Text, Button, Group } from '@mantine/core';
import { IconUserPlus } from '@tabler/icons-react';
import { MedicalClinicLayout } from '../../../components/layout';

export const PatientsPage: React.FC = () => {
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
        <Group justify="space-between" align="center" mb="xl">
          <Box style={{ flex: 1, textAlign: 'center' }}>
            <Title 
              order={1}
              style={{
                color: '#0b4f6c',
                fontSize: '28px',
                fontWeight: 'bold',
                margin: 0
              }}
            >
              Patients
            </Title>
          </Box>
          <Button
            leftSection={<IconUserPlus size={16} />}
            style={{
              backgroundColor: '#4db6ac',
              border: 'none',
              borderRadius: '10px',
              fontSize: '15px',
              fontWeight: 'bold',
              padding: '10px 20px',
              boxShadow: '0 4px 8px rgba(77, 182, 172, 0.3)',
              transition: 'background-color 0.3s ease, transform 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#3ba69c';
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#4db6ac';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            Add New Patient
          </Button>
        </Group>

        <Box style={{ textAlign: 'center', marginTop: '50px' }}>
          <Text size="lg" c="dimmed">
            Patients content will be implemented here
          </Text>
        </Box>
      </Box>
    </MedicalClinicLayout>
  );
};
