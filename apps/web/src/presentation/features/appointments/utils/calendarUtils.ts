import { Appointment } from '../types';
import { CALENDAR_CONSTANTS } from '../config/calendarConfig';

/**
 * Generates a date string in YYYY-MM-DD format
 * @param year - Year
 * @param month - Month (0-11)
 * @param day - Day (1-31)
 * @returns Date string in YYYY-MM-DD format
 */
export const formatDateString = (year: number, month: number, day: number): string => {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
};

/**
 * Gets appointments for a specific date
 * @param appointments - Array of appointments
 * @param year - Year
 * @param month - Month (0-11)
 * @param day - Day (1-31)
 * @returns Filtered appointments for the date
 */
export const getAppointmentsForDate = (
  appointments: Appointment[], 
  year: number, 
  month: number, 
  day: number
): Appointment[] => {
  const dateString = formatDateString(year, month, day);
  return appointments.filter(appointment => appointment.date === dateString);
};

/**
 * Checks if a date is selected
 * @param selectedDate - Currently selected date string
 * @param year - Year
 * @param month - Month (0-11)
 * @param day - Day (1-31)
 * @returns Boolean indicating if the date is selected
 */
export const isDateSelected = (
  selectedDate: string | undefined, 
  year: number, 
  month: number, 
  day: number
): boolean => {
  if (!selectedDate) return false;
  const dateString = formatDateString(year, month, day);
  return dateString === selectedDate;
};

/**
 * Generates the calendar grid array
 * @param year - Year
 * @param month - Month (0-11)
 * @returns Array of numbers (days) and null values for empty cells
 */
export const generateCalendarGrid = (year: number, month: number): (number | null)[] => {
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const firstDayWeekday = firstDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();

  const calendarDays: (number | null)[] = [];
  
  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDayWeekday; i++) {
    calendarDays.push(null);
  }
  
  // Add all days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  return calendarDays;
};

/**
 * Gets the display name for a month and year
 * @param month - Month (0-11)
 * @param year - Year
 * @returns Formatted month and year string
 */
export const getMonthYearDisplay = (month: number, year: number): string => {
  return `${CALENDAR_CONSTANTS.MONTHS[month]} ${year}`;
};

/**
 * Gets calendar date information
 * @param date - Date object
 * @returns Object with year, month, and day info
 */
export const getCalendarDateInfo = (date: Date) => {
  const year = date.getFullYear();
  const month = date.getMonth();
  
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const firstDayWeekday = firstDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();

  return {
    year,
    month,
    firstDayOfMonth,
    lastDayOfMonth,
    firstDayWeekday,
    daysInMonth
  };
};

/**
 * Creates navigation date for previous/next month
 * @param currentYear - Current year
 * @param currentMonth - Current month (0-11)
 * @param direction - Navigation direction (-1 for previous, 1 for next)
 * @returns New Date object for navigation
 */
export const getNavigationDate = (
  currentYear: number, 
  currentMonth: number, 
  direction: -1 | 1
): Date => {
  return new Date(currentYear, currentMonth + direction, 1);
};

/**
 * Formats appointment display text
 * @param appointment - Appointment object
 * @returns Formatted display text for appointment
 */
export const formatAppointmentDisplay = (appointment: Appointment): string => {
  const firstName = appointment.patientName.split(' ')[0];
  return `${appointment.time} - ${firstName}`;
};

/**
 * Determines if appointments should show "more" indicator
 * @param totalAppointments - Total number of appointments
 * @returns Boolean and count of additional appointments
 */
export const shouldShowMoreAppointments = (totalAppointments: number) => {
  const maxVisible = CALENDAR_CONSTANTS.MAX_VISIBLE_APPOINTMENTS;
  return {
    shouldShow: totalAppointments > maxVisible,
    additionalCount: Math.max(0, totalAppointments - maxVisible)
  };
};