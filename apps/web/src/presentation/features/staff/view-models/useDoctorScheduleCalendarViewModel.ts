import { useState, useEffect, useCallback } from 'react';
import { container } from 'tsyringe';
import { DoctorApiService } from '../../../../infrastructure/api/DoctorApiService';
import type { DoctorDto } from '@nx-starter/application-shared';

// Helper function to format date to YYYY-MM-DD
const formatDateToISOString = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

interface DoctorScheduleBlock {
  id: string;
  doctorId: string;
  doctorName: string;
  date: string;
  schedulePattern: string;
  schedulePatternDescription: string;
}

interface DoctorScheduleCalendarViewModel {
  scheduleBlocks: DoctorScheduleBlock[];
  loading: boolean;
  error: string | null;
  availableDoctors: Array<{ id: string; name: string; schedulePattern?: string; }>;
  refreshData: () => Promise<void>;
  getScheduleBlocksForDate: (date: Date) => DoctorScheduleBlock[];
}

/**
 * Check if a doctor is scheduled to work on a specific day based on their schedule pattern
 */
const isDoctorScheduledOnDay = (doctor: DoctorDto, dayOfWeek: string): boolean => {
  console.log(`Checking if ${doctor.fullName} is scheduled on ${dayOfWeek}, pattern: ${doctor.schedulePattern}`);
  
  if (!doctor.schedulePattern) {
    console.log(`No schedule pattern for ${doctor.fullName}`);
    return false; // No schedule pattern means not scheduled
  }

  const pattern = doctor.schedulePattern.toUpperCase();
  
  // Handle common patterns
  switch (pattern) {
    case 'MWF':
      const isMWF = ['MONDAY', 'WEDNESDAY', 'FRIDAY'].includes(dayOfWeek);
      console.log(`MWF check for ${dayOfWeek}: ${isMWF}`);
      return isMWF;
    case 'TTH':
      const isTTH = ['TUESDAY', 'THURSDAY'].includes(dayOfWeek);
      console.log(`TTH check for ${dayOfWeek}: ${isTTH}`);
      return isTTH;
    case 'WEEKDAYS':
      return ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'].includes(dayOfWeek);
    case 'ALL':
      return true;
    default:
      console.log(`Unknown pattern: ${pattern}`);
      return false;
  }
};

/**
 * Get day of week from date
 */
const getDayOfWeek = (date: Date): string => {
  const days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
  return days[date.getDay()];
};

/**
 * Generate doctor schedule blocks for a date range
 */
const generateDoctorScheduleBlocks = (
  doctors: DoctorDto[],
  startDate: Date,
  endDate: Date
): DoctorScheduleBlock[] => {
  const blocks: DoctorScheduleBlock[] = [];
  const current = new Date(startDate);

  while (current <= endDate) {
    const dateString = formatDateToISOString(current);
    const dayOfWeek = getDayOfWeek(current);

    for (const doctor of doctors) {
      // Check if doctor is scheduled to work on this day
      if (isDoctorScheduledOnDay(doctor, dayOfWeek)) {
        blocks.push({
          id: `schedule-${doctor.id}-${dateString}`,
          doctorId: doctor.id,
          doctorName: doctor.fullName,
          date: dateString,
          schedulePattern: doctor.schedulePattern || 'Unknown',
          schedulePatternDescription: doctor.schedulePatternDescription || 'No schedule pattern',
        });
      }
    }

    current.setDate(current.getDate() + 1);
  }

  return blocks;
};

/**
 * View model for Doctor Schedule Calendar
 * Uses doctor schedule patterns as the primary source for calendar display
 */
export const useDoctorScheduleCalendarViewModel = (): DoctorScheduleCalendarViewModel => {
  const [scheduleBlocks, setScheduleBlocks] = useState<DoctorScheduleBlock[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [availableDoctors, setAvailableDoctors] = useState<Array<{ id: string; name: string; schedulePattern?: string; }>>([]);
  const [doctorsData, setDoctorsData] = useState<DoctorDto[]>([]);

  // Get the API service instance
  const doctorApiService = container.resolve(DoctorApiService);

  // Generate schedule blocks from doctor data
  const generateScheduleBlocks = useCallback((doctors: DoctorDto[]) => {
    console.log('Generating schedule blocks from doctors:', doctors);
    
    // Generate schedule blocks for the current month
    const currentDate = new Date();
    const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    
    const blocks = generateDoctorScheduleBlocks(doctors, startDate, endDate);
    
    console.log('Generated schedule blocks:', blocks.length);
    setScheduleBlocks(blocks);
  }, []);

  // Fetch doctors and generate schedule blocks
  const fetchDoctorsAndSchedules = useCallback(async () => {
    if (loading) return; // Prevent concurrent calls
    
    setLoading(true);
    setError(null);
    
    try {
      console.log('Fetching doctors data...');
      const doctors = await doctorApiService.getAllDoctors(true, 'full') as DoctorDto[];
      console.log('Doctors data fetched:', doctors);
      
      setDoctorsData(doctors);
      
      // Process available doctors list
      const doctorList = doctors.map(doctor => ({
        id: doctor.id,
        name: doctor.fullName || `${doctor.firstName || 'Unknown'} ${doctor.lastName || 'Doctor'}`,
        schedulePattern: doctor.schedulePattern,
        schedulePatternDescription: doctor.schedulePatternDescription
      }));
      
      setAvailableDoctors(doctorList);
      
      // Generate schedule blocks
      generateScheduleBlocks(doctors);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('Error fetching doctors:', err);
    } finally {
      setLoading(false);
    }
  }, [loading, generateScheduleBlocks]);

  // Get schedule blocks for a specific date
  const getScheduleBlocksForDate = useCallback((date: Date): DoctorScheduleBlock[] => {
    const targetDateString = formatDateToISOString(date);
    const matchingBlocks = scheduleBlocks.filter(block => block.date === targetDateString);
    
    // Debug logging
    if (matchingBlocks.length > 0) {
      console.log(`Found ${matchingBlocks.length} blocks for date ${targetDateString}:`, matchingBlocks);
    } else {
      console.log(`No blocks found for date ${targetDateString}. Available blocks:`, scheduleBlocks.slice(0, 3));
    }
    
    return matchingBlocks;
  }, [scheduleBlocks]);

  // Refresh data
  const refreshData = useCallback(async () => {
    await fetchDoctorsAndSchedules();
  }, [fetchDoctorsAndSchedules]);

  // Initial data load
  useEffect(() => {
    fetchDoctorsAndSchedules();
  }, []);

  return {
    scheduleBlocks,
    loading,
    error,
    availableDoctors,
    refreshData,
    getScheduleBlocksForDate,
  };
};