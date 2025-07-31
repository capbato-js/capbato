import React from 'react';
import { Text } from '@mantine/core';

interface AppointmentCountDisplayProps {
  count: number;
}

export const AppointmentCountDisplay: React.FC<AppointmentCountDisplayProps> = ({
  count
}) => {
  return (
    <Text
      style={{
        marginTop: '10px',
        fontWeight: 'bold',
        fontSize: '1rem'
      }}
    >
      Total Appointments: {count}
    </Text>
  );
};
