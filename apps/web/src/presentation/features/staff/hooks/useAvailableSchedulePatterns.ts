import { useState, useEffect } from 'react';
import { container } from '../../../../infrastructure/di/container';
import { IDoctorApiService } from '../../../../infrastructure/api/IDoctorApiService';
import { DoctorDto, TOKENS } from '@nx-starter/application-shared';

interface SchedulePatternOption {
  value: string;
  label: string;
  available: boolean;
  takenBy?: string;
}

/**
 * Hook to fetch available schedule patterns based on existing doctors
 */
export const useAvailableSchedulePatterns = () => {
  const [scheduleOptions, setScheduleOptions] = useState<SchedulePatternOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDoctorsAndFilterPatterns = async () => {
      setLoading(true);
      setError(null);

      try {
        const doctorApiService = container.resolve<IDoctorApiService>(TOKENS.DoctorApiService);
        const doctors = await doctorApiService.getAllDoctors(true, 'full') as DoctorDto[];

        // Get taken schedule patterns
        const takenPatterns = doctors.reduce((acc, doctor) => {
          if (doctor.schedulePattern) {
            acc[doctor.schedulePattern] = doctor.fullName || `${doctor.firstName} ${doctor.lastName}`;
          }
          return acc;
        }, {} as Record<string, string>);

        // Define all possible schedule patterns (only MWF and TTH)
        const allPatterns: SchedulePatternOption[] = [
          { 
            value: 'MWF', 
            label: 'MWF (Monday, Wednesday, Friday)',
            available: !takenPatterns['MWF'],
            takenBy: takenPatterns['MWF']
          },
          { 
            value: 'TTH', 
            label: 'TTH (Tuesday, Thursday)',
            available: !takenPatterns['TTH'],
            takenBy: takenPatterns['TTH']
          }
        ];

        setScheduleOptions(allPatterns);
      } catch (err) {
        console.error('Error fetching doctors for schedule pattern filtering:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch schedule patterns');
        
        // Fallback: return all patterns as available
        setScheduleOptions([
          { value: 'MWF', label: 'MWF (Monday, Wednesday, Friday)', available: true },
          { value: 'TTH', label: 'TTH (Tuesday, Thursday)', available: true }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorsAndFilterPatterns();
  }, []);

  return { scheduleOptions, loading, error };
};
