import React from 'react';
import { Box, useMantineTheme } from '@mantine/core';
import { Appointment } from '../types';
import { AppointmentBadge } from './AppointmentBadge';
import { shouldShowMoreAppointments } from '../utils/calendarUtils';
import { 
  CALENDAR_STYLES, 
  CALENDAR_COLORS, 
  CALENDAR_CONSTANTS 
} from '../config/calendarConfig';

interface CalendarDayCellProps {
  day: number;
  appointments: Appointment[];
  isSelected: boolean;
  onClick: () => void;
}

export const CalendarDayCell: React.FC<CalendarDayCellProps> = ({
  day,
  appointments,
  isSelected,
  onClick
}) => {
  const theme = useMantineTheme();
  const { shouldShow: showMore, additionalCount } = shouldShowMoreAppointments(appointments.length);
  const visibleAppointments = appointments.slice(0, CALENDAR_CONSTANTS.MAX_VISIBLE_APPOINTMENTS);

  return (
    <Box
      onClick={onClick}
      style={{
        ...CALENDAR_STYLES.DAY_CELL_BASE,
        backgroundColor: isSelected ? CALENDAR_COLORS.DAY_CELL.SELECTED : CALENDAR_COLORS.DAY_CELL.DEFAULT,
        color: CALENDAR_COLORS.DAY_CELL.TEXT,
        boxShadow: isSelected ? CALENDAR_COLORS.DAY_CELL_SHADOW.SELECTED : CALENDAR_COLORS.DAY_CELL_SHADOW.DEFAULT,
        border: `2px solid ${isSelected ? CALENDAR_COLORS.DAY_CELL_BORDER.SELECTED : CALENDAR_COLORS.DAY_CELL_BORDER.DEFAULT}`
      }}
    >
      <Box style={CALENDAR_STYLES.DAY_NUMBER}>
        {day}
      </Box>
      
      {appointments.length > 0 && (
        <Box
          style={{
            ...CALENDAR_STYLES.APPOINTMENTS_CONTAINER,
            color: theme.colors.blue[7]
          }}
        >
          {visibleAppointments.map((appointment) => (
            <AppointmentBadge
              key={appointment.id}
              appointment={appointment}
            />
          ))}
          {showMore && (
            <Box
              style={{
                ...CALENDAR_STYLES.MORE_APPOINTMENTS,
                color: theme.colors.blue[9]
              }}
            >
              +{additionalCount} more
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};