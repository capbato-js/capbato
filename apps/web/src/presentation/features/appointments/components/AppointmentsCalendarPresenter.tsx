import React from 'react';
import { Box } from '@mantine/core';
import { Appointment } from '../types';
import { CalendarHeader } from './CalendarHeader';
import { CalendarNavigation } from './CalendarNavigation';
import { CalendarDaysHeader } from './CalendarDaysHeader';
import { CalendarGrid } from './CalendarGrid';
import { CALENDAR_STYLES } from '../config/calendarConfig';

interface AppointmentsCalendarPresenterProps {
  calendarGrid: (number | null)[];
  monthYearDisplay: string;
  getDayAppointments: (day: number) => Appointment[];
  isDaySelected: (day: number) => boolean;
  onDayClick: (day: number) => void;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
}

export const AppointmentsCalendarPresenter: React.FC<AppointmentsCalendarPresenterProps> = ({
  calendarGrid,
  monthYearDisplay,
  getDayAppointments,
  isDaySelected,
  onDayClick,
  onPreviousMonth,
  onNextMonth
}) => {
  return (
    <Box style={CALENDAR_STYLES.CONTAINER}>
      <CalendarHeader />
      
      <CalendarNavigation
        monthYearDisplay={monthYearDisplay}
        onPreviousMonth={onPreviousMonth}
        onNextMonth={onNextMonth}
      />

      <CalendarDaysHeader />

      <CalendarGrid
        calendarDays={calendarGrid}
        getDayAppointments={getDayAppointments}
        isDaySelected={isDaySelected}
        onDayClick={onDayClick}
      />
    </Box>
  );
};