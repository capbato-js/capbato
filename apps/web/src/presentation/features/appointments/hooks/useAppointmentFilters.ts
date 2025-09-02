import { useState } from 'react';
import { Appointment } from '../types';
import { sortAppointments, getSelectedDateString } from '../utils/appointmentUtils';

export const useAppointmentFilters = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showAll, setShowAll] = useState<boolean>(false);

  const handleDateChange = (value: string | null) => {
    if (value) {
      setSelectedDate(new Date(value));
      if (showAll) {
        setShowAll(false);
      }
    }
  };

  const handleShowAllChange = (checked: boolean) => {
    setShowAll(checked);
  };

  const getFilteredAndSortedAppointments = (appointments: Appointment[]) => {
    const filteredAppointments = showAll 
      ? appointments 
      : appointments.filter(appointment => {
          const selectedDateString = getSelectedDateString(selectedDate);
          return appointment.date === selectedDateString;
        });
    
    return sortAppointments(filteredAppointments, showAll);
  };

  return {
    selectedDate,
    showAll,
    handleDateChange,
    handleShowAllChange,
    getFilteredAndSortedAppointments,
  };
};