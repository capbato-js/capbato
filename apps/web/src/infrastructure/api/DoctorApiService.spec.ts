import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DoctorApiService } from './DoctorApiService';
import { IHttpClient } from '../http/IHttpClient';
import { 
  DoctorDto, 
  DoctorSummaryDto, 
  DoctorListResponse, 
  DoctorSummaryListResponse, 
  DoctorResponse, 
  DoctorOperationResponse, 
  CreateDoctorProfileCommand, 
  CreateScheduleOverrideRequestDto,
  UpdateScheduleOverrideRequestDto,
  ScheduleOverrideDto,
  ScheduleOverrideListResponse,
  TOKENS 
} from '@nx-starter/application-shared';

// Mock API config
vi.mock('./config/ApiConfig', () => ({
  getApiConfig: () => ({
    endpoints: {
      doctors: {
        all: '/api/doctors',
        byId: (id: string) => `/api/doctors/${id}`,
        byUserId: (userId: string) => `/api/doctors/user/${userId}`,
        bySpecialization: (specialization: string) => `/api/doctors/specialization/${specialization}`,
        exists: (userId: string) => `/api/doctors/exists/${userId}`,
        create: '/api/doctors',
        scheduleOverrides: {
          all: '/api/doctors/schedule-overrides',
          create: '/api/doctors/schedule-overrides',
          update: (id: string) => `/api/doctors/schedule-overrides/${id}`,
          deleteByDate: (date: string) => `/api/doctors/schedule-overrides/date/${date}`
        }
      }
    }
  })
}));

