import React from 'react';
import { Box } from '@mantine/core';
import { Appointment } from '../types';
import { formatAppointmentDisplay } from '../utils/calendarUtils';
import { APPOINTMENT_STATUS_COLORS, CALENDAR_STYLES, AppointmentStatus } from '../config/calendarConfig';

interface AppointmentBadgeProps {
  appointment: Appointment;
}

export const AppointmentBadge: React.FC<AppointmentBadgeProps> = ({ appointment }) => {
  const statusColors = APPOINTMENT_STATUS_COLORS[appointment.status as AppointmentStatus] || 
                       APPOINTMENT_STATUS_COLORS.confirmed;

  return (
    <Box
      style={{
        ...CALENDAR_STYLES.APPOINTMENT_BADGE,
        backgroundColor: statusColors.background,
        color: statusColors.text
      }}
    >
      {formatAppointmentDisplay(appointment)}
    </Box>
  );
};