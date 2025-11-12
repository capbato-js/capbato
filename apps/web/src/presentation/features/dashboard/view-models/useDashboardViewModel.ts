import { useState, useEffect } from 'react';
import { useAppointmentStore } from '../../../../infrastructure/state/AppointmentStore';
import { AppointmentDto } from '@nx-starter/application-shared';
import { BaseAppointment } from '../../../components/common';
import { doctorAssignmentService } from '../../appointments/services/DoctorAssignmentService';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';

// Configure dayjs plugins
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isSameOrBefore);

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
  const { appointments, fetchTodayConfirmedAppointments, isLoading, error } = useAppointmentStore();
  const [isDoctorLoading, setIsDoctorLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    doctorName: 'No Doctor Assigned',
    currentPatient: 'N/A',
    totalAppointments: 0,
    totalAppointmentsDate: dayjs().tz('Asia/Manila').format('MMM D, YYYY')
  });

  // Convert AppointmentDto to BaseAppointment
  const mapToBaseAppointment = (dto: AppointmentDto): BaseAppointment => ({
    id: dto.id,
    appointmentNumber: dto.appointmentNumber,
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

  // Get today's confirmed appointments - data comes pre-filtered from the backend
  const todayAppointments = sortAppointmentsByTime(appointments.map(mapToBaseAppointment));

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
    // Use dayjs with Asia/Manila timezone for accurate current time comparison
    const now = dayjs().tz('Asia/Manila');
    const today = now.startOf('day');
    
    // Get all confirmed appointments sorted by date and time (earliest first)
    // Note: appointments are already filtered to today's confirmed appointments only
    const allAppointmentsSorted = appointments
      .map(mapToBaseAppointment)
      .sort((a, b) => {
        // Create dayjs objects for comparison with timezone awareness
        const dateTimeA = dayjs.tz(`${a.date} ${a.time}`, 'Asia/Manila');
        const dateTimeB = dayjs.tz(`${b.date} ${b.time}`, 'Asia/Manila');
        return dateTimeA.valueOf() - dateTimeB.valueOf();
      });

    // Find first active appointment that is either:
    // 1. From the past or current time (has started or should have started)
    // 2. Scheduled for today (regardless of time)
    // Since we only fetch confirmed appointments, no need to exclude other statuses
    const currentAppointment = allAppointmentsSorted.find(apt => {
      const appointmentDate = dayjs.tz(apt.date, 'Asia/Manila').startOf('day');
      const appointmentDateTime = dayjs.tz(`${apt.date} ${apt.time}`, 'Asia/Manila');
      
      // Check if appointment is today or in the past
      const isToday = appointmentDate.isSame(today);
      const isInPastOrNow = appointmentDateTime.isSameOrBefore(now);
      
      return isToday || isInPastOrNow;
    });
    
    return currentAppointment?.patientName || 'N/A';
  };

  const loadDashboardData = async () => {
    try {
      // Clear the doctor assignment cache to ensure we get fresh data
      doctorAssignmentService.getInstance().clearCache();
      
      await fetchTodayConfirmedAppointments();
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
