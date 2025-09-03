import { useMemo, useCallback } from 'react';
import { Appointment } from '../types';
import { 
  generateCalendarGrid, 
  getAppointmentsForDate, 
  isDateSelected, 
  formatDateString,
  getMonthYearDisplay 
} from '../utils/calendarUtils';

interface UseCalendarDataProps {
  appointments: Appointment[];
  selectedDate?: string;
  currentYear: number;
  currentMonth: number;
  onDateSelect?: (date: string) => void;
}

/**
 * Custom hook for managing calendar data and interactions
 */
export const useCalendarData = ({
  appointments,
  selectedDate,
  currentYear,
  currentMonth,
  onDateSelect
}: UseCalendarDataProps) => {
  // Generate calendar grid
  const calendarGrid = useMemo(() => 
    generateCalendarGrid(currentYear, currentMonth), 
    [currentYear, currentMonth]
  );

  // Month/year display
  const monthYearDisplay = useMemo(() => 
    getMonthYearDisplay(currentMonth, currentYear), 
    [currentMonth, currentYear]
  );

  // Get appointments for a specific day
  const getDayAppointments = useCallback((day: number) => 
    getAppointmentsForDate(appointments, currentYear, currentMonth, day),
    [appointments, currentYear, currentMonth]
  );

  // Check if a day is selected
  const isDaySelected = useCallback((day: number) => 
    isDateSelected(selectedDate, currentYear, currentMonth, day),
    [selectedDate, currentYear, currentMonth]
  );

  // Handle date click
  const handleDateClick = useCallback((day: number) => {
    if (onDateSelect) {
      const dateString = formatDateString(currentYear, currentMonth, day);
      onDateSelect(dateString);
    }
  }, [onDateSelect, currentYear, currentMonth]);

  return {
    calendarGrid,
    monthYearDisplay,
    getDayAppointments,
    isDaySelected,
    handleDateClick
  };
};