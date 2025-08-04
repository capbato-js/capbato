import React from 'react';
import { MedicalClinicLayout } from '../../../components/layout';
import { DoctorsTable, CustomCalendar } from '../components';
import { useDoctorScheduleCalendarViewModel } from '../view-models/useDoctorScheduleCalendarViewModel';
import type { ScheduleEntry } from '../types';

export const DoctorsPage: React.FC = () => {
  // Use the real API integration for appointment data
  const {
    appointments,
    loading,
    error,
    availableDoctors,
    updateAppointmentDoctor
  } = useDoctorScheduleCalendarViewModel();

  // Convert API appointment data to CustomCalendar format
  const convertToScheduleEntries = (): ScheduleEntry[] => {
    return appointments?.map(appointment => ({
      date: appointment.date, // Already in YYYY-MM-DD format
      details: appointment.doctorName,
      note: appointment.formattedTime || appointment.time
    })) || [];
  };

  const scheduleEntries = convertToScheduleEntries();

  return (
    <MedicalClinicLayout>
      {/* No boxing - content flows naturally */}
      {/* Doctors Table - Now uses real API data */}
      <DoctorsTable />
      
      {/* Doctor's Schedule Calendar - Now with edit functionality */}
      <CustomCalendar 
        schedules={error ? [] : scheduleEntries}
        availableDoctors={availableDoctors}
        onDoctorChange={updateAppointmentDoctor}
      />
    </MedicalClinicLayout>
  );
};