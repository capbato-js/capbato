import { useState, useEffect } from 'react';
import { useAppointmentStore } from '../../../../infrastructure/state/AppointmentStore';
import { AppointmentDto } from '@nx-starter/application-shared';
import { BaseAppointment } from '../../../components/common';

export interface DashboardStats {
  doctorName: string;
  currentPatient: string;
  totalAppointments: number;
  totalAppointmentsDate: string;
}

export interface DashboardViewModel {
  stats: DashboardStats;
  todayAppointments: BaseAppointment[];
  isLoading: boolean;
  error: string | null;
  loadDashboardData: () => Promise<void>;
}

export const useDashboardViewModel = (): DashboardViewModel => {
  const { appointments, fetchAllAppointments, isLoading, error } = useAppointmentStore();
  const [stats, setStats] = useState<DashboardStats>({
    doctorName: 'No Doctor Assigned',
    currentPatient: 'N/A',
    totalAppointments: 0,
    totalAppointmentsDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  });

  // Helper function to check if a date is today
  const isToday = (dateString: string): boolean => {
    const date = new Date(dateString);
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  // Filter today's appointments from raw data
  const todaysRawAppointments = appointments.filter(appointment => isToday(appointment.appointmentDate));

  // Convert AppointmentDto to BaseAppointment
  const mapToBaseAppointment = (dto: AppointmentDto): BaseAppointment => ({
    id: dto.id,
    patientNumber: dto.patient?.patientNumber || 'Unknown',
    patientName: dto.patient?.fullName || 'Unknown Patient',
    reasonForVisit: dto.reasonForVisit,
    date: dto.appointmentDate,
    time: dto.appointmentTime,
    doctor: dto.doctor?.fullName || 'Unknown Doctor',
    status: dto.status === 'confirmed' ? 'confirmed' 
      : dto.status === 'cancelled' ? 'cancelled' 
      : dto.status === 'completed' ? 'completed' 
      : 'confirmed'
  });

  // Helper function to sort appointments by date and time (earliest to latest)
  const sortAppointmentsByTime = (appointments: BaseAppointment[]): BaseAppointment[] => {
    return [...appointments].sort((a, b) => {
      // Create date objects for comparison
      const dateTimeA = new Date(`${a.date} ${a.time}`);
      const dateTimeB = new Date(`${b.date} ${b.time}`);
      
      // Earliest to latest (oldest first) - same as appointments page for filtered view
      return dateTimeA.getTime() - dateTimeB.getTime();
    });
  };

  // Get today's appointments - simplified approach
  const todayAppointments = sortAppointmentsByTime(todaysRawAppointments.map(mapToBaseAppointment));

  // Simple doctor detection - get from first appointment
  const getDoctorFromAppointments = (): string => {
    if (appointments.length === 0) {
      return 'No Doctor Assigned';
    }
    
    if (todayAppointments.length === 0) {
      // If no today's appointments, get doctor from any recent appointment
      const recentAppointment = appointments[0];
      const doctorName = recentAppointment?.doctor?.fullName;
      return doctorName ? `${doctorName} (Assigned)` : 'No Doctor Assigned';
    }
    
    // Get doctor from today's first appointment
    const doctorName = todayAppointments[0].doctor;
    return doctorName ? `${doctorName} (Assigned)` : 'No Doctor Assigned';
  };

  // Simple patient detection - get current confirmed patient
  const getCurrentPatientFromAppointments = (): string => {
    const confirmedAppointment = todayAppointments.find(apt => apt.status === 'confirmed');
    return confirmedAppointment?.patientName || 'N/A';
  };

  const loadDashboardData = async () => {
    try {
      await fetchAllAppointments();
      // useEffect will handle stats update when appointments change
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    }
  };

  // Update stats when appointments change
  useEffect(() => {
    const doctorName = getDoctorFromAppointments();
    const currentPatient = getCurrentPatientFromAppointments();
    const appointmentCount = todayAppointments.length;
    
    setStats(prev => ({
      ...prev,
      doctorName,
      currentPatient,
      totalAppointments: appointmentCount
    }));
  }, [appointments]);

  return {
    stats,
    todayAppointments,
    isLoading,
    error,
    loadDashboardData
  };
};
