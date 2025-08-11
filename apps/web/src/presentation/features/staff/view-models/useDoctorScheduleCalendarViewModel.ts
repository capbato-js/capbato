import { useState, useEffect, useCallback } from 'react';
import { container } from 'tsyringe';
import { DoctorApiService } from '../../../../infrastructure/api/DoctorApiService';
import type { DoctorDto, ScheduleOverrideDto } from '@nx-starter/application-shared';

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
  isOverride?: boolean; // New field to indicate if this is an override
  originalDoctorId?: string; // Track original doctor if this is an override
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
  
  // Handle supported patterns (only MWF and TTH)
  switch (pattern) {
    case 'MWF': {
      const isMWF = ['MONDAY', 'WEDNESDAY', 'FRIDAY'].includes(dayOfWeek);
      console.log(`MWF check for ${dayOfWeek}: ${isMWF}`);
      return isMWF;
    }
    case 'TTH': {
      const isTTH = ['TUESDAY', 'THURSDAY'].includes(dayOfWeek);
      console.log(`TTH check for ${dayOfWeek}: ${isTTH}`);
      return isTTH;
    }
    default:
      console.log(`Unsupported pattern: ${pattern}. Only MWF and TTH are supported.`);
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
  endDate: Date,
  scheduleOverrides: ScheduleOverrideDto[] = []
): DoctorScheduleBlock[] => {
  console.log('🔄 [DEBUG] Starting generateDoctorScheduleBlocks with:', {
    doctorCount: doctors.length,
    startDate: startDate.toDateString(),
    endDate: endDate.toDateString(),
    overrideCount: scheduleOverrides.length,
    doctors: doctors.map(d => ({ name: d.fullName, pattern: d.schedulePattern })),
    overrides: scheduleOverrides.map(o => ({ date: o.date, assignedDoctorId: o.assignedDoctorId }))
  });

  const blocks: DoctorScheduleBlock[] = [];
  const current = new Date(startDate);

  let dayCount = 0;
  while (current <= endDate) {
    dayCount++;
    const dateString = formatDateToISOString(current);
    const dayOfWeek = getDayOfWeek(current);

    console.log(`📅 [DEBUG] Processing day ${dayCount}: ${dateString} (${dayOfWeek})`);

    // Check if there's a schedule override for this date
    const scheduleOverride = scheduleOverrides.find(override => override.date === dateString);
    
    if (scheduleOverride) {
      // Use schedule override
      const assignedDoctor = doctors.find(d => d.id === scheduleOverride.assignedDoctorId);
      if (assignedDoctor) {
        const block = {
          id: `schedule-override-${assignedDoctor.id}-${dateString}`,
          doctorId: assignedDoctor.id,
          doctorName: assignedDoctor.fullName,
          date: dateString,
          schedulePattern: 'OVERRIDE',
          schedulePatternDescription: `Schedule Override: ${scheduleOverride.reason}`,
        };
        
        console.log(`🔄 [DEBUG] Using schedule override:`, {
          date: dateString,
          originalDoctorId: scheduleOverride.originalDoctorId,
          assignedDoctorId: scheduleOverride.assignedDoctorId,
          assignedDoctorName: assignedDoctor.fullName,
          reason: scheduleOverride.reason
        });
        blocks.push(block);
      }
    } else {
      // Use default schedule patterns
      for (const doctor of doctors) {
        // Check if doctor is scheduled to work on this day
        const isScheduled = isDoctorScheduledOnDay(doctor, dayOfWeek);
        console.log(`👨‍⚕️ [DEBUG] ${doctor.fullName} on ${dayOfWeek}: ${isScheduled ? 'SCHEDULED' : 'not scheduled'}`);
        
        if (isScheduled) {
          const block = {
            id: `schedule-${doctor.id}-${dateString}`,
            doctorId: doctor.id,
            doctorName: doctor.fullName,
            date: dateString,
            schedulePattern: doctor.schedulePattern || 'Unknown',
            schedulePatternDescription: doctor.schedulePatternDescription || 'No schedule pattern',
          };
          
          console.log(`✅ [DEBUG] Created schedule block:`, block);
          blocks.push(block);
        }
      }
    }

    current.setDate(current.getDate() + 1);
  }

  console.log('🏁 [DEBUG] Finished generating schedule blocks:', {
    totalBlocks: blocks.length,
    blocksByDate: blocks.reduce((acc, block) => {
      acc[block.date] = (acc[block.date] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  });

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

  // Get the API service instance
  const doctorApiService = container.resolve(DoctorApiService);

  // Generate schedule blocks from doctor data
  const generateScheduleBlocks = useCallback((doctors: DoctorDto[], scheduleOverrides: ScheduleOverrideDto[] = []) => {
    console.log('🗓️ [DEBUG] Generating schedule blocks from doctors:', doctors);
    console.log('🔄 [DEBUG] Using schedule overrides:', scheduleOverrides);
    
    // Generate schedule blocks for the current month
    const currentDate = new Date();
    const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    
    console.log('📅 [DEBUG] Date range for schedule generation:', {
      currentDate: currentDate.toDateString(),
      startDate: startDate.toDateString(),
      endDate: endDate.toDateString(),
      currentMonth: currentDate.getMonth() + 1,
      currentYear: currentDate.getFullYear()
    });
    
    const blocks = generateDoctorScheduleBlocks(doctors, startDate, endDate, scheduleOverrides);
    
    console.log('✨ [DEBUG] Generated schedule blocks:', {
      totalBlocks: blocks.length,
      sampleBlocks: blocks.slice(0, 5),
      blocksByDoctor: blocks.reduce((acc, block) => {
        acc[block.doctorName] = (acc[block.doctorName] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    });
    
    setScheduleBlocks(blocks);
  }, []);

  // Fetch doctors and generate schedule blocks
  const fetchDoctorsAndSchedules = useCallback(async () => {
    if (loading) return; // Prevent concurrent calls
    
    setLoading(true);
    setError(null);
    
    try {
      console.log('🔄 [DEBUG] Starting to fetch doctors data...');
      
      // Fetch doctors
      const doctors = await doctorApiService.getAllDoctors(true, 'full') as DoctorDto[];
      console.log('✅ [DEBUG] Doctors data fetched successfully:', {
        count: doctors.length,
        doctors: doctors.map(d => ({
          id: d.id,
          name: d.fullName,
          schedulePattern: d.schedulePattern,
          schedulePatternDescription: d.schedulePatternDescription
        }))
      });

      // Fetch schedule overrides
      console.log('🔄 [DEBUG] Starting to fetch schedule overrides...');
      const scheduleOverrides = await doctorApiService.getAllScheduleOverrides();
      console.log('✅ [DEBUG] Schedule overrides fetched successfully:', {
        count: scheduleOverrides.length,
        overrides: scheduleOverrides.map(o => ({
          id: o.id,
          assignedDoctorId: o.assignedDoctorId,
          date: o.date,
          reason: o.reason
        }))
      });
      
      // Process available doctors list
      const doctorList = doctors.map(doctor => ({
        id: doctor.id,
        name: doctor.fullName || `${doctor.firstName || 'Unknown'} ${doctor.lastName || 'Doctor'}`,
        schedulePattern: doctor.schedulePattern,
        schedulePatternDescription: doctor.schedulePatternDescription
      }));
      
      console.log('📋 [DEBUG] Processed available doctors list:', doctorList);
      setAvailableDoctors(doctorList);
      
      // Generate schedule blocks
      console.log('🗓️ [DEBUG] About to generate schedule blocks...');
      generateScheduleBlocks(doctors, scheduleOverrides);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      console.error('❌ [DEBUG] Error fetching doctors:', err);
      setError(errorMessage);
    } finally {
      setLoading(false);
      console.log('🏁 [DEBUG] Finished fetching doctors and schedules');
    }
  }, [loading, generateScheduleBlocks]);

  // Get schedule blocks for a specific date
  const getScheduleBlocksForDate = useCallback((date: Date): DoctorScheduleBlock[] => {
    const targetDateString = formatDateToISOString(date);
    const matchingBlocks = scheduleBlocks.filter(block => block.date === targetDateString);
    
    // Debug logging with more detail
    console.log(`🔍 [DEBUG] getScheduleBlocksForDate for ${targetDateString} (${date.toDateString()}):`, {
      requestedDate: targetDateString,
      totalAvailableBlocks: scheduleBlocks.length,
      matchingBlocks: matchingBlocks.length,
      matches: matchingBlocks.map(b => ({ doctor: b.doctorName, pattern: b.schedulePattern })),
      allBlockDates: [...new Set(scheduleBlocks.map(b => b.date))].slice(0, 10)
    });
    
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