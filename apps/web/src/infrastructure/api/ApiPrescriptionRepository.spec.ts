import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ApiPrescriptionRepository } from './ApiPrescriptionRepository';
import { IPrescriptionApiService } from './IPrescriptionApiService';
import { PrescriptionListResponse, PrescriptionResponse, PrescriptionOperationResponse } from '@nx-starter/application-shared';
import { PrescriptionDto, MedicationDto, PrescriptionMapper } from '@nx-starter/application-shared';
import { Prescription } from '@nx-starter/domain';

describe('ApiPrescriptionRepository', () => {
  let repository: ApiPrescriptionRepository;
  let mockApiService: IPrescriptionApiService;

  const mockMedicationDto: MedicationDto = {
    id: 'med1',
    medicationName: 'Aspirin',
    dosage: '100mg',
    instructions: 'Take with food',
    frequency: 'twice daily',
    duration: '7 days'
  };

  const mockPrescriptionDto: PrescriptionDto = {
    id: '1',
    patientId: 'patient1',
    doctorId: 'doctor1',
    patient: {
      id: 'patient1',
      patientNumber: 'P001',
      firstName: 'John',
      lastName: 'Doe',
      middleName: 'M',
      fullName: 'John M Doe'
    },
    doctor: {
      id: 'doctor1',
      firstName: 'Jane',
      lastName: 'Smith',
      fullName: 'Dr. Jane Smith',
      specialization: 'Cardiology'
    },
    medications: [mockMedicationDto],
    medicationName: 'Aspirin',
    dosage: '100mg',
    instructions: 'Take with food',
    frequency: 'twice daily',
    duration: '7 days',
    prescribedDate: '2023-01-01T00:00:00Z',
    expiryDate: '2023-01-31T00:00:00Z',
    quantity: '30 tablets',
    additionalNotes: 'Monitor blood pressure',
    status: 'active',
    createdAt: '2023-01-01T00:00:00Z'
  };

  const mockPrescription = {
    id: { value: '1' },
    patientId: 'patient1',
    doctorId: 'doctor1',
    medications: [{
      medicationNameValue: 'Aspirin',
      dosageValue: '100mg',
      instructionsValue: 'Take with food',
      frequency: 'twice daily',
      duration: '7 days'
    }],
    prescribedDate: new Date('2023-01-01'),
    expiryDate: new Date('2023-01-31'),
    quantity: '30 tablets',
    additionalNotes: 'Monitor blood pressure',
    status: 'active',
    createdAt: new Date('2023-01-01')
  } as unknown as Prescription;

  beforeEach(() => {
    mockApiService = {
      getAllPrescriptions: vi.fn(),
      getPrescriptionById: vi.fn(),
      createPrescription: vi.fn(),
      updatePrescription: vi.fn(),
      deletePrescription: vi.fn(),
      getPrescriptionsByPatientId: vi.fn(),
      getPrescriptionsByDoctorId: vi.fn(),
      getActivePrescriptions: vi.fn(),
      getExpiredPrescriptions: vi.fn(),
      getPrescriptionsByMedicationName: vi.fn()
    };

    repository = new ApiPrescriptionRepository(mockApiService);

    // Reset and setup the mapper spy
    vi.clearAllMocks();
    vi.spyOn(PrescriptionMapper, 'toDomain').mockReturnValue(mockPrescription);
  });

  describe('getAll', () => {
    it('should get all prescriptions and map them to domain entities', async () => {
      const mockResponse: PrescriptionListResponse = {
        success: true,
        data: [mockPrescriptionDto]
      };

      vi.mocked(mockApiService.getAllPrescriptions).mockResolvedValue(mockResponse);

      const result = await repository.getAll();

      expect(mockApiService.getAllPrescriptions).toHaveBeenCalledTimes(1);
      expect(PrescriptionMapper.toDomain).toHaveBeenCalledWith(mockPrescriptionDto);
      expect(result).toHaveLength(1);
      expect(result[0]).toBe(mockPrescription);
    });

    it('should handle empty response', async () => {
      const mockResponse: PrescriptionListResponse = {
        success: true,
        data: []
      };

      vi.mocked(mockApiService.getAllPrescriptions).mockResolvedValue(mockResponse);

      const result = await repository.getAll();

      expect(result).toHaveLength(0);
    });
  });

  describe('create', () => {
    it('should create a prescription and return the ID', async () => {
      const mockResponse: PrescriptionResponse = {
        success: true,
        data: { ...mockPrescriptionDto, id: 'new-id' }
      };

      vi.mocked(mockApiService.createPrescription).mockResolvedValue(mockResponse);

      const result = await repository.create(mockPrescription);

      expect(mockApiService.createPrescription).toHaveBeenCalledWith({
        patientId: 'patient1',
        doctorId: 'doctor1',
        medications: [{
          medicationName: 'Aspirin',
          dosage: '100mg',
          instructions: 'Take with food',
          frequency: 'twice daily',
          duration: '7 days'
        }],
        prescribedDate: '2023-01-01T00:00:00.000Z',
        expiryDate: '2023-01-31T00:00:00.000Z',
        quantity: '30 tablets',
        additionalNotes: 'Monitor blood pressure',
        status: 'active'
      });
      expect(result).toBe('new-id');
    });

    it('should handle prescription without expiry date', async () => {
      const prescriptionWithoutExpiry = {
        ...mockPrescription,
        expiryDate: undefined
      } as unknown as Prescription;

      const mockResponse: PrescriptionResponse = {
        success: true,
        data: { ...mockPrescriptionDto, id: 'new-id' }
      };

      vi.mocked(mockApiService.createPrescription).mockResolvedValue(mockResponse);

      const result = await repository.create(prescriptionWithoutExpiry);

      expect(mockApiService.createPrescription).toHaveBeenCalledWith(
        expect.objectContaining({
          expiryDate: undefined
        })
      );
      expect(result).toBe('new-id');
    });
  });

  describe('update', () => {
    it('should update prescription with all fields', async () => {
      const changes: Partial<Prescription> = {
        patientId: 'new-patient',
        doctorId: 'new-doctor',
        medications: [{
          medicationNameValue: 'Ibuprofen',
          dosageValue: '200mg',
          instructionsValue: 'Take after meals',
          frequency: 'three times daily',
          duration: '5 days'
        }] as Pick<Prescription, 'medications'>['medications'],
        prescribedDate: new Date('2023-02-01'),
        expiryDate: new Date('2023-02-28'),
        quantity: '15 tablets',
        additionalNotes: 'Updated notes',
        status: 'completed'
      };

      const mockResponse: PrescriptionOperationResponse = {
        success: true,
        message: 'Updated'
      };

      vi.mocked(mockApiService.updatePrescription).mockResolvedValue(mockResponse);

      await repository.update('1', changes);

      expect(mockApiService.updatePrescription).toHaveBeenCalledWith('1', {
        patientId: 'new-patient',
        doctorId: 'new-doctor',
        medications: [{
          medicationName: 'Ibuprofen',
          dosage: '200mg',
          instructions: 'Take after meals',
          frequency: 'three times daily',
          duration: '5 days'
        }],
        prescribedDate: '2023-02-01T00:00:00.000Z',
        expiryDate: '2023-02-28T00:00:00.000Z',
        quantity: '15 tablets',
        additionalNotes: 'Updated notes',
        status: 'completed'
      });
    });

    it('should update prescription with partial fields', async () => {
      const changes: Partial<Prescription> = {
        quantity: '20 tablets'
      };

      const mockResponse: PrescriptionOperationResponse = {
        success: true,
        message: 'Updated'
      };

      vi.mocked(mockApiService.updatePrescription).mockResolvedValue(mockResponse);

      await repository.update('1', changes);

      expect(mockApiService.updatePrescription).toHaveBeenCalledWith('1', {
        quantity: '20 tablets'
      });
    });

    it('should handle update without optional fields', async () => {
      const changes: Partial<Prescription> = {
        patientId: 'new-patient'
      };

      const mockResponse: PrescriptionOperationResponse = {
        success: true,
        message: 'Updated'
      };

      vi.mocked(mockApiService.updatePrescription).mockResolvedValue(mockResponse);

      await repository.update('1', changes);

      expect(mockApiService.updatePrescription).toHaveBeenCalledWith('1', {
        patientId: 'new-patient'
      });
    });
  });

  describe('delete', () => {
    it('should delete prescription', async () => {
      const mockResponse: PrescriptionOperationResponse = {
        success: true,
        message: 'Deleted'
      };

      vi.mocked(mockApiService.deletePrescription).mockResolvedValue(mockResponse);

      await repository.delete('1');

      expect(mockApiService.deletePrescription).toHaveBeenCalledWith('1');
    });
  });

  describe('getById', () => {
    it('should get prescription by ID', async () => {
      const mockResponse: PrescriptionResponse = {
        success: true,
        data: mockPrescriptionDto
      };

      vi.mocked(mockApiService.getPrescriptionById).mockResolvedValue(mockResponse);

      const result = await repository.getById('1');

      expect(mockApiService.getPrescriptionById).toHaveBeenCalledWith('1');
      expect(PrescriptionMapper.toDomain).toHaveBeenCalledWith(mockPrescriptionDto);
      expect(result).toBe(mockPrescription);
    });

    it('should return undefined when prescription not found', async () => {
      vi.mocked(mockApiService.getPrescriptionById).mockRejectedValue(new Error('Not found'));

      const result = await repository.getById('nonexistent');

      expect(result).toBeUndefined();
    });
  });

  describe('getByPatientId', () => {
    it('should get prescriptions by patient ID', async () => {
      const mockResponse: PrescriptionListResponse = {
        success: true,
        data: [mockPrescriptionDto]
      };

      vi.mocked(mockApiService.getPrescriptionsByPatientId).mockResolvedValue(mockResponse);

      const result = await repository.getByPatientId('patient1');

      expect(mockApiService.getPrescriptionsByPatientId).toHaveBeenCalledWith('patient1');
      expect(PrescriptionMapper.toDomain).toHaveBeenCalledWith(mockPrescriptionDto);
      expect(result).toHaveLength(1);
      expect(result[0]).toBe(mockPrescription);
    });
  });

  describe('getByDoctorId', () => {
    it('should get prescriptions by doctor ID', async () => {
      const mockResponse: PrescriptionListResponse = {
        success: true,
        data: [mockPrescriptionDto]
      };

      vi.mocked(mockApiService.getPrescriptionsByDoctorId).mockResolvedValue(mockResponse);

      const result = await repository.getByDoctorId('doctor1');

      expect(mockApiService.getPrescriptionsByDoctorId).toHaveBeenCalledWith('doctor1');
      expect(PrescriptionMapper.toDomain).toHaveBeenCalledWith(mockPrescriptionDto);
      expect(result).toHaveLength(1);
      expect(result[0]).toBe(mockPrescription);
    });
  });

  describe('getActive', () => {
    it('should get active prescriptions', async () => {
      const mockResponse: PrescriptionListResponse = {
        success: true,
        data: [mockPrescriptionDto]
      };

      vi.mocked(mockApiService.getActivePrescriptions).mockResolvedValue(mockResponse);

      const result = await repository.getActive();

      expect(mockApiService.getActivePrescriptions).toHaveBeenCalledTimes(1);
      expect(PrescriptionMapper.toDomain).toHaveBeenCalledWith(mockPrescriptionDto);
      expect(result).toHaveLength(1);
      expect(result[0]).toBe(mockPrescription);
    });
  });

  describe('getExpired', () => {
    it('should get expired prescriptions', async () => {
      const expiredPrescriptionDto = {
        ...mockPrescriptionDto,
        status: 'discontinued' as const
      };

      const mockResponse: PrescriptionListResponse = {
        success: true,
        data: [expiredPrescriptionDto]
      };

      vi.mocked(mockApiService.getExpiredPrescriptions).mockResolvedValue(mockResponse);

      const result = await repository.getExpired();

      expect(mockApiService.getExpiredPrescriptions).toHaveBeenCalledTimes(1);
      expect(PrescriptionMapper.toDomain).toHaveBeenCalledWith(expiredPrescriptionDto);
      expect(result).toHaveLength(1);
    });
  });

  describe('getByMedicationName', () => {
    it('should get prescriptions by medication name', async () => {
      const mockResponse: PrescriptionListResponse = {
        success: true,
        data: [mockPrescriptionDto]
      };

      vi.mocked(mockApiService.getPrescriptionsByMedicationName).mockResolvedValue(mockResponse);

      const result = await repository.getByMedicationName('Aspirin');

      expect(mockApiService.getPrescriptionsByMedicationName).toHaveBeenCalledWith('Aspirin');
      expect(PrescriptionMapper.toDomain).toHaveBeenCalledWith(mockPrescriptionDto);
      expect(result).toHaveLength(1);
      expect(result[0]).toBe(mockPrescription);
    });

    it('should handle empty medication name search', async () => {
      const mockResponse: PrescriptionListResponse = {
        success: true,
        data: []
      };

      vi.mocked(mockApiService.getPrescriptionsByMedicationName).mockResolvedValue(mockResponse);

      const result = await repository.getByMedicationName('NonexistentMedication');

      expect(result).toHaveLength(0);
    });
  });

  describe('mapDtoToPrescription', () => {
    it('should preserve populated patient and doctor data', async () => {
      const dtoWithPopulatedData = {
        ...mockPrescriptionDto,
        patient: {
          id: 'patient1',
          patientNumber: 'P001',
          firstName: 'John',
          lastName: 'Doe',
          middleName: 'M',
          fullName: 'John M Doe'
        },
        doctor: {
          id: 'doctor1',
          firstName: 'Jane',
          lastName: 'Smith',
          fullName: 'Dr. Jane Smith',
          specialization: 'Cardiology'
        }
      };

      const mockPrescriptionWithPopulatedData = {
        ...mockPrescription,
        _populatedPatient: undefined,
        _populatedDoctor: undefined
      } as Prescription & { _populatedPatient?: unknown; _populatedDoctor?: unknown };

      vi.mocked(PrescriptionMapper.toDomain).mockReturnValue(mockPrescriptionWithPopulatedData);

      const mockResponse: PrescriptionListResponse = {
        success: true,
        data: [dtoWithPopulatedData]
      };

      vi.mocked(mockApiService.getAllPrescriptions).mockResolvedValue(mockResponse);

      const result = await repository.getAll();

      expect((result[0] as unknown as { _populatedPatient?: unknown })._populatedPatient).toEqual(dtoWithPopulatedData.patient);
      expect((result[0] as unknown as { _populatedDoctor?: unknown })._populatedDoctor).toEqual(dtoWithPopulatedData.doctor);
    });

    it('should handle DTO without populated data', async () => {
      const dtoWithoutPopulatedData = {
        ...mockPrescriptionDto,
        patient: undefined,
        doctor: undefined
      };

      const mockResponse: PrescriptionListResponse = {
        success: true,
        data: [dtoWithoutPopulatedData]
      };

      vi.mocked(mockApiService.getAllPrescriptions).mockResolvedValue(mockResponse);

      await repository.getAll();

      expect(PrescriptionMapper.toDomain).toHaveBeenCalledWith(dtoWithoutPopulatedData);
    });
  });

  describe('error handling', () => {
    it('should handle API errors in getAll', async () => {
      vi.mocked(mockApiService.getAllPrescriptions).mockRejectedValue(new Error('API Error'));

      await expect(repository.getAll()).rejects.toThrow('API Error');
    });

    it('should handle API errors in create', async () => {
      vi.mocked(mockApiService.createPrescription).mockRejectedValue(new Error('Create Error'));

      await expect(repository.create(mockPrescription)).rejects.toThrow('Create Error');
    });

    it('should handle API errors in update', async () => {
      vi.mocked(mockApiService.updatePrescription).mockRejectedValue(new Error('Update Error'));

      await expect(repository.update('1', {})).rejects.toThrow('Update Error');
    });

    it('should handle API errors in delete', async () => {
      vi.mocked(mockApiService.deletePrescription).mockRejectedValue(new Error('Delete Error'));

      await expect(repository.delete('1')).rejects.toThrow('Delete Error');
    });
  });
});