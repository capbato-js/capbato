import { useState, useCallback } from 'react';
import { getAvailableTimeSlots } from '../utils/appointmentFormUtils';

/**
 * Custom hook to manage time slot generation and updates
 */
export const useTimeSlotManagement = (
  getAppointmentsByDate: (date: string) => Array<{ id: string; appointmentTime: string; status: string }>,
  currentAppointmentId?: string
) => {
  const [timeSlots, setTimeSlots] = useState(() => getAvailableTimeSlots('', [], currentAppointmentId));

  const updateTimeSlotsForDate = useCallback((dateString: string) => {
    const existingAppointments = dateString ? getAppointmentsByDate(dateString) : [];
    const newTimeSlots = getAvailableTimeSlots(dateString, existingAppointments, currentAppointmentId);
    setTimeSlots(newTimeSlots);
    return newTimeSlots;
  }, [getAppointmentsByDate, currentAppointmentId]);

  const clearTimeSlots = useCallback(() => {
    const emptySlots = getAvailableTimeSlots('', [], currentAppointmentId);
    setTimeSlots(emptySlots);
  }, [currentAppointmentId]);

  const isTimeSlotAvailable = useCallback((timeValue: string, availableSlots: Array<{ value: string; label: string }>) => {
    return availableSlots.some(slot => slot.value === timeValue);
  }, []);

  return {
    timeSlots,
    updateTimeSlotsForDate,
    clearTimeSlots,
    isTimeSlotAvailable
  };
};