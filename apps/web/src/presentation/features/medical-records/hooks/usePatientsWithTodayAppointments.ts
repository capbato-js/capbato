import { useState, useEffect } from 'react';
import { useAppointmentStore } from '../../../../infrastructure/state/AppointmentStore';
import { getSelectedDateString } from '../../../features/appointments/utils/appointmentUtils';

/**
 * Custom hook to get patient IDs who have appointments today
 * Used to filter patient selection in lab tests and prescriptions
 */
export const usePatientsWithTodayAppointments = () => {
  const [patientIdsWithAppointmentsToday, setPatientIdsWithAppointmentsToday] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);

  const { appointments, fetchAllAppointments } = useAppointmentStore();

  useEffect(() => {
    const loadAppointments = async () => {
      setIsLoading(true);
      try {
        await fetchAllAppointments();
      } catch (error) {
        console.error('Failed to load appointments:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAppointments();
  }, [fetchAllAppointments]);

  useEffect(() => {
    // Get today's date in YYYY-MM-DD format
    const todayString = getSelectedDateString(new Date());

    // Filter appointments to only today's appointments (any status)
    const todayAppointments = appointments.filter(
      appointment => appointment.appointmentDate === todayString
    );

    // Extract unique patient IDs from today's appointments
    const patientIds = new Set(
      todayAppointments
        .filter(appointment => appointment.patient?.id)
        .map(appointment => appointment.patient!.id)
    );

    setPatientIdsWithAppointmentsToday(patientIds);
  }, [appointments]);

  /**
   * Check if a patient has an appointment today
   */
  const hasAppointmentToday = (patientId: string): boolean => {
    return patientIdsWithAppointmentsToday.has(patientId);
  };

  /**
   * Filter patients to only those with appointments today
   */
  const filterPatientsWithAppointmentsToday = <T extends { value: string }>(
    patients: T[]
  ): T[] => {
    return patients.filter(patient => hasAppointmentToday(patient.value));
  };

  return {
    patientIdsWithAppointmentsToday,
    hasAppointmentToday,
    filterPatientsWithAppointmentsToday,
    isLoading,
    hasAnyPatientsWithAppointmentsToday: patientIdsWithAppointmentsToday.size > 0,
  };
};
