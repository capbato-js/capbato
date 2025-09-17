import { describe, it, expect } from 'vitest';
import { IDoctorApiService } from './IDoctorApiService';
import { 
  DoctorDto, 
  DoctorSummaryDto, 
  CreateDoctorProfileCommand, 
  DoctorOperationResponse,
  CreateScheduleOverrideRequestDto,
  UpdateScheduleOverrideRequestDto,
  ScheduleOverrideDto
} from '@nx-starter/application-shared';

describe('IDoctorApiService', () => {
  describe('interface contract', () => {
    it('should define getAllDoctors method with correct signature', () => {
      const mockService: IDoctorApiService = {
        getAllDoctors: async (activeOnly?: boolean, format?: 'full' | 'summary') => [],
        getDoctorById: async (id: string) => ({} as DoctorDto),
        getDoctorByUserId: async (userId: string) => ({} as DoctorDto),
        getDoctorsBySpecialization: async (specialization: string, activeOnly?: boolean) => [],
        checkDoctorProfileExists: async (userId: string) => false,
        createDoctorProfile: async (command: CreateDoctorProfileCommand) => ({ success: true } as DoctorOperationResponse),
        getAllScheduleOverrides: async () => [],
        createScheduleOverride: async (request: CreateScheduleOverrideRequestDto) => ({ success: true } as DoctorOperationResponse),
        updateScheduleOverride: async (id: string, request: UpdateScheduleOverrideRequestDto) => ({ success: true } as DoctorOperationResponse),
        deleteScheduleOverride: async (date: string) => ({ success: true } as DoctorOperationResponse)
      };

      expect(mockService.getAllDoctors).toBeDefined();
      expect(typeof mockService.getAllDoctors).toBe('function');
    });

    it('should define getDoctorById method with correct signature', () => {
      const mockService: IDoctorApiService = {
        getAllDoctors: async () => [],
        getDoctorById: async (id: string) => ({
          id,
          userId: 'user-id',
          firstName: 'John',
          lastName: 'Doe',
          specialization: 'General Medicine',
          licenseNumber: 'LIC123',
          contactNumber: '123-456-7890',
          email: 'doctor@example.com',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        } as DoctorDto),
        getDoctorByUserId: async (userId: string) => ({} as DoctorDto),
        getDoctorsBySpecialization: async (specialization: string, activeOnly?: boolean) => [],
        checkDoctorProfileExists: async (userId: string) => false,
        createDoctorProfile: async (command: CreateDoctorProfileCommand) => ({ success: true } as DoctorOperationResponse),
        getAllScheduleOverrides: async () => [],
        createScheduleOverride: async (request: CreateScheduleOverrideRequestDto) => ({ success: true } as DoctorOperationResponse),
        updateScheduleOverride: async (id: string, request: UpdateScheduleOverrideRequestDto) => ({ success: true } as DoctorOperationResponse),
        deleteScheduleOverride: async (date: string) => ({ success: true } as DoctorOperationResponse)
      };

      expect(mockService.getDoctorById).toBeDefined();
      expect(typeof mockService.getDoctorById).toBe('function');
    });

    it('should define getDoctorByUserId method with correct signature', () => {
      const mockService: IDoctorApiService = {
        getAllDoctors: async () => [],
        getDoctorById: async (id: string) => ({} as DoctorDto),
        getDoctorByUserId: async (userId: string) => ({
          id: 'doctor-id',
          userId,
          firstName: 'Jane',
          lastName: 'Smith',
          specialization: 'Pediatrics',
          licenseNumber: 'LIC456',
          contactNumber: '987-654-3210',
          email: 'jane@example.com',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        } as DoctorDto),
        getDoctorsBySpecialization: async (specialization: string, activeOnly?: boolean) => [],
        checkDoctorProfileExists: async (userId: string) => false,
        createDoctorProfile: async (command: CreateDoctorProfileCommand) => ({ success: true } as DoctorOperationResponse),
        getAllScheduleOverrides: async () => [],
        createScheduleOverride: async (request: CreateScheduleOverrideRequestDto) => ({ success: true } as DoctorOperationResponse),
        updateScheduleOverride: async (id: string, request: UpdateScheduleOverrideRequestDto) => ({ success: true } as DoctorOperationResponse),
        deleteScheduleOverride: async (date: string) => ({ success: true } as DoctorOperationResponse)
      };

      expect(mockService.getDoctorByUserId).toBeDefined();
      expect(typeof mockService.getDoctorByUserId).toBe('function');
    });

    it('should define checkDoctorProfileExists method with correct signature', () => {
      const mockService: IDoctorApiService = {
        getAllDoctors: async () => [],
        getDoctorById: async (id: string) => ({} as DoctorDto),
        getDoctorByUserId: async (userId: string) => ({} as DoctorDto),
        getDoctorsBySpecialization: async (specialization: string, activeOnly?: boolean) => [],
        checkDoctorProfileExists: async (userId: string) => userId === 'existing-user',
        createDoctorProfile: async (command: CreateDoctorProfileCommand) => ({ success: true } as DoctorOperationResponse),
        getAllScheduleOverrides: async () => [],
        createScheduleOverride: async (request: CreateScheduleOverrideRequestDto) => ({ success: true } as DoctorOperationResponse),
        updateScheduleOverride: async (id: string, request: UpdateScheduleOverrideRequestDto) => ({ success: true } as DoctorOperationResponse),
        deleteScheduleOverride: async (date: string) => ({ success: true } as DoctorOperationResponse)
      };

      expect(mockService.checkDoctorProfileExists).toBeDefined();
      expect(typeof mockService.checkDoctorProfileExists).toBe('function');
    });

    it('should define schedule override methods with correct signatures', () => {
      const mockService: IDoctorApiService = {
        getAllDoctors: async () => [],
        getDoctorById: async (id: string) => ({} as DoctorDto),
        getDoctorByUserId: async (userId: string) => ({} as DoctorDto),
        getDoctorsBySpecialization: async (specialization: string, activeOnly?: boolean) => [],
        checkDoctorProfileExists: async (userId: string) => false,
        createDoctorProfile: async (command: CreateDoctorProfileCommand) => ({ success: true } as DoctorOperationResponse),
        getAllScheduleOverrides: async () => [{
          id: 'override-1',
          date: '2024-01-01',
          doctorId: 'doctor-1',
          startTime: '09:00',
          endTime: '17:00',
          reason: 'Special clinic',
          createdAt: new Date(),
          updatedAt: new Date()
        }] as ScheduleOverrideDto[],
        createScheduleOverride: async (request: CreateScheduleOverrideRequestDto) => ({ 
          success: true,
          data: { id: 'new-override' }
        } as DoctorOperationResponse),
        updateScheduleOverride: async (id: string, request: UpdateScheduleOverrideRequestDto) => ({ 
          success: true 
        } as DoctorOperationResponse),
        deleteScheduleOverride: async (date: string) => ({ 
          success: true 
        } as DoctorOperationResponse)
      };

      expect(mockService.getAllScheduleOverrides).toBeDefined();
      expect(mockService.createScheduleOverride).toBeDefined();
      expect(mockService.updateScheduleOverride).toBeDefined();
      expect(mockService.deleteScheduleOverride).toBeDefined();
      
      expect(typeof mockService.getAllScheduleOverrides).toBe('function');
      expect(typeof mockService.createScheduleOverride).toBe('function');
      expect(typeof mockService.updateScheduleOverride).toBe('function');
      expect(typeof mockService.deleteScheduleOverride).toBe('function');
    });

    it('should ensure all methods return Promises', async () => {
      const mockService: IDoctorApiService = {
        getAllDoctors: async () => [],
        getDoctorById: async () => ({} as DoctorDto),
        getDoctorByUserId: async () => ({} as DoctorDto),
        getDoctorsBySpecialization: async () => [],
        checkDoctorProfileExists: async () => true,
        createDoctorProfile: async () => ({ success: true } as DoctorOperationResponse),
        getAllScheduleOverrides: async () => [],
        createScheduleOverride: async () => ({ success: true } as DoctorOperationResponse),
        updateScheduleOverride: async () => ({ success: true } as DoctorOperationResponse),
        deleteScheduleOverride: async () => ({ success: true } as DoctorOperationResponse)
      };

      // Test that all methods return promises
      const getAllResult = mockService.getAllDoctors();
      const getByIdResult = mockService.getDoctorById('test-id');
      const getByUserIdResult = mockService.getDoctorByUserId('user-id');
      const getBySpecResult = mockService.getDoctorsBySpecialization('Cardiology');
      const checkExistsResult = mockService.checkDoctorProfileExists('user-id');
      const createResult = mockService.createDoctorProfile({} as CreateDoctorProfileCommand);
      const getAllOverridesResult = mockService.getAllScheduleOverrides();
      const createOverrideResult = mockService.createScheduleOverride({} as CreateScheduleOverrideRequestDto);
      const updateOverrideResult = mockService.updateScheduleOverride('id', {} as UpdateScheduleOverrideRequestDto);
      const deleteOverrideResult = mockService.deleteScheduleOverride('2024-01-01');

      expect(getAllResult).toBeInstanceOf(Promise);
      expect(getByIdResult).toBeInstanceOf(Promise);
      expect(getByUserIdResult).toBeInstanceOf(Promise);
      expect(getBySpecResult).toBeInstanceOf(Promise);
      expect(checkExistsResult).toBeInstanceOf(Promise);
      expect(createResult).toBeInstanceOf(Promise);
      expect(getAllOverridesResult).toBeInstanceOf(Promise);
      expect(createOverrideResult).toBeInstanceOf(Promise);
      expect(updateOverrideResult).toBeInstanceOf(Promise);
      expect(deleteOverrideResult).toBeInstanceOf(Promise);

      await expect(getAllResult).resolves.toBeDefined();
      await expect(getByIdResult).resolves.toBeDefined();
      await expect(getByUserIdResult).resolves.toBeDefined();
      await expect(getBySpecResult).resolves.toBeDefined();
      await expect(checkExistsResult).resolves.toBeDefined();
      await expect(createResult).resolves.toBeDefined();
      await expect(getAllOverridesResult).resolves.toBeDefined();
      await expect(createOverrideResult).resolves.toBeDefined();
      await expect(updateOverrideResult).resolves.toBeDefined();
      await expect(deleteOverrideResult).resolves.toBeDefined();
    });
  });
});