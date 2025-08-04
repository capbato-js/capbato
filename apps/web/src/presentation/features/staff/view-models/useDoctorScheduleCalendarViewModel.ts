import { useState, useEffect, useCallback } from 'react';
import { container } from 'tsyringe';
import { DoctorApiService } from '../../../../infrastructure/api/DoctorApiService';
import { AppointmentApiService } from '../../../../infrastructure/api/AppointmentApiService';
import { useDoctorAccess } from '../../../../infrastructure/auth';
import type { DoctorDto } from '@nx-starter/application-shared';

// Helper function to format appointment date to YYYY-MM-DD
const formatDateToISOString = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Helper function to format time for display
const formatTimeForDisplay = (time: string): string => {
  const [hours, minutes] = time.split(':');
  const hour24 = parseInt(hours, 10);
  const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
  const ampm = hour24 >= 12 ? 'PM' : 'AM';
  return `${hour12}${minutes !== '00' ? `:${minutes}` : ''} ${ampm}`;
};

// Define the calendar appointment interface (converted from appointment data)
interface CalendarAppointment {
  id: string;
  appointmentId: string; // Track the actual appointment ID for updates
  doctorId: string;
  doctorName: string;
  date: string; // YYYY-MM-DD format
  time: string; // HH:MM format
  formattedTime: string;
  patientName?: string;
  reasonForVisit?: string;
}

interface DoctorScheduleCalendarViewModel {
  appointments: CalendarAppointment[];
  loading: boolean;
  error: string | null;
  availableDoctors: Array<{ id: string; name: string; }>;
  refreshData: () => Promise<void>;
  getAppointmentsForDate: (date: Date) => CalendarAppointment[];
  updateAppointmentDoctor: (date: Date | string, newDoctorId: string, newDoctorName: string) => Promise<void>;
  isUpdatingDate: (date: Date | string) => boolean;
}

/**
 * View model for Doctor Schedule Calendar
 * Uses appointments as the single source of truth for calendar data
 */
export const useDoctorScheduleCalendarViewModel = (): DoctorScheduleCalendarViewModel => {
  const [appointments, setAppointments] = useState<CalendarAppointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [availableDoctors, setAvailableDoctors] = useState<Array<{ id: string; name: string; }>>([]);
  const [updatingDates, setUpdatingDates] = useState<Set<string>>(new Set());
  const [doctorProfileId, setDoctorProfileId] = useState<string | null>(null);

  // Get doctor access permissions
  const { isDoctor, userId, shouldFilterByDoctor, canViewAllDoctorSchedules } = useDoctorAccess();

  // Get the API service instances
  const doctorApiService = container.resolve(DoctorApiService);
  const appointmentApiService = container.resolve(AppointmentApiService);

  // Fetch doctor profile ID for the current user (if they are a doctor)
  const fetchDoctorProfile = useCallback(async () => {
    if (!shouldFilterByDoctor || !userId) {
      return;
    }

    try {
      console.log(`Fetching doctor profile for user ID: ${userId}`);
      const doctorProfile = await doctorApiService.getDoctorByUserId(userId);
      console.log('Doctor profile found:', doctorProfile);
      setDoctorProfileId(doctorProfile.id);
    } catch (err) {
      console.error('Error fetching doctor profile:', err);
      // If doctor profile doesn't exist, keep doctorProfileId as null
      // This will result in no appointments being shown, which is correct
      setDoctorProfileId(null);
    }
  }, [shouldFilterByDoctor, userId, doctorApiService]);

  // Fetch appointments from the API and transform to calendar format
  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Fetching appointments...');
      console.log('Doctor access info:', { isDoctor, userId, shouldFilterByDoctor, canViewAllDoctorSchedules, doctorProfileId });
      
      // Get all appointments
      const appointmentsData = await appointmentApiService.getAllAppointments();
      console.log('Raw appointments data:', appointmentsData);
      
      // Transform appointments to calendar format
      let calendarAppointments: CalendarAppointment[] = appointmentsData.map(appointment => {
        // Extract date from appointmentDate (handle timezone properly)
        const appointmentDate = new Date(appointment.appointmentDate);
        const dateString = formatDateToISOString(appointmentDate);
        
        return {
          id: `appointment-${appointment.id}`, // Unique calendar ID
          appointmentId: appointment.id, // Actual appointment ID for updates
          doctorId: appointment.doctor?.id || '',
          doctorName: appointment.doctor?.fullName || 'Unknown Doctor',
          date: dateString,
          time: appointment.appointmentTime,
          formattedTime: formatTimeForDisplay(appointment.appointmentTime),
          patientName: appointment.patient?.fullName,
          reasonForVisit: appointment.reasonForVisit
        };
      });

      // Filter appointments based on user role
      if (shouldFilterByDoctor && doctorProfileId) {
        console.log(`Filtering appointments for doctor profile ID: ${doctorProfileId}`);
        calendarAppointments = calendarAppointments.filter(appointment => 
          appointment.doctorId === doctorProfileId
        );
        console.log('Filtered appointments for doctor:', calendarAppointments);
      } else if (shouldFilterByDoctor && !doctorProfileId) {
        console.log('Doctor user but no profile found - showing no appointments');
        calendarAppointments = []; // Doctor user but no profile, show nothing
      } else {
        console.log('Showing all appointments (admin/receptionist view)');
      }
      
      console.log('Final calendar appointments:', calendarAppointments);
      setAppointments(calendarAppointments);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('Error fetching appointments:', err);
    } finally {
      setLoading(false);
    }
  }, [appointmentApiService, shouldFilterByDoctor, doctorProfileId, isDoctor, canViewAllDoctorSchedules, userId]);

  // Get appointments for a specific date
  const getAppointmentsForDate = useCallback((date: Date): CalendarAppointment[] => {
    const targetDateString = formatDateToISOString(date);
    return appointments.filter(appointment => {
      return appointment.date === targetDateString;
    }).sort((a, b) => {
      // Sort by time
      return a.time.localeCompare(b.time);
    });
  }, [appointments]);

  // Refresh data
  const refreshData = useCallback(async () => {
    await fetchAppointments();
  }, [fetchAppointments]);

  // Fetch available doctors
  const fetchDoctors = useCallback(async () => {
    try {
      console.log('Fetching doctors...');
      // Use full format to get all fields including fullName
      const doctors = await doctorApiService.getAllDoctors(true, 'full') as DoctorDto[];
      console.log('Raw doctors data:', doctors);
      
      const doctorList = doctors.map(doctor => {
        // Use fullName field directly, with fallback
        const fullName = doctor.fullName || `${doctor.firstName || 'Unknown'} ${doctor.lastName || 'Doctor'}`;
        
        console.log('Processing doctor:', {
          id: doctor.id,
          fullName: doctor.fullName,
          firstName: doctor.firstName,
          lastName: doctor.lastName,
          finalName: fullName,
          original: doctor
        });
        
        return {
          id: doctor.id,
          name: fullName
        };
      });
      
      console.log('Processed doctor list:', doctorList);
      setAvailableDoctors(doctorList);
    } catch (err) {
      console.error('Error fetching doctors:', err);
    }
  }, []);

  // Helper function to check if a date is being updated
  const isUpdatingDate = useCallback((date: Date | string) => {
    const dateString = typeof date === 'string' ? date : formatDateToISOString(date);
    return updatingDates.has(dateString);
  }, [updatingDates]);

  // Update appointment doctor for a specific date
  const updateAppointmentDoctor = useCallback(async (date: Date | string, newDoctorId: string, newDoctorName: string) => {
    const dateString = typeof date === 'string' ? date : formatDateToISOString(date);
    
    try {
      // Set loading state for this specific date
      setUpdatingDates(prev => new Set(prev).add(dateString));
      console.log('Updating appointment doctor:', { date: dateString, newDoctorId, newDoctorName });
      
      // Find appointment(s) for the given date from our current data
      const appointmentsForDate = typeof date === 'string' 
        ? appointments.filter(appointment => appointment.date === date)
        : getAppointmentsForDate(date);
      
      if (appointmentsForDate.length === 0) {
        console.error('No appointments found for date:', dateString);
        setError('No appointments found for the selected date');
        return;
      }
      
      console.log('Found appointments to update:', appointmentsForDate);
      
      // Update all appointments for this date (in case there are multiple)
      // This maintains the behavior where changing the doctor for a date affects all appointments
      for (const calendarAppointment of appointmentsForDate) {
        await appointmentApiService.updateAppointment(calendarAppointment.appointmentId, {
          doctorId: newDoctorId
        });
        console.log(`Updated appointment ${calendarAppointment.appointmentId} with new doctor`);
      }
      
      console.log('All appointments updated successfully');
      
      // Optimistically update the local state for immediate feedback
      setAppointments(prev => prev.map(appointment => {
        if (appointment.date === dateString) {
          return {
            ...appointment,
            doctorId: newDoctorId,
            doctorName: newDoctorName
          };
        }
        return appointment;
      }));
      
    } catch (err) {
      console.error('Error updating appointment doctor:', err);
      setError(err instanceof Error ? err.message : 'Failed to update appointment');
      // Refresh data to revert optimistic update on error
      await fetchAppointments();
    } finally {
      // Remove loading state for this specific date
      setUpdatingDates(prev => {
        const newSet = new Set(prev);
        newSet.delete(dateString);
        return newSet;
      });
    }
  }, [appointmentApiService, fetchAppointments, getAppointmentsForDate]);

  // Effect to fetch doctor profile when user changes
  useEffect(() => {
    fetchDoctorProfile();
  }, [fetchDoctorProfile]);

  // Effect to fetch appointments when doctor profile is resolved
  useEffect(() => {
    // For non-doctors, fetch immediately
    // For doctors, wait until we have the profile ID (or confirmed it doesn't exist)
    if (!shouldFilterByDoctor || doctorProfileId !== null) {  
      fetchAppointments();
    }
  }, [fetchAppointments, shouldFilterByDoctor, doctorProfileId]);

  // Initial load for doctors list
  useEffect(() => {
    fetchDoctors();
  }, [fetchDoctors]);

  return {
    appointments,
    loading,
    error,
    availableDoctors,
    refreshData,
    getAppointmentsForDate,
    updateAppointmentDoctor,
    isUpdatingDate
  };
};