describe('DoctorApiService', () => {
  let doctorService: DoctorApiService;
  let mockHttpClient: IHttpClient;

  beforeEach(() => {
    mockHttpClient = {
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      delete: vi.fn()
    };

    doctorService = new DoctorApiService(mockHttpClient);
  });

  describe('getAllDoctors', () => {
    it('should get all active doctors in full format by default', async () => {
      const mockResponse: DoctorListResponse = {
        success: true,
        data: [
          {
            id: 'doctor-1',
            userId: 'user-1',
            firstName: 'John',
            lastName: 'Doe',
            specialization: 'General Medicine',
            licenseNumber: 'LIC123',
            contactNumber: '+1234567890',
            email: 'doctor@example.com',
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
          }
        ]
      };

      vi.mocked(mockHttpClient.get).mockResolvedValue({ data: mockResponse });

      const result = await doctorService.getAllDoctors();

      expect(mockHttpClient.get).toHaveBeenCalledWith('/api/doctors?active=true');
      expect(result).toEqual(mockResponse.data);
    });

    it('should get all doctors including inactive ones', async () => {
      const mockResponse: DoctorListResponse = {
        success: true,
        data: [
          {
            id: 'doctor-1',
            userId: 'user-1',
            firstName: 'John',
            lastName: 'Doe',
            specialization: 'General Medicine',
            licenseNumber: 'LIC123',
            contactNumber: '+1234567890',
            email: 'doctor@example.com',
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            id: 'doctor-2',
            userId: 'user-2',
            firstName: 'Jane',
            lastName: 'Smith',
            specialization: 'Pediatrics',
            licenseNumber: 'LIC456',
            contactNumber: '+0987654321',
            email: 'jane@example.com',
            isActive: false,
            createdAt: new Date(),
            updatedAt: new Date()
          }
        ]
      };

      vi.mocked(mockHttpClient.get).mockResolvedValue({ data: mockResponse });

      const result = await doctorService.getAllDoctors(false);

      expect(mockHttpClient.get).toHaveBeenCalledWith('/api/doctors?active=false');
      expect(result).toEqual(mockResponse.data);
    });

    it('should get doctors in summary format', async () => {
      const mockResponse: DoctorSummaryListResponse = {
        success: true,
        data: [
          {
            id: 'doctor-1',
            firstName: 'John',
            lastName: 'Doe',
            specialization: 'General Medicine',
            isActive: true
          }
        ]
      };

      vi.mocked(mockHttpClient.get).mockResolvedValue({ data: mockResponse });

      const result = await doctorService.getAllDoctors(true, 'summary');

      expect(mockHttpClient.get).toHaveBeenCalledWith('/api/doctors?active=true&format=summary');
      expect(result).toEqual(mockResponse.data);
    });

    it('should throw error when request fails', async () => {
      const mockResponse = { data: { success: false } };
      vi.mocked(mockHttpClient.get).mockResolvedValue(mockResponse);

      await expect(doctorService.getAllDoctors()).rejects.toThrow('Failed to fetch doctors');
    });

    it('should handle network errors', async () => {
      const networkError = new Error('Network connection failed');
      vi.mocked(mockHttpClient.get).mockRejectedValue(networkError);

      await expect(doctorService.getAllDoctors()).rejects.toThrow('Network connection failed');
    });
  });

  describe('getDoctorById', () => {
    it('should get doctor by id successfully', async () => {
      const doctorId = 'doctor-1';
      const mockResponse: DoctorResponse = {
        success: true,
        data: {
          id: doctorId,
          userId: 'user-1',
          firstName: 'John',
          lastName: 'Doe',
          specialization: 'Cardiology',
          licenseNumber: 'LIC789',
          contactNumber: '+1111111111',
          email: 'cardio@example.com',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      };

      vi.mocked(mockHttpClient.get).mockResolvedValue({ data: mockResponse });

      const result = await doctorService.getDoctorById(doctorId);

      expect(mockHttpClient.get).toHaveBeenCalledWith(`/api/doctors/${doctorId}`);
      expect(result).toEqual(mockResponse.data);
    });

    it('should throw error when doctor not found', async () => {
      const doctorId = 'non-existent';
      const mockResponse = { data: { success: false } };
      vi.mocked(mockHttpClient.get).mockResolvedValue(mockResponse);

      await expect(doctorService.getDoctorById(doctorId)).rejects.toThrow('Doctor with ID non-existent not found');
    });
  });

  describe('getDoctorByUserId', () => {
    it('should get doctor by user id successfully', async () => {
      const userId = 'user-1';
      const mockResponse: DoctorResponse = {
        success: true,
        data: {
          id: 'doctor-1',
          userId,
          firstName: 'Alice',
          lastName: 'Johnson',
          specialization: 'Dermatology',
          licenseNumber: 'LIC999',
          contactNumber: '+2222222222',
          email: 'alice@example.com',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      };

      vi.mocked(mockHttpClient.get).mockResolvedValue({ data: mockResponse });

      const result = await doctorService.getDoctorByUserId(userId);

      expect(mockHttpClient.get).toHaveBeenCalledWith(`/api/doctors/user/${userId}`);
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('getDoctorsBySpecialization', () => {
    it('should get doctors by specialization with active filter', async () => {
      const specialization = 'Neurology';
      const mockResponse: DoctorListResponse = {
        success: true,
        data: [
          {
            id: 'doctor-3',
            userId: 'user-3',
            firstName: 'Bob',
            lastName: 'Wilson',
            specialization,
            licenseNumber: 'LIC333',
            contactNumber: '+3333333333',
            email: 'bob@example.com',
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
          }
        ]
      };

      vi.mocked(mockHttpClient.get).mockResolvedValue({ data: mockResponse });

      const result = await doctorService.getDoctorsBySpecialization(specialization, true);

      expect(mockHttpClient.get).toHaveBeenCalledWith(`/api/doctors/specialization/${specialization}?active=true`);
      expect(result).toEqual(mockResponse.data);
    });

    it('should get doctors by specialization without active filter', async () => {
      const specialization = 'Orthopedics';
      const mockResponse: DoctorListResponse = {
        success: true,
        data: []
      };

      vi.mocked(mockHttpClient.get).mockResolvedValue({ data: mockResponse });

      const result = await doctorService.getDoctorsBySpecialization(specialization);

      expect(mockHttpClient.get).toHaveBeenCalledWith(`/api/doctors/specialization/${specialization}?active=true`);
      expect(result).toEqual([]);
    });
  });

  describe('checkDoctorProfileExists', () => {
    it('should return true when doctor profile exists', async () => {
      const userId = 'user-1';
      const mockResponse = { data: { exists: true } };

      vi.mocked(mockHttpClient.get).mockResolvedValue(mockResponse);

      const result = await doctorService.checkDoctorProfileExists(userId);

      expect(mockHttpClient.get).toHaveBeenCalledWith(`/api/doctors/check/${userId}`);
      expect(result).toBe(true);
    });

    it('should return false when doctor profile does not exist', async () => {
      const userId = 'user-2';
      const mockResponse = { data: { exists: false } };

      vi.mocked(mockHttpClient.get).mockResolvedValue(mockResponse);

      const result = await doctorService.checkDoctorProfileExists(userId);

      expect(result).toBe(false);
    });

    it('should handle errors and return false', async () => {
      const userId = 'user-3';
      const error = new Error('API Error');

      vi.mocked(mockHttpClient.get).mockRejectedValue(error);

      const result = await doctorService.checkDoctorProfileExists(userId);

      expect(result).toBe(false);
    });
  });

  describe('createDoctorProfile', () => {
    it('should create doctor profile successfully', async () => {
      const createCommand: CreateDoctorProfileCommand = {
        userId: 'user-4',
        firstName: 'Sarah',
        lastName: 'Connor',
        specialization: 'Emergency Medicine',
        licenseNumber: 'LIC777',
        contactNumber: '+4444444444',
        email: 'sarah@example.com'
      };

      const mockResponse: DoctorOperationResponse = {
        success: true,
        data: { id: 'new-doctor-id' },
        message: 'Doctor profile created successfully'
      };

      vi.mocked(mockHttpClient.post).mockResolvedValue({ data: mockResponse });

      const result = await doctorService.createDoctorProfile(createCommand);

      expect(mockHttpClient.post).toHaveBeenCalledWith('/api/doctors', createCommand);
      expect(result).toEqual(mockResponse);
    });

    it('should throw error when creation fails', async () => {
      const createCommand: CreateDoctorProfileCommand = {
        userId: 'user-4',
        firstName: 'Test',
        lastName: 'Doctor',
        specialization: 'Test Specialty',
        licenseNumber: 'TEST123',
        contactNumber: '+5555555555',
        email: 'test@example.com'
      };

      const mockResponse = { data: { success: false } };
      vi.mocked(mockHttpClient.post).mockResolvedValue(mockResponse);

      await expect(doctorService.createDoctorProfile(createCommand)).rejects.toThrow('Failed to create doctor profile');
    });
  });

  describe('schedule overrides', () => {
    describe('getAllScheduleOverrides', () => {
      it('should get all schedule overrides successfully', async () => {
        const mockResponse: ScheduleOverrideListResponse = {
          success: true,
          data: [
            {
              id: 'override-1',
              date: '2024-01-01',
              doctorId: 'doctor-1',
              startTime: '09:00',
              endTime: '17:00',
              reason: 'Special clinic',
              createdAt: new Date(),
              updatedAt: new Date()
            }
          ]
        };

        vi.mocked(mockHttpClient.get).mockResolvedValue({ data: mockResponse });

        const result = await doctorService.getAllScheduleOverrides();

        expect(mockHttpClient.get).toHaveBeenCalledWith('/api/doctors/schedule-overrides');
        expect(result).toEqual(mockResponse.data);
      });
    });

    describe('createScheduleOverride', () => {
      it('should create schedule override successfully', async () => {
        const request: CreateScheduleOverrideRequestDto = {
          date: '2024-02-01',
          doctorId: 'doctor-1',
          startTime: '08:00',
          endTime: '16:00',
          reason: 'Holiday schedule'
        };

        const mockResponse: DoctorOperationResponse = {
          success: true,
          data: { id: 'new-override-id' },
          message: 'Schedule override created successfully'
        };

        vi.mocked(mockHttpClient.post).mockResolvedValue({ data: mockResponse });

        const result = await doctorService.createScheduleOverride(request);

        expect(mockHttpClient.post).toHaveBeenCalledWith('/api/doctors/schedule-override', request);
        expect(result).toEqual(mockResponse);
      });
    });

    describe('updateScheduleOverride', () => {
      it('should update schedule override successfully', async () => {
        const overrideId = 'override-1';
        const request: UpdateScheduleOverrideRequestDto = {
          startTime: '10:00',
          endTime: '18:00',
          reason: 'Updated schedule'
        };

        const mockResponse: DoctorOperationResponse = {
          success: true,
          message: 'Schedule override updated successfully'
        };

        vi.mocked(mockHttpClient.put).mockResolvedValue({ data: mockResponse });

        const result = await doctorService.updateScheduleOverride(overrideId, request);

        expect(mockHttpClient.put).toHaveBeenCalledWith(`/api/doctors/schedule-override/${overrideId}`, request);
        expect(result).toEqual(mockResponse);
      });
    });

    describe('deleteScheduleOverride', () => {
      it('should delete schedule override by date successfully', async () => {
        const date = '2024-01-01';
        const mockResponse: DoctorOperationResponse = {
          success: true,
          message: 'Schedule override deleted successfully'
        };

        vi.mocked(mockHttpClient.delete).mockResolvedValue({ data: mockResponse });

        const result = await doctorService.deleteScheduleOverride(date);

        expect(mockHttpClient.delete).toHaveBeenCalledWith(`/api/doctors/schedule-override/${date}`);
        expect(result).toEqual(mockResponse);
      });
    });
  });

  describe('error handling', () => {
    it('should handle null response data', async () => {
      vi.mocked(mockHttpClient.get).mockResolvedValue({ data: null });

      await expect(doctorService.getAllDoctors()).rejects.toThrow();
    });

    it('should handle undefined response data', async () => {
      vi.mocked(mockHttpClient.post).mockResolvedValue({ data: undefined });

      const createCommand: CreateDoctorProfileCommand = {
        userId: 'user-test',
        firstName: 'Test',
        lastName: 'Doctor',
        specialization: 'Test',
        licenseNumber: 'TEST',
        contactNumber: '+1234567890',
        email: 'test@example.com'
      };

      await expect(doctorService.createDoctorProfile(createCommand)).rejects.toThrow();
    });
  });
});