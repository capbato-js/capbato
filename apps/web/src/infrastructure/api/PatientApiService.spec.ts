import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PatientApiService } from './PatientApiService';
import { IHttpClient } from '../http/IHttpClient';
import { 
  CreatePatientCommand,
  UpdatePatientCommand,
  TOKENS
} from '@nx-starter/application-shared';
import { PatientResponse, PatientListResponse, PatientStatsResponse } from './IPatientApiService';

// Mock API config
vi.mock('./config/ApiConfig', () => ({
  getApiConfig: () => ({
    endpoints: {
      patients: {
        create: '/api/patients',
        update: (id: string) => `/api/patients/${id}`,
        all: '/api/patients',
        byId: (id: string) => `/api/patients/${id}`,
        stats: '/api/patients/total' // This appears to be the actual endpoint
      }
    }
  })
}));

describe('PatientApiService', () => {
  let patientService: PatientApiService;
  let mockHttpClient: IHttpClient;

  beforeEach(() => {
    mockHttpClient = {
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      delete: vi.fn()
    };

    patientService = new PatientApiService(mockHttpClient);
  });

  describe('createPatient', () => {
    it('should create patient successfully', async () => {
      const createCommand: CreatePatientCommand = {
        firstName: 'John',
        lastName: 'Doe',
        middleName: 'M',
        dateOfBirth: new Date('1990-01-01'),
        gender: 'Male',
        contactNumber: '+1234567890',
        houseNumber: '123',
        streetName: 'Main St',
        province: 'Metro Manila',
        cityMunicipality: 'Manila',
        barangay: 'Barangay 1',
        guardianName: 'Jane Doe',
        guardianGender: 'Female',
        guardianRelationship: 'Mother',
        guardianContactNumber: '+0987654321',
        guardianHouseNumber: '456',
        guardianStreetName: 'Second St',
        guardianProvince: 'Metro Manila',
        guardianCityMunicipality: 'Manila',
        guardianBarangay: 'Barangay 2'
      };

      const mockResponse: PatientResponse = {
        success: true,
        data: {
          id: 'patient-1',
          patientNumber: 'P001',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          dateOfBirth: new Date('1990-01-01'),
          gender: 'Male',
          contactNumber: '+1234567890',
          address: '123 Main St, Barangay 1, Manila, Metro Manila',
          emergencyContact: 'Jane Doe',
          emergencyContactNumber: '+0987654321',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      };

      vi.mocked(mockHttpClient.post).mockResolvedValue({ data: mockResponse });

      const result = await patientService.createPatient(createCommand);

      expect(mockHttpClient.post).toHaveBeenCalledWith('/api/patients', expect.objectContaining({
        firstName: 'John',
        lastName: 'Doe',
        middleName: 'M',
        dateOfBirth: new Date('1990-01-01'),
        gender: 'Male',
        contactNumber: '+1234567890',
        houseNumber: '123',
        streetName: 'Main St',
        province: 'Metro Manila',
        guardianName: 'Jane Doe'
      }));
      expect(result).toEqual(mockResponse);
    });

    it('should throw error when creation fails', async () => {
      const createCommand: CreatePatientCommand = {
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: new Date('1990-01-01'),
        gender: 'Male',
        contactNumber: '+1234567890'
      };

      const mockResponse = { data: { success: false } };
      vi.mocked(mockHttpClient.post).mockResolvedValue(mockResponse);

      await expect(patientService.createPatient(createCommand)).rejects.toThrow('Failed to create patient');
    });

    it('should handle minimal patient data', async () => {
      const minimalCommand: CreatePatientCommand = {
        firstName: 'Jane',
        lastName: 'Smith',
        dateOfBirth: new Date('1985-06-15'),
        gender: 'Female',
        contactNumber: '+1111111111'
      };

      const mockResponse: PatientResponse = {
        success: true,
        data: {
          id: 'patient-2',
          patientNumber: 'P002',
          firstName: 'Jane',
          lastName: 'Smith',
          email: 'jane@example.com',
          dateOfBirth: new Date('1985-06-15'),
          gender: 'Female',
          contactNumber: '+1111111111',
          address: '',
          emergencyContact: '',
          emergencyContactNumber: '',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      };

      vi.mocked(mockHttpClient.post).mockResolvedValue({ data: mockResponse });

      const result = await patientService.createPatient(minimalCommand);

      expect(mockHttpClient.post).toHaveBeenCalledWith('/api/patients', expect.objectContaining({
        firstName: 'Jane',
        lastName: 'Smith',
        dateOfBirth: new Date('1985-06-15'),
        gender: 'Female',
        contactNumber: '+1111111111'
      }));
      expect(result).toEqual(mockResponse);
    });
  });

  describe('updatePatient', () => {
    it('should update patient successfully', async () => {
      const updateCommand: UpdatePatientCommand = {
        id: 'patient-1',
        firstName: 'John Updated',
        lastName: 'Doe Updated',
        dateOfBirth: new Date('1990-01-01'),
        gender: 'Male',
        contactNumber: '+1234567890'
      };

      const mockResponse: PatientResponse = {
        success: true,
        data: {
          id: 'patient-1',
          patientNumber: 'P001',
          firstName: 'John Updated',
          lastName: 'Doe Updated',
          email: 'john@example.com',
          dateOfBirth: new Date('1990-01-01'),
          gender: 'Male',
          contactNumber: '+1234567890',
          address: '',
          emergencyContact: '',
          emergencyContactNumber: '',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      };

      vi.mocked(mockHttpClient.put).mockResolvedValue({ data: mockResponse });

      const result = await patientService.updatePatient(updateCommand);

      expect(mockHttpClient.put).toHaveBeenCalledWith('/api/patients/patient-1', expect.objectContaining({
        id: 'patient-1',
        firstName: 'John Updated',
        lastName: 'Doe Updated'
      }));
      expect(result).toEqual(mockResponse);
    });

    it('should throw error when update fails', async () => {
      const updateCommand: UpdatePatientCommand = {
        id: 'patient-1',
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: new Date('1990-01-01'),
        gender: 'Male',
        contactNumber: '+1234567890'
      };

      const mockResponse = { data: { success: false } };
      vi.mocked(mockHttpClient.put).mockResolvedValue(mockResponse);

      await expect(patientService.updatePatient(updateCommand)).rejects.toThrow('Failed to update patient with ID: patient-1');
    });
  });

  describe('getAllPatients', () => {
    it('should get all patients successfully', async () => {
      const mockResponse: PatientListResponse = {
        success: true,
        data: [
          {
            id: 'patient-1',
            patientNumber: 'P001',
            firstName: 'John',
            lastName: 'Doe',
            fullName: 'John Doe',
            gender: 'Male',
            dateOfBirth: new Date('1990-01-01'),
            contactNumber: '+1234567890',
            address: '123 Main St',
            emergencyContact: 'Jane Doe',
            emergencyContactNumber: '+0987654321'
          }
        ]
      };

      vi.mocked(mockHttpClient.get).mockResolvedValue({ data: mockResponse });

      const result = await patientService.getAllPatients();

      expect(mockHttpClient.get).toHaveBeenCalledWith('/api/patients');
      expect(result).toEqual(mockResponse);
    });

    it('should throw error when request fails', async () => {
      const mockResponse = { data: { success: false } };
      vi.mocked(mockHttpClient.get).mockResolvedValue(mockResponse);

      await expect(patientService.getAllPatients()).rejects.toThrow('Failed to fetch patients');
    });
  });

  describe('getPatientById', () => {
    it('should get patient by id successfully', async () => {
      const patientId = 'patient-1';
      const mockResponse: PatientResponse = {
        success: true,
        data: {
          id: patientId,
          patientNumber: 'P001',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          dateOfBirth: new Date('1990-01-01'),
          gender: 'Male',
          contactNumber: '+1234567890',
          address: '123 Main St',
          emergencyContact: 'Jane Doe',
          emergencyContactNumber: '+0987654321',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      };

      vi.mocked(mockHttpClient.get).mockResolvedValue({ data: mockResponse });

      const result = await patientService.getPatientById(patientId);

      expect(mockHttpClient.get).toHaveBeenCalledWith(`/api/patients/${patientId}`);
      expect(result).toEqual(mockResponse);
    });

    it('should throw error when patient not found', async () => {
      const patientId = 'non-existent';
      const mockResponse = { data: { success: false } };
      vi.mocked(mockHttpClient.get).mockResolvedValue(mockResponse);

      await expect(patientService.getPatientById(patientId)).rejects.toThrow(`Failed to fetch patient with ID: ${patientId}`);
    });
  });

  describe('getPatientStats', () => {
    it('should get patient statistics successfully', async () => {
      const mockResponse: PatientStatsResponse = {
        success: true,
        data: {
          totalPatients: 150,
          activePatients: 145,
          newPatientsThisMonth: 12,
          averageAge: 34.5
        }
      };

      vi.mocked(mockHttpClient.get).mockResolvedValue({ data: mockResponse });

      const result = await patientService.getPatientStats();

      expect(mockHttpClient.get).toHaveBeenCalledWith('/api/patients/total');
      expect(result).toEqual(mockResponse);
    });

    it('should throw error when stats request fails', async () => {
      const mockResponse = { data: { success: false } };
      vi.mocked(mockHttpClient.get).mockResolvedValue(mockResponse);

      await expect(patientService.getPatientStats()).rejects.toThrow('Failed to fetch patient statistics');
    });
  });

  describe('edge cases', () => {
    it('should handle null response data', async () => {
      vi.mocked(mockHttpClient.get).mockResolvedValue({ data: null });

      await expect(patientService.getAllPatients()).rejects.toThrow();
    });

    it('should handle undefined response data', async () => {
      vi.mocked(mockHttpClient.post).mockResolvedValue({ data: undefined });

      const createCommand: CreatePatientCommand = {
        firstName: 'Test',
        lastName: 'Patient',
        dateOfBirth: new Date('1990-01-01'),
        gender: 'Male',
        contactNumber: '+1234567890'
      };

      await expect(patientService.createPatient(createCommand)).rejects.toThrow();
    });

    it('should handle empty patient ID in update', async () => {
      const updateCommand: UpdatePatientCommand = {
        id: '',
        firstName: 'Test',
        lastName: 'Patient',
        dateOfBirth: new Date('1990-01-01'),
        gender: 'Male',
        contactNumber: '+1234567890'
      };

      const mockResponse = { data: { success: false } };
      vi.mocked(mockHttpClient.put).mockResolvedValue(mockResponse);

      await expect(patientService.updatePatient(updateCommand)).rejects.toThrow('Failed to update patient with ID: ');
    });
  });
});