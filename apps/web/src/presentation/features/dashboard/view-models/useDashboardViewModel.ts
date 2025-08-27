import { useState, useEffect } from 'react';
import { useAppointmentStore } from '../../../../infrastructure/state/AppointmentStore';
import { AppointmentDto } from '@nx-starter/application-shared';
import { BaseAppointment } from '../../../components/common';
import { doctorAssignmentService } from '../../appointments/services/DoctorAssignmentService';

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
  isDoctorLoading: boolean;
  error: string | null;
  loadDashboardData: () => Promise<void>;
}

export const useDashboardViewModel = (): DashboardViewModel => {
  const { appointments, fetchAllAppointments, isLoading, error } = useAppointmentStore();
  const [isDoctorLoading, setIsDoctorLoading] = useState(true);
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

  // Get assigned doctor for today using the DoctorAssignmentService
  const getAssignedDoctorForToday = async (): Promise<string> => {
    setIsDoctorLoading(true);
    try {
      // Always clear cache to ensure fresh data when viewing dashboard
      doctorAssignmentService.getInstance().clearCache();
      
      const today = new Date();
      const assignedDoctor = await doctorAssignmentService.getInstance().getAssignedDoctorForDate(today);
      
      if (assignedDoctor) {
        return `${assignedDoctor.fullName} (Assigned)`;
      } else {
        return 'No Doctor Assigned';
      }
    } catch (error) {
      console.error('Error getting assigned doctor for today:', error);
      return 'Error loading doctor assignment';
    } finally {
      setIsDoctorLoading(false);
    }
  };

  // Simple patient detection - get current patient based on business rule
  const getCurrentPatientFromAppointments = (): string => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    // Get all appointments sorted by date and time (earliest first)
    const allAppointmentsSorted = appointments
      .map(mapToBaseAppointment)
      .sort((a, b) => {
        // Create date objects for comparison
        const dateTimeA = new Date(`${a.date} ${a.time}`);
        const dateTimeB = new Date(`${b.date} ${b.time}`);
        return dateTimeA.getTime() - dateTimeB.getTime();
      });

    // Find first active appointment that is either:
    // 1. From the past or current time (has started or should have started)
    // 2. Scheduled for today (regardless of time)
    // Exclude completed and cancelled appointments
    const currentAppointment = allAppointmentsSorted.find(apt => {
      if (apt.status === 'completed' || apt.status === 'cancelled') return false;
      
      const appointmentDate = new Date(apt.date);
      const appointmentDateTime = new Date(`${apt.date} ${apt.time}`);
      
      // Check if appointment is today or in the past
      const isToday = appointmentDate.getTime() === today.getTime();
      const isInPastOrNow = appointmentDateTime.getTime() <= now.getTime();
      
      return isToday || isInPastOrNow;
    });
    
    return currentAppointment?.patientName || 'N/A';
  };

  const loadDashboardData = async () => {
    try {
      // Clear the doctor assignment cache to ensure we get fresh data
      doctorAssignmentService.getInstance().clearCache();
      
      await fetchAllAppointments();
      // useEffect will handle stats update when appointments change
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    }
  };

  // Update stats when appointments change
  useEffect(() => {
    const updateStats = async () => {
      const doctorName = await getAssignedDoctorForToday();
      const currentPatient = getCurrentPatientFromAppointments();
      const appointmentCount = todayAppointments.length;
      
      setStats(prev => ({
        ...prev,
        doctorName,
        currentPatient,
        totalAppointments: appointmentCount
      }));
    };

    updateStats();
  }, [appointments]);

  // Also update doctor assignment when component mounts (for navigation scenarios)
  useEffect(() => {
    const updateDoctorAssignment = async () => {
      const doctorName = await getAssignedDoctorForToday();
      setStats(prev => ({
        ...prev,
        doctorName
      }));
    };

    updateDoctorAssignment();
  }, []); // Run only on mount

  return {
    stats,
    todayAppointments,
    isLoading,
    isDoctorLoading,
    error,
    loadDashboardData
  };
};
