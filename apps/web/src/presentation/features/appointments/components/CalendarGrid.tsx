import React from 'react';
import { Box } from '@mantine/core';
import { Appointment } from '../types';
import { CalendarDayCell } from './CalendarDayCell';
import { CALENDAR_STYLES } from '../config/calendarConfig';

interface CalendarGridProps {
  calendarDays: (number | null)[];
  getDayAppointments: (day: number) => Appointment[];
  isDaySelected: (day: number) => boolean;
  onDayClick: (day: number) => void;
}

export const CalendarGrid: React.FC<CalendarGridProps> = ({
  calendarDays,
  getDayAppointments,
  isDaySelected,
  onDayClick
}) => {
  return (
    <Box style={CALENDAR_STYLES.CALENDAR_GRID}>
      {calendarDays.map((day, index) => {
        if (day === null) {
          return (
            <Box
              key={`empty-${index}`}
              style={CALENDAR_STYLES.EMPTY_CELL}
            />
          );
        }

        const dayAppointments = getDayAppointments(day);
        const isSelected = isDaySelected(day);
        
        return (
          <CalendarDayCell
            key={day}
            day={day}
            appointments={dayAppointments}
            isSelected={isSelected}
            onClick={() => onDayClick(day)}
          />
        );
      })}
    </Box>
  );
};