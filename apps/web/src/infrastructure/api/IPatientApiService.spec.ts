import { describe, it, expect } from 'vitest';
import { 
  IPatientApiService, 
  PatientListResponse, 
  PatientResponse, 
  PatientStatsResponse 
} from './IPatientApiService';
import { 
  CreatePatientCommand,
  UpdatePatientCommand
} from '@nx-starter/application-shared';

describe('IPatientApiService', () => {
  describe('interface contract', () => {
    it('should define all required methods with correct signatures', () => {
      const mockService: IPatientApiService = {
        createPatient: async (command: CreatePatientCommand) => ({
          success: true,
          data: {
            id: 'patient-1',
            patientNumber: 'P001',
            firstName: 'John',
            lastName: 'Doe',
            email: 'john@example.com',
            dateOfBirth: new Date(),
            gender: 'Male',
            contactNumber: '123-456-7890',
            address: '123 Main St',
            emergencyContact: 'Jane Doe',
            emergencyContactNumber: '987-654-3210',
            createdAt: new Date(),
            updatedAt: new Date()
          }
        } as PatientResponse),
        updatePatient: async (command: UpdatePatientCommand) => ({
          success: true,
          data: {} as any
        } as PatientResponse),
        getAllPatients: async () => ({
          success: true,
          data: []
        } as PatientListResponse),
        getPatientById: async (id: string) => ({
          success: true,
          data: {} as any
        } as PatientResponse),
        getPatientStats: async () => ({
          success: true,
          data: {
            totalPatients: 100,
            activePatients: 95,
            newPatientsThisMonth: 10,
            averageAge: 35.5
          }
        } as PatientStatsResponse)
      };

      expect(mockService.createPatient).toBeDefined();
      expect(mockService.updatePatient).toBeDefined();
      expect(mockService.getAllPatients).toBeDefined();
      expect(mockService.getPatientById).toBeDefined();
      expect(mockService.getPatientStats).toBeDefined();

      expect(typeof mockService.createPatient).toBe('function');
      expect(typeof mockService.updatePatient).toBe('function');
      expect(typeof mockService.getAllPatients).toBe('function');
      expect(typeof mockService.getPatientById).toBe('function');
      expect(typeof mockService.getPatientStats).toBe('function');
    });

    it('should ensure all methods return Promises', async () => {
      const mockService: IPatientApiService = {
        createPatient: async () => ({ success: true, data: {} as any }),
        updatePatient: async () => ({ success: true, data: {} as any }),
        getAllPatients: async () => ({ success: true, data: [] }),
        getPatientById: async () => ({ success: true, data: {} as any }),
        getPatientStats: async () => ({ success: true, data: {} as any })
      };

      const createResult = mockService.createPatient({} as CreatePatientCommand);
      const updateResult = mockService.updatePatient({} as UpdatePatientCommand);
      const getAllResult = mockService.getAllPatients();
      const getByIdResult = mockService.getPatientById('patient-1');
      const getStatsResult = mockService.getPatientStats();

      expect(createResult).toBeInstanceOf(Promise);
      expect(updateResult).toBeInstanceOf(Promise);
      expect(getAllResult).toBeInstanceOf(Promise);
      expect(getByIdResult).toBeInstanceOf(Promise);
      expect(getStatsResult).toBeInstanceOf(Promise);

      await expect(createResult).resolves.toBeDefined();
      await expect(updateResult).resolves.toBeDefined();
      await expect(getAllResult).resolves.toBeDefined();
      await expect(getByIdResult).resolves.toBeDefined();
      await expect(getStatsResult).resolves.toBeDefined();
    });

    it('should define response type interfaces correctly', () => {
      // Test that response interfaces have expected structure
      const patientListResponse: PatientListResponse = {
        success: true,
        data: [],
        message: 'Optional message'
      };

      const patientResponse: PatientResponse = {
        success: true,
        data: {} as any,
        message: 'Optional message'
      };

      const patientStatsResponse: PatientStatsResponse = {
        success: true,
        data: {} as any,
        message: 'Optional message'
      };

      expect(patientListResponse.success).toBe(true);
      expect(patientListResponse.data).toBeInstanceOf(Array);
      expect(patientListResponse.message).toBe('Optional message');

      expect(patientResponse.success).toBe(true);
      expect(patientResponse.data).toBeDefined();
      expect(patientResponse.message).toBe('Optional message');

      expect(patientStatsResponse.success).toBe(true);
      expect(patientStatsResponse.data).toBeDefined();
      expect(patientStatsResponse.message).toBe('Optional message');
    });
  });
});