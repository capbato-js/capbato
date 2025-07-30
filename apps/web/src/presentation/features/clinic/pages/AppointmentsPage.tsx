import React from 'react';
import { Box, Title, Text, Button, Group } from '@mantine/core';
import { IconCalendarPlus } from '@tabler/icons-react';
import { MedicalClinicLayout } from '../../../components/layout';

export const AppointmentsPage: React.FC = () => {
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
              Appointments
            </Title>
          </Box>
          <Button
            leftSection={<IconCalendarPlus size={16} />}
            style={{
              background: 'linear-gradient(45deg, #4db6ac, #26a69a)',
              border: 'none',
              borderRadius: '10px',
              fontSize: '14px',
              fontWeight: 'bold',
              padding: '12px 25px',
              boxShadow: '0 4px 15px rgba(77, 182, 172, 0.3)',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(77, 182, 172, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(77, 182, 172, 0.3)';
            }}
          >
            Add Appointment
          </Button>
        </Group>

        <Box style={{ textAlign: 'center', marginTop: '50px' }}>
          <Text size="lg" c="dimmed">
            Appointments content will be implemented here
          </Text>
        </Box>
      </Box>
    </MedicalClinicLayout>
  );
};
