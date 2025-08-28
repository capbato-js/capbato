import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import type { DoctorDto, ScheduleOverrideDto } from '@nx-starter/application-shared';

// Mock the DoctorApiService
const mockDoctorApiService = {
  getAllDoctors: vi.fn(),
  getAllScheduleOverrides: vi.fn(),
};

// Create a testable version of the service without dependency injection
class TestDoctorAssignmentService {
  private doctorsCache: DoctorDto[] | null = null;
  private scheduleOverridesCache: ScheduleOverrideDto[] | null = null;
  private cacheTimestamp = 0;
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  constructor(private readonly doctorApiService: any) {}

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
   * Check if cache is valid
   */
  private isCacheValid(): boolean {
    return (
      this.doctorsCache !== null &&
      this.scheduleOverridesCache !== null &&
      (Date.now() - this.cacheTimestamp) < this.CACHE_DURATION
    );
  }

  /**
   * Load doctors and schedule overrides data
   * This method fetches fresh data from the API and updates the cache
   */
  async loadData(): Promise<void> {
    try {
      console.log('🔄 [DoctorAssignmentService] Loading doctor assignment data...');
      
      // Fetch doctors and schedule overrides in parallel
      const [doctors, scheduleOverrides] = await Promise.all([
        this.doctorApiService.getAllDoctors(true, 'full') as Promise<DoctorDto[]>,
        this.doctorApiService.getAllScheduleOverrides()
      ]);

      this.doctorsCache = doctors;
      this.scheduleOverridesCache = scheduleOverrides;
      this.cacheTimestamp = Date.now();
      
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
    // Load data if cache is invalid
    if (!this.isCacheValid()) {
      await this.loadData();
    }

    const dateString = date.toISOString().split('T')[0]; // YYYY-MM-DD format
    const dayOfWeek = this.getDayOfWeek(date);

    console.log(`🔍 [DoctorAssignmentService] Getting doctor assignment for ${dateString} (${dayOfWeek})`);

    // First check for schedule overrides
    const override = this.scheduleOverridesCache?.find(override => override.date === dateString);
    if (override) {
      const overrideDoctor = this.doctorsCache?.find(doctor => doctor.id === override.assignedDoctorId);
      if (overrideDoctor) {
        console.log(`🔀 [DoctorAssignmentService] Found override: ${overrideDoctor.fullName} (${overrideDoctor.specialization})`);
        return overrideDoctor;
      }
    }

    // Find doctor scheduled for this day based on their schedule pattern
    const scheduledDoctor = this.doctorsCache?.find(doctor => 
      this.isDoctorScheduledOnDay(doctor, dayOfWeek)
    );

    if (scheduledDoctor) {
      console.log(`📅 [DoctorAssignmentService] Regular schedule: ${scheduledDoctor.fullName} (${scheduledDoctor.specialization})`);
      return scheduledDoctor;
    }

    console.log(`❌ [DoctorAssignmentService] No doctor assigned for ${dayOfWeek}`);
    return null;
  }

  /**
   * Get formatted display name for assigned doctor
   */
  async getAssignedDoctorDisplayName(date: Date): Promise<string> {
    try {
      const doctor = await this.getAssignedDoctorForDate(date);
      if (doctor) {
        return `${doctor.fullName} - ${doctor.specialization}`;
      }
      return 'No doctor assigned';
    } catch (error) {
      console.error('❌ [DoctorAssignmentService] Error getting doctor display name:', error);
      return 'Error loading doctor assignment';
    }
  }

  /**
   * Get assigned doctor ID for a specific date
   */
  async getAssignedDoctorId(date: Date): Promise<string | null> {
    try {
      const doctor = await this.getAssignedDoctorForDate(date);
      return doctor?.id || null;
    } catch (error) {
      console.error('❌ [DoctorAssignmentService] Error getting doctor ID:', error);
      return null;
    }
  }

  /**
   * Clear the cache
   * This forces a fresh load of data on the next request
   */
  clearCache(): void {
    console.log('🗑️ [DoctorAssignmentService] Clearing cache...');
    this.doctorsCache = null;
    this.scheduleOverridesCache = null;
    this.cacheTimestamp = 0;
  }

  /**
   * Get cached doctors (for testing/debugging)
   */
  getCachedDoctors(): DoctorDto[] | null {
    return this.doctorsCache;
  }

  /**
   * Get cached schedule overrides (for testing/debugging)
   */
  getCachedScheduleOverrides(): ScheduleOverrideDto[] | null {
    return this.scheduleOverridesCache;
  }
}

describe('DoctorAssignmentService', () => {
  let service: TestDoctorAssignmentService;
  
  // Mock data
  const mockDoctors: DoctorDto[] = [
    {
      id: 'doctor1',
      fullName: 'Dr. John Smith',
      specialization: 'General Physician',
      schedulePattern: 'MWF',
      schedulePatternDescription: 'Monday, Wednesday, Friday',
    } as DoctorDto,
    {
      id: 'doctor2', 
      fullName: 'Dr. Jane Johnson',
      specialization: 'Internal Medicine',
      schedulePattern: 'TTH',
      schedulePatternDescription: 'Tuesday, Thursday',
    } as DoctorDto,
  ];

  const mockScheduleOverrides: ScheduleOverrideDto[] = [
    {
      id: 'override1',
      date: '2024-01-15', // Monday - would normally be doctor1 (MWF)
      assignedDoctorId: 'doctor2', // Override to doctor2
      originalDoctorId: 'doctor1',
      reason: 'Manual override for testing',
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
    } as ScheduleOverrideDto,
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    service = new TestDoctorAssignmentService(mockDoctorApiService);
    
    // Setup default mock returns
    mockDoctorApiService.getAllDoctors.mockResolvedValue(mockDoctors);
    mockDoctorApiService.getAllScheduleOverrides.mockResolvedValue(mockScheduleOverrides);
  });

  afterEach(() => {
    // Clear cache after each test
    service.clearCache();
  });

  describe('getAssignedDoctorForDate', () => {
    it('should return correct doctor for MWF schedule on Monday', async () => {
      // Arrange
      const monday = new Date('2024-01-01'); // Monday

      // Act
      const result = await service.getAssignedDoctorForDate(monday);

      // Assert
      expect(result).toEqual(mockDoctors[0]); // Dr. Smith (MWF)
      expect(mockDoctorApiService.getAllDoctors).toHaveBeenCalledWith(true, 'full');
      expect(mockDoctorApiService.getAllScheduleOverrides).toHaveBeenCalled();
    });

    it('should return correct doctor for TTH schedule on Tuesday', async () => {
      // Arrange  
      const tuesday = new Date('2024-01-02'); // Tuesday

      // Act
      const result = await service.getAssignedDoctorForDate(tuesday);

      // Assert
      expect(result).toEqual(mockDoctors[1]); // Dr. Johnson (TTH)
    });

    it('should return correct doctor for MWF schedule on Wednesday', async () => {
      // Arrange
      const wednesday = new Date('2024-01-03'); // Wednesday

      // Act
      const result = await service.getAssignedDoctorForDate(wednesday);

      // Assert
      expect(result).toEqual(mockDoctors[0]); // Dr. Smith (MWF)
    });

    it('should return correct doctor for TTH schedule on Thursday', async () => {
      // Arrange
      const thursday = new Date('2024-01-04'); // Thursday

      // Act
      const result = await service.getAssignedDoctorForDate(thursday);

      // Assert
      expect(result).toEqual(mockDoctors[1]); // Dr. Johnson (TTH)
    });

    it('should return correct doctor for MWF schedule on Friday', async () => {
      // Arrange
      const friday = new Date('2024-01-05'); // Friday

      // Act
      const result = await service.getAssignedDoctorForDate(friday);

      // Assert
      expect(result).toEqual(mockDoctors[0]); // Dr. Smith (MWF)
    });

    it('should return null for weekend days with no scheduled doctors', async () => {
      // Arrange
      const saturday = new Date('2024-01-06'); // Saturday
      const sunday = new Date('2024-01-07'); // Sunday

      // Act & Assert
      expect(await service.getAssignedDoctorForDate(saturday)).toBeNull();
      expect(await service.getAssignedDoctorForDate(sunday)).toBeNull();
    });

    it('should respect schedule override when one exists', async () => {
      // Arrange
      const overrideDate = new Date('2024-01-15'); // Monday with override to doctor2

      // Act
      const result = await service.getAssignedDoctorForDate(overrideDate);

      // Assert
      expect(result).toEqual(mockDoctors[1]); // Dr. Johnson due to override
    });

    it('should handle invalid dates gracefully', async () => {
      // Arrange
      const invalidDate = new Date('invalid');

      // Act & Assert
      await expect(service.getAssignedDoctorForDate(invalidDate)).rejects.toThrow();
    });
  });

  describe('getAssignedDoctorDisplayName', () => {
    it('should return formatted display name for assigned doctor', async () => {
      // Arrange
      const monday = new Date('2024-01-01'); // Monday

      // Act
      const result = await service.getAssignedDoctorDisplayName(monday);

      // Assert
      expect(result).toBe('Dr. John Smith - General Physician');
    });

    it('should return "No doctor assigned" when no doctor is scheduled', async () => {
      // Arrange
      const saturday = new Date('2024-01-06'); // Saturday

      // Act
      const result = await service.getAssignedDoctorDisplayName(saturday);

      // Assert
      expect(result).toBe('No doctor assigned');
    });

    it('should return error message when API call fails', async () => {
      // Arrange
      const monday = new Date('2024-01-01');
      mockDoctorApiService.getAllDoctors.mockRejectedValue(new Error('API Error'));

      // Act
      const result = await service.getAssignedDoctorDisplayName(monday);

      // Assert
      expect(result).toBe('Error loading doctor assignment');
    });
  });

  describe('getAssignedDoctorId', () => {
    it('should return doctor ID for assigned doctor', async () => {
      // Arrange
      const monday = new Date('2024-01-01'); // Monday

      // Act
      const result = await service.getAssignedDoctorId(monday);

      // Assert
      expect(result).toBe('doctor1');
    });

    it('should return null when no doctor is scheduled', async () => {
      // Arrange
      const saturday = new Date('2024-01-06'); // Saturday

      // Act
      const result = await service.getAssignedDoctorId(saturday);

      // Assert
      expect(result).toBeNull();
    });
  });

  describe('caching', () => {
    it('should cache API responses and not call API again within cache duration', async () => {
      // Arrange
      const monday = new Date('2024-01-01');

      // Act - First call
      await service.getAssignedDoctorForDate(monday);
      
      // Act - Second call
      await service.getAssignedDoctorForDate(monday);

      // Assert - API should only be called once due to caching
      expect(mockDoctorApiService.getAllDoctors).toHaveBeenCalledTimes(1);
      expect(mockDoctorApiService.getAllScheduleOverrides).toHaveBeenCalledTimes(1);
    });

    it('should clear cache when clearCache is called', async () => {
      // Arrange
      const monday = new Date('2024-01-01');

      // Act - First call
      await service.getAssignedDoctorForDate(monday);
      
      // Clear cache
      service.clearCache();
      
      // Act - Second call after cache clear
      await service.getAssignedDoctorForDate(monday);

      // Assert - API should be called twice due to cache clearing
      expect(mockDoctorApiService.getAllDoctors).toHaveBeenCalledTimes(2);
      expect(mockDoctorApiService.getAllScheduleOverrides).toHaveBeenCalledTimes(2);
    });
  });
});