import React from 'react';
import { Appointment } from '../types';
import { AppointmentsCalendarContainer } from './AppointmentsCalendarContainer';

interface AppointmentsCalendarProps {
  appointments: Appointment[];
  onDateSelect?: (date: string) => void;
  selectedDate?: string;
}

export const AppointmentsCalendar: React.FC<AppointmentsCalendarProps> = (props) => {
  return <AppointmentsCalendarContainer {...props} />;
};
