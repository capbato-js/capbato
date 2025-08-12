import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { DoctorAssignmentService } from './DoctorAssignmentService';
import type { DoctorDto, ScheduleOverrideDto } from '@nx-starter/application-shared';

// Mock the DoctorApiService
const mockDoctorApiService = {
  getAllDoctors: vi.fn(),
  getAllScheduleOverrides: vi.fn(),
};

// Mock tsyringe container
vi.mock('tsyringe', () => ({
  container: {
    resolve: vi.fn(() => mockDoctorApiService),
  },
}));

describe('DoctorAssignmentService', () => {
  let service: DoctorAssignmentService;
  
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
    service = new DoctorAssignmentService();
    
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