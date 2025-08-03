import React from 'react';
import { Box, LoadingOverlay } from '@mantine/core';
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
      details: `Dr. ${appointment.doctorName}`,
      note: appointment.formattedTime || appointment.time
    })) || [];
  };

  const scheduleEntries = convertToScheduleEntries();

  return (
    <MedicalClinicLayout>
      <Box
        style={{
          background: 'white',
          borderRadius: '15px',
          padding: '30px',
          boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
          minHeight: 'calc(100vh - 140px)',
          position: 'relative'
        }}
      >

        {/* Doctors Table - Now uses real API data */}
        <DoctorsTable />
        
        {/* Doctor's Schedule Calendar - Now with edit functionality */}
        <CustomCalendar 
          schedules={error ? [] : scheduleEntries}
          availableDoctors={availableDoctors}
          onDoctorChange={updateAppointmentDoctor}
        />
      </Box>
    </MedicalClinicLayout>
  );
};
