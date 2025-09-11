import React from 'react';
import { Appointment } from '../types';
import { useCalendarNavigation } from '../hooks/useCalendarNavigation';
import { useCalendarData } from '../hooks/useCalendarData';
import { AppointmentsCalendarPresenter } from './AppointmentsCalendarPresenter';

interface AppointmentsCalendarContainerProps {
  appointments: Appointment[];
  onDateSelect?: (date: string) => void;
  selectedDate?: string;
}

export const AppointmentsCalendarContainer: React.FC<AppointmentsCalendarContainerProps> = ({
  appointments,
  onDateSelect,
  selectedDate
}) => {
  // Calendar navigation state
  const {
    currentYear,
    currentMonth,
    goToPreviousMonth,
    goToNextMonth
  } = useCalendarNavigation();

  // Calendar data and interactions
  const {
    calendarGrid,
    monthYearDisplay,
    getDayAppointments,
    isDaySelected,
    handleDateClick
  } = useCalendarData({
    appointments,
    selectedDate,
    currentYear,
    currentMonth,
    onDateSelect
  });

  return (
    <AppointmentsCalendarPresenter
      calendarGrid={calendarGrid}
      monthYearDisplay={monthYearDisplay}
      getDayAppointments={getDayAppointments}
      isDaySelected={isDaySelected}
      onDayClick={handleDateClick}
      onPreviousMonth={goToPreviousMonth}
      onNextMonth={goToNextMonth}
    />
  );
};