import React from 'react';
import { Box } from '@mantine/core';
import { CALENDAR_CONSTANTS, CALENDAR_STYLES, CALENDAR_COLORS } from '../config/calendarConfig';

export const CalendarDaysHeader: React.FC = () => {
  return (
    <Box
      style={{
        ...CALENDAR_STYLES.HEADER_GRID,
        color: CALENDAR_COLORS.PRIMARY
      }}
    >
      {CALENDAR_CONSTANTS.DAYS.map((day, index) => (
        <Box
          key={day}
          style={{
            ...CALENDAR_STYLES.HEADER_CELL,
            borderRight: index < CALENDAR_CONSTANTS.DAYS.length - 1 
              ? `1px solid ${CALENDAR_COLORS.HEADER_BORDER}` 
              : 'none'
          }}
        >
          {day}
        </Box>
      ))}
    </Box>
  );
};