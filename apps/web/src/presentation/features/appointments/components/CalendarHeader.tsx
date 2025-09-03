import React from 'react';
import { Box, Title, useMantineTheme } from '@mantine/core';
import { CALENDAR_STYLES } from '../config/calendarConfig';

interface CalendarHeaderProps {
  title?: string;
}

export const CalendarHeader: React.FC<CalendarHeaderProps> = ({ 
  title = "Appointments Calendar" 
}) => {
  const theme = useMantineTheme();

  return (
    <Box style={{ marginBottom: '20px' }}>
      <Title
        order={2}
        style={{
          ...CALENDAR_STYLES.TITLE,
          color: theme.colors.blue[9]
        }}
      >
        {title}
      </Title>
    </Box>
  );
};