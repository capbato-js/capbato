import { useState, useCallback } from 'react';
import { getNavigationDate, getCalendarDateInfo } from '../utils/calendarUtils';

/**
 * Custom hook for managing calendar navigation state
 */
export const useCalendarNavigation = (initialDate: Date = new Date()) => {
  const [currentDate, setCurrentDate] = useState(initialDate);

  const dateInfo = getCalendarDateInfo(currentDate);

  const goToPreviousMonth = useCallback(() => {
    const newDate = getNavigationDate(dateInfo.year, dateInfo.month, -1);
    setCurrentDate(newDate);
  }, [dateInfo.year, dateInfo.month]);

  const goToNextMonth = useCallback(() => {
    const newDate = getNavigationDate(dateInfo.year, dateInfo.month, 1);
    setCurrentDate(newDate);
  }, [dateInfo.year, dateInfo.month]);

  const goToDate = useCallback((date: Date) => {
    setCurrentDate(date);
  }, []);

  const goToToday = useCallback(() => {
    setCurrentDate(new Date());
  }, []);

  return {
    currentDate,
    currentYear: dateInfo.year,
    currentMonth: dateInfo.month,
    dateInfo,
    goToPreviousMonth,
    goToNextMonth,
    goToDate,
    goToToday
  };
};