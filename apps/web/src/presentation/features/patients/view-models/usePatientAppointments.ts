import { useEffect, useState } from 'react';
import { useAppointmentStore } from '../../../../infrastructure/state/AppointmentStore';
import { AppointmentDto } from '@nx-starter/application-shared';
import { BaseAppointment } from '../../../components/common';

/**
 * Hook to manage patient-specific appointments
 */
export const usePatientAppointments = (patientId: string | undefined) => {
  const fetchAppointmentsByPatientId = useAppointmentStore((state) => state.fetchAppointmentsByPatientId);
  const appointments = useAppointmentStore((state) => state.appointments);
  const isLoading = useAppointmentStore((state) => state.isLoading);
  const error = useAppointmentStore((state) => state.error);
  const clearError = useAppointmentStore((state) => state.clearError);
  
  const [patientAppointments, setPatientAppointments] = useState<BaseAppointment[]>([]);

  useEffect(() => {
    const loadData = async () => {
      if (!patientId) {
        setPatientAppointments([]);
        return;
      }

      try {
        await fetchAppointmentsByPatientId(patientId);
      } catch (error) {
        console.error('Failed to load patient appointments:', error);
      }
    };

    loadData();
  }, [patientId, fetchAppointmentsByPatientId]);

  useEffect(() => {
    // Map appointments to BaseAppointment format
    const mappedAppointments = appointments.map(mapAppointmentDtoToBase);
    setPatientAppointments(mappedAppointments);
  }, [appointments]);

  return {
    appointments: patientAppointments,
    isLoading,
    error,
    hasError: !!error,
    clearError,
  };
};

/**
 * Maps AppointmentDto to BaseAppointment for table display
 */
function mapAppointmentDtoToBase(appointment: AppointmentDto): BaseAppointment {
  return {
    id: appointment.id,
    patientNumber: '', // Not available in appointment context
    patientName: '', // Not needed in patient-specific view
    reasonForVisit: appointment.reasonForVisit,
    date: appointment.appointmentDate,
    time: appointment.appointmentTime,
    doctor: appointment.doctor?.fullName || appointment.doctor?.firstName + ' ' + appointment.doctor?.lastName || 'TBD', // Display doctor name or fallback
    status: appointment.status.toLowerCase() as 'confirmed' | 'completed' | 'cancelled'
  };
}
