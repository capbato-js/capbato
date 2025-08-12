import { container, injectable, inject } from 'tsyringe';
import type { DoctorDto, ScheduleOverrideDto } from '@nx-starter/application-shared';
import { TOKENS } from '@nx-starter/application-shared';
import type { IDoctorApiService } from '../../../../infrastructure/api/IDoctorApiService';

/**
 * Service to determine the correct doctor assignment for a given date
 * This follows the same logic as the Doctor Schedule Calendar to ensure consistency
 */
@injectable()
export class DoctorAssignmentService {
  private doctorsCache: DoctorDto[] | null = null;
  private scheduleOverridesCache: ScheduleOverrideDto[] | null = null;
  private cacheTimestamp = 0;
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  constructor(
    @inject(TOKENS.DoctorApiService) private readonly doctorApiService: IDoctorApiService
  ) {}

  /**
   * Check if a doctor is scheduled to work on a specific day based on their schedule pattern
   */
  private isDoctorScheduledOnDay(doctor: DoctorDto, dayOfWeek: string): boolean {
    if (!doctor.schedulePattern) {
      return false; // No schedule pattern means not scheduled
    }

    const pattern = doctor.schedulePattern.toUpperCase();
    
    // Handle supported patterns (only MWF and TTH)
    switch (pattern) {
      case 'MWF': {
        return ['MONDAY', 'WEDNESDAY', 'FRIDAY'].includes(dayOfWeek);
      }
      case 'TTH': {
        return ['TUESDAY', 'THURSDAY'].includes(dayOfWeek);
      }
      default:
        return false;
    }
  }

  /**
   * Get day of week from date
   */
  private getDayOfWeek(date: Date): string {
    const days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
    return days[date.getDay()];
  }

  /**
   * Format date to YYYY-MM-DD
   */
  private formatDateToISOString(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  /**
   * Check if cache is valid
   */
  private isCacheValid(): boolean {
    return this.doctorsCache !== null && 
           this.scheduleOverridesCache !== null && 
           (Date.now() - this.cacheTimestamp) < this.CACHE_DURATION;
  }

  /**
   * Load doctors and schedule overrides data
   */
  private async loadData(): Promise<void> {
    if (this.isCacheValid()) {
      return; // Use cached data
    }

    try {
      console.log('🔄 [DoctorAssignmentService] Loading fresh data...');
      
      // Fetch doctors and schedule overrides in parallel
      const [doctors, scheduleOverrides] = await Promise.all([
        this.doctorApiService.getAllDoctors(true, 'full') as Promise<DoctorDto[]>,
        this.doctorApiService.getAllScheduleOverrides()
      ]);

      this.doctorsCache = doctors;
      this.scheduleOverridesCache = scheduleOverrides;
      this.cacheTimestamp = Date.now();
      
      console.log('✅ [DoctorAssignmentService] Data loaded successfully:', {
        doctorCount: doctors.length,
        overrideCount: scheduleOverrides.length
      });
    } catch (error) {
      console.error('❌ [DoctorAssignmentService] Error loading data:', error);
      throw new Error('Failed to load doctor assignment data');
    }
  }

  /**
   * Get the assigned doctor for a specific date
   * Returns the doctor object that should be working on the given date
   * Considers both default schedule patterns and overrides
   */
  async getAssignedDoctorForDate(date: Date): Promise<DoctorDto | null> {
    // Validate input date
    if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
      throw new Error('Invalid date provided');
    }

    await this.loadData();

    if (!this.doctorsCache || !this.scheduleOverridesCache) {
      throw new Error('Failed to load doctor data');
    }

    const dateString = this.formatDateToISOString(date);
    const dayOfWeek = this.getDayOfWeek(date);

    console.log(`🎯 [DoctorAssignmentService] Getting assigned doctor for ${dateString} (${dayOfWeek})`);

    // Check if there's a schedule override for this date
    const scheduleOverride = this.scheduleOverridesCache.find(override => override.date === dateString);
    
    if (scheduleOverride) {
      // Use schedule override
      const assignedDoctor = this.doctorsCache.find(d => d.id === scheduleOverride.assignedDoctorId);
      if (assignedDoctor) {
        console.log(`🔄 [DoctorAssignmentService] Using schedule override: ${assignedDoctor.fullName}`);
        return assignedDoctor;
      } else {
        console.warn(`⚠️ [DoctorAssignmentService] Override doctor not found: ${scheduleOverride.assignedDoctorId}`);
        // Fall through to default schedule logic if override doctor not found
      }
    }

    // Use default schedule patterns
    const scheduledDoctors = this.doctorsCache.filter(doctor => 
      this.isDoctorScheduledOnDay(doctor, dayOfWeek)
    );

    if (scheduledDoctors.length > 0) {
      const assignedDoctor = scheduledDoctors[0]; // Take the first scheduled doctor
      console.log(`📅 [DoctorAssignmentService] Using default schedule: ${assignedDoctor.fullName} (${assignedDoctor.schedulePattern})`);
      return assignedDoctor;
    }

    console.log(`❌ [DoctorAssignmentService] No doctor scheduled for ${dayOfWeek}`);
    return null;
  }

  /**
   * Get the assigned doctor display name for a specific date
   * Returns a formatted string suitable for UI display
   */
  async getAssignedDoctorDisplayName(date: Date): Promise<string> {
    try {
      const doctor = await this.getAssignedDoctorForDate(date);
      
      if (doctor) {
        return `${doctor.fullName} - ${doctor.specialization}`;
      } else {
        return 'No doctor assigned';
      }
    } catch (error) {
      console.error('Error getting assigned doctor display name:', error);
      return 'Error loading doctor assignment';
    }
  }

  /**
   * Get the assigned doctor ID for a specific date
   * Returns the doctor ID that should be working on the given date
   */
  async getAssignedDoctorId(date: Date): Promise<string | null> {
    try {
      const doctor = await this.getAssignedDoctorForDate(date);
      return doctor?.id || null;
    } catch (error) {
      console.error('Error getting assigned doctor ID:', error);
      return null;
    }
  }

  /**
   * Clear the cache to force fresh data on next request
   */
  clearCache(): void {
    this.doctorsCache = null;
    this.scheduleOverridesCache = null;
    this.cacheTimestamp = 0;
  }
}

// Export the class for direct DI container usage
// For backward compatibility, provide a singleton getter
export const doctorAssignmentService = {
  getInstance(): DoctorAssignmentService {
    return container.resolve(DoctorAssignmentService);
  }
};