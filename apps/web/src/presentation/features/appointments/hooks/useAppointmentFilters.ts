import { useState } from 'react';
import { Appointment } from '../types';
import { sortAppointments, getSelectedDateString } from '../utils/appointmentUtils';

type AppointmentStatus = 'confirmed' | 'completed' | 'cancelled';
type StatusFilter = 'all' | AppointmentStatus;

export const useAppointmentFilters = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showAll, setShowAll] = useState<boolean>(false);
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<StatusFilter>('all');

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

  const handleStatusFilterChange = (status: StatusFilter) => {
    setSelectedStatusFilter(status);
  };

  const getFilteredAndSortedAppointments = (appointments: Appointment[]) => {
    let filteredAppointments = appointments;

    // Apply date filter (unless Show All is enabled)
    if (!showAll) {
      const selectedDateString = getSelectedDateString(selectedDate);
      filteredAppointments = filteredAppointments.filter(
        appointment => appointment.date === selectedDateString
      );
    }

    // Apply status filter (unless 'all' is selected)
    if (selectedStatusFilter !== 'all') {
      filteredAppointments = filteredAppointments.filter(
        appointment => appointment.status === selectedStatusFilter
      );
    }

    return sortAppointments(filteredAppointments, showAll);
  };

  return {
    selectedDate,
    showAll,
    selectedStatusFilter,
    handleDateChange,
    handleShowAllChange,
    handleStatusFilterChange,
    getFilteredAndSortedAppointments,
  };
};