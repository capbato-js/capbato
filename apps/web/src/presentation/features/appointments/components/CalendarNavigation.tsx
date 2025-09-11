import React from 'react';
import { Box, Button, useMantineTheme } from '@mantine/core';
import { Icon } from '../../../components/common';
import { CALENDAR_STYLES } from '../config/calendarConfig';

interface CalendarNavigationProps {
  monthYearDisplay: string;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
}

export const CalendarNavigation: React.FC<CalendarNavigationProps> = ({
  monthYearDisplay,
  onPreviousMonth,
  onNextMonth
}) => {
  const theme = useMantineTheme();

  return (
    <Box style={CALENDAR_STYLES.NAVIGATION}>
      <Button
        variant="light"
        onClick={onPreviousMonth}
        style={CALENDAR_STYLES.NAV_BUTTON}
      >
        <Icon icon="fas fa-chevron-left" />
      </Button>
      
      <Box
        style={{
          ...CALENDAR_STYLES.MONTH_YEAR,
          color: theme.colors.blue[7]
        }}
      >
        {monthYearDisplay}
      </Box>
      
      <Button
        variant="light"
        onClick={onNextMonth}
        style={CALENDAR_STYLES.NAV_BUTTON}
      >
        <Icon icon="fas fa-chevron-right" />
      </Button>
    </Box>
  );
};