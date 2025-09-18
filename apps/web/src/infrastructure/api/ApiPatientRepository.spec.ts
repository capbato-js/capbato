import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ApiPatientRepository } from './ApiPatientRepository';
import { IPatientApiService, PatientListResponse } from './IPatientApiService';
import { PatientListDto } from '@nx-starter/application-shared';

describe('ApiPatientRepository', () => {
  let repository: ApiPatientRepository;
  let mockApiService: IPatientApiService;

  const mockPatientDto: PatientListDto = {
    id: '1',
    patientNumber: 'P001',
    firstName: 'John',
    lastName: 'Doe',
    middleName: 'M',
    dateOfBirth: '1990-01-01',
    gender: 'Male',
    contactNumber: '123456789',
    address: '123 Main St',
    guardianName: 'Jane Doe',
    guardianGender: 'Female',
    guardianRelationship: 'Mother',
    guardianContactNumber: '987654321',
    guardianAddress: '123 Main St',
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z'
  };

  const mockPatientDto2: PatientListDto = {
    id: '2',
    patientNumber: 'P002',
    firstName: 'Jane',
    lastName: 'Smith',
    middleName: '',
    dateOfBirth: '2010-06-15',
    gender: 'Female',
    contactNumber: '111222333',
    address: '456 Oak Ave',
    guardianName: '',
    guardianGender: undefined,
    guardianRelationship: '',
    guardianContactNumber: '',
    guardianAddress: '',
    createdAt: '2023-02-01T00:00:00Z',
    updatedAt: '2023-02-01T00:00:00Z'
  };

  const mockPatientDto3: PatientListDto = {
    id: '3',
    patientNumber: 'P003',
    firstName: 'Bob',
    lastName: 'Johnson',
    middleName: undefined,
    dateOfBirth: '1950-12-25',
    gender: 'Male',
    contactNumber: '444555666',
    address: '789 Pine Rd',
    guardianName: undefined,
    guardianGender: undefined,
    guardianRelationship: undefined,
    guardianContactNumber: undefined,
    guardianAddress: undefined,
    createdAt: '2023-03-01T00:00:00Z',
    updatedAt: '2023-03-01T00:00:00Z'
  };

  beforeEach(() => {
    mockApiService = {
      getAllPatients: vi.fn(),
      createPatient: vi.fn(),
      updatePatient: vi.fn(),
      getPatientById: vi.fn(),
      getPatientStats: vi.fn()
    };

    repository = new ApiPatientRepository(mockApiService);
  });

  describe('getAll', () => {
    it('should return all patients with computed properties', async () => {
      const mockResponse: PatientListResponse = {
        success: true,
        data: [mockPatientDto, mockPatientDto2, mockPatientDto3]
      };

      vi.mocked(mockApiService.getAllPatients).mockResolvedValue(mockResponse);

      const result = await repository.getAll();

      expect(result).toHaveLength(3);
      expect(result[0]).toMatchObject({
        id: '1',
        patientNumber: 'P001',
        firstName: 'John',
        lastName: 'Doe',
        middleName: 'M',
        gender: 'Male',
        contactNumber: '123456789',
        address: '123 Main St'
      });

      // Test computed properties
      expect(result[0].fullName).toBe('John M Doe');
      expect(result[0].age).toBeGreaterThan(30);
    });

    it('should handle missing optional fields', async () => {
      const mockPatientWithMissingFields: PatientListDto = {
        id: '4',
        patientNumber: undefined,
        firstName: undefined,
        lastName: undefined,
        middleName: undefined,
        dateOfBirth: '1990-01-01',
        gender: 'Male',
        contactNumber: undefined,
        address: undefined,
        guardianName: undefined,
        guardianGender: undefined,
        guardianRelationship: undefined,
        guardianContactNumber: undefined,
        guardianAddress: undefined,
        createdAt: undefined,
        updatedAt: undefined
      };

      const mockResponse: PatientListResponse = {
        success: true,
        data: [mockPatientWithMissingFields]
      };

      vi.mocked(mockApiService.getAllPatients).mockResolvedValue(mockResponse);

      const result = await repository.getAll();

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        patientNumber: 'N/A',
        firstName: 'Unknown',
        lastName: 'Unknown',
        contactNumber: 'N/A',
        address: 'N/A'
      });
    });

    it('should handle fullName computation with missing middle name', async () => {
      const mockResponse: PatientListResponse = {
        success: true,
        data: [mockPatientDto2]
      };

      vi.mocked(mockApiService.getAllPatients).mockResolvedValue(mockResponse);

      const result = await repository.getAll();

      expect(result[0].fullName).toBe('Jane Smith');
    });

    it('should compute age correctly', async () => {
      const currentYear = new Date().getFullYear();
      const birthYear = currentYear - 25;
      
      const patientWithKnownAge: PatientListDto = {
        ...mockPatientDto,
        dateOfBirth: `${birthYear}-06-15`
      };

      const mockResponse: PatientListResponse = {
        success: true,
        data: [patientWithKnownAge]
      };

      vi.mocked(mockApiService.getAllPatients).mockResolvedValue(mockResponse);

      const result = await repository.getAll();

      expect(result[0].age).toBe(25);
    });
  });

  describe('getTotalCount', () => {
    it('should return total count of patients', async () => {
      const mockResponse: PatientListResponse = {
        success: true,
        data: [mockPatientDto, mockPatientDto2]
      };

      vi.mocked(mockApiService.getAllPatients).mockResolvedValue(mockResponse);

      const result = await repository.getTotalCount();

      expect(result).toBe(2);
    });
  });

  describe('getCountByGender', () => {
    it('should return count by gender', async () => {
      const mockResponse: PatientListResponse = {
        success: true,
        data: [mockPatientDto, mockPatientDto2, mockPatientDto3]
      };

      vi.mocked(mockApiService.getAllPatients).mockResolvedValue(mockResponse);

      const result = await repository.getCountByGender();

      expect(result).toEqual({ male: 2, female: 1 });
    });
  });

  describe('getCountByAgeCategory', () => {
    it('should categorize patients by age', async () => {
      const mockResponse: PatientListResponse = {
        success: true,
        data: [mockPatientDto, mockPatientDto2, mockPatientDto3]
      };

      vi.mocked(mockApiService.getAllPatients).mockResolvedValue(mockResponse);

      const result = await repository.getCountByAgeCategory();

      expect(result).toEqual({
        children: 1, // mockPatientDto2 born in 2010
        adults: 1,   // mockPatientDto born in 1990
        seniors: 1   // mockPatientDto3 born in 1950
      });
    });
  });

  describe('countByPatientNumberPrefix', () => {
    it('should count patients by patient number prefix', async () => {
      const mockResponse: PatientListResponse = {
        success: true,
        data: [mockPatientDto, mockPatientDto2, mockPatientDto3]
      };

      vi.mocked(mockApiService.getAllPatients).mockResolvedValue(mockResponse);

      const result = await repository.countByPatientNumberPrefix('P00');

      expect(result).toBe(3);
    });

    it('should return 0 for non-matching prefix', async () => {
      const mockResponse: PatientListResponse = {
        success: true,
        data: [mockPatientDto, mockPatientDto2, mockPatientDto3]
      };

      vi.mocked(mockApiService.getAllPatients).mockResolvedValue(mockResponse);

      const result = await repository.countByPatientNumberPrefix('X');

      expect(result).toBe(0);
    });
  });

  describe('existsByPatientNumber', () => {
    it('should return true if patient number exists', async () => {
      const mockResponse: PatientListResponse = {
        success: true,
        data: [mockPatientDto]
      };

      vi.mocked(mockApiService.getAllPatients).mockResolvedValue(mockResponse);

      const result = await repository.existsByPatientNumber('P001');

      expect(result).toBe(true);
    });

    it('should return false if patient number does not exist', async () => {
      const mockResponse: PatientListResponse = {
        success: true,
        data: [mockPatientDto]
      };

      vi.mocked(mockApiService.getAllPatients).mockResolvedValue(mockResponse);

      const result = await repository.existsByPatientNumber('P999');

      expect(result).toBe(false);
    });
  });

  describe('existsByContactNumber', () => {
    it('should return true if contact number exists', async () => {
      const mockResponse: PatientListResponse = {
        success: true,
        data: [mockPatientDto]
      };

      vi.mocked(mockApiService.getAllPatients).mockResolvedValue(mockResponse);

      const result = await repository.existsByContactNumber('123456789');

      expect(result).toBe(true);
    });

    it('should return false if contact number does not exist', async () => {
      const mockResponse: PatientListResponse = {
        success: true,
        data: [mockPatientDto]
      };

      vi.mocked(mockApiService.getAllPatients).mockResolvedValue(mockResponse);

      const result = await repository.existsByContactNumber('999999999');

      expect(result).toBe(false);
    });

    it('should exclude specified ID when checking contact number', async () => {
      const mockResponse: PatientListResponse = {
        success: true,
        data: [mockPatientDto]
      };

      vi.mocked(mockApiService.getAllPatients).mockResolvedValue(mockResponse);

      const result = await repository.existsByContactNumber('123456789', '1');

      expect(result).toBe(false);
    });
  });

  describe('searchByName', () => {
    it('should search by first name', async () => {
      const mockResponse: PatientListResponse = {
        success: true,
        data: [mockPatientDto] // Only return John for 'john' search
      };

      vi.mocked(mockApiService.getAllPatients).mockResolvedValue(mockResponse);

      const result = await repository.searchByName('john');

      expect(result).toHaveLength(1);
      expect(result[0].firstName).toBe('John');
    });

    it('should search by last name', async () => {
      const mockResponse: PatientListResponse = {
        success: true,
        data: [mockPatientDto, mockPatientDto2]
      };

      vi.mocked(mockApiService.getAllPatients).mockResolvedValue(mockResponse);

      const result = await repository.searchByName('smith');

      expect(result).toHaveLength(1);
      expect(result[0].lastName).toBe('Smith');
    });

    it('should search by middle name', async () => {
      const mockResponse: PatientListResponse = {
        success: true,
        data: [mockPatientDto] // Only return John who has middleName 'M'
      };

      vi.mocked(mockApiService.getAllPatients).mockResolvedValue(mockResponse);

      const result = await repository.searchByName('M');

      expect(result).toHaveLength(1);
      expect(result[0].middleName).toBe('M');
    });

    it('should limit results when limit is provided', async () => {
      const mockResponse: PatientListResponse = {
        success: true,
        data: [mockPatientDto, mockPatientDto2, mockPatientDto3]
      };

      vi.mocked(mockApiService.getAllPatients).mockResolvedValue(mockResponse);

      // All three have names that might match partial searches
      const result = await repository.searchByName('o', 2);

      expect(result).toHaveLength(2);
    });
  });

  describe('getByAgeRange', () => {
    it('should return patients within age range', async () => {
      const mockResponse: PatientListResponse = {
        success: true,
        data: [mockPatientDto, mockPatientDto2, mockPatientDto3]
      };

      vi.mocked(mockApiService.getAllPatients).mockResolvedValue(mockResponse);

      const result = await repository.getByAgeRange(30, 40);

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('1'); // mockPatientDto born in 1990
    });

    it('should return empty array if no patients match age range', async () => {
      const mockResponse: PatientListResponse = {
        success: true,
        data: [mockPatientDto]
      };

      vi.mocked(mockApiService.getAllPatients).mockResolvedValue(mockResponse);

      const result = await repository.getByAgeRange(80, 90);

      expect(result).toHaveLength(0);
    });
  });

  describe('getByGender', () => {
    it('should return male patients', async () => {
      const mockResponse: PatientListResponse = {
        success: true,
        data: [mockPatientDto, mockPatientDto2, mockPatientDto3]
      };

      vi.mocked(mockApiService.getAllPatients).mockResolvedValue(mockResponse);

      const result = await repository.getByGender('Male');

      expect(result).toHaveLength(2);
      expect(result.every(p => p.gender === 'Male')).toBe(true);
    });

    it('should return female patients', async () => {
      const mockResponse: PatientListResponse = {
        success: true,
        data: [mockPatientDto, mockPatientDto2, mockPatientDto3]
      };

      vi.mocked(mockApiService.getAllPatients).mockResolvedValue(mockResponse);

      const result = await repository.getByGender('Female');

      expect(result).toHaveLength(1);
      expect(result[0].gender).toBe('Female');
    });
  });

  describe('getByDateRange', () => {
    it('should return patients within date range', async () => {
      const mockResponse: PatientListResponse = {
        success: true,
        data: [mockPatientDto, mockPatientDto2, mockPatientDto3]
      };

      vi.mocked(mockApiService.getAllPatients).mockResolvedValue(mockResponse);

      const startDate = new Date('2023-01-01');
      const endDate = new Date('2023-02-15');
      const result = await repository.getByDateRange(startDate, endDate);

      expect(result).toHaveLength(2);
    });
  });

  describe('getWithGuardianInfo', () => {
    it('should return patients with guardian info', async () => {
      const mockResponse: PatientListResponse = {
        success: true,
        data: [mockPatientDto, mockPatientDto2, mockPatientDto3]
      };

      vi.mocked(mockApiService.getAllPatients).mockResolvedValue(mockResponse);

      const result = await repository.getWithGuardianInfo();

      expect(result).toHaveLength(1);
      expect(result[0].guardianName).toBe('Jane Doe');
    });
  });

  describe('getWithoutGuardianInfo', () => {
    it('should return patients without guardian info', async () => {
      const mockResponse: PatientListResponse = {
        success: true,
        data: [mockPatientDto, mockPatientDto2, mockPatientDto3]
      };

      vi.mocked(mockApiService.getAllPatients).mockResolvedValue(mockResponse);

      const result = await repository.getWithoutGuardianInfo();

      expect(result).toHaveLength(2);
    });
  });

  describe('unimplemented methods', () => {
    it('should throw error for create', async () => {
      await expect(repository.create({} as any)).rejects.toThrow('Create operation not implemented in web app');
    });

    it('should throw error for getById', async () => {
      await expect(repository.getById('1')).rejects.toThrow('GetById operation not implemented in web app');
    });

    it('should throw error for getByPatientNumber', async () => {
      await expect(repository.getByPatientNumber('P001')).rejects.toThrow('GetByPatientNumber operation not implemented in web app');
    });

    it('should throw error for getByContactNumber', async () => {
      await expect(repository.getByContactNumber('123456789')).rejects.toThrow('GetByContactNumber operation not implemented in web app');
    });

    it('should throw error for update', async () => {
      await expect(repository.update('1', {})).rejects.toThrow('Update operation not implemented in web app');
    });

    it('should throw error for delete', async () => {
      await expect(repository.delete('1')).rejects.toThrow('Delete operation not implemented in web app');
    });
  });
});