import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PrescriptionApiService } from './PrescriptionApiService';
import { IHttpClient } from '../http/IHttpClient';
import { 
  PrescriptionListResponse,
  PrescriptionResponse,
  PrescriptionOperationResponse,
  CreatePrescriptionRequestDto,
  UpdatePrescriptionRequestDto,
  TOKENS
} from '@nx-starter/application-shared';

// Mock API config
vi.mock('./config/ApiConfig', () => ({
  getApiConfig: () => ({
    endpoints: {
      prescriptions: {
        all: '/api/prescriptions',
        byId: (id: string) => `/api/prescriptions/${id}`,
        create: '/api/prescriptions',
        update: (id: string) => `/api/prescriptions/${id}`,
        delete: (id: string) => `/api/prescriptions/${id}`,
        byPatientId: (patientId: string) => `/api/prescriptions/patient/${patientId}`,
        byDoctorId: (doctorId: string) => `/api/prescriptions/doctor/${doctorId}`,
        active: '/api/prescriptions/active',
        expired: '/api/prescriptions/expired',
        byMedicationName: (medicationName: string) => `/api/prescriptions/medication/${medicationName}`
      }
    }
  })
}));

describe('PrescriptionApiService', () => {
  let prescriptionService: PrescriptionApiService;
  let mockHttpClient: IHttpClient;

  beforeEach(() => {
    mockHttpClient = {
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      delete: vi.fn()
    };

    prescriptionService = new PrescriptionApiService(mockHttpClient);
  });

  describe('getAllPrescriptions', () => {
    it('should get all prescriptions successfully', async () => {
      const mockResponse: PrescriptionListResponse = {
        success: true,
        data: [
          {
            id: 'prescription-1',
            patientId: 'patient-1',
            doctorId: 'doctor-1',
            medicationName: 'Amoxicillin',
            dosage: '500mg',
            frequency: '3 times daily',
            duration: '7 days',
            instructions: 'Take with food',
            dateIssued: new Date(),
            expirationDate: new Date(),
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
          }
        ]
      };

      vi.mocked(mockHttpClient.get).mockResolvedValue({ data: mockResponse });

      const result = await prescriptionService.getAllPrescriptions();

      expect(mockHttpClient.get).toHaveBeenCalledWith('/api/prescriptions');
      expect(result).toEqual(mockResponse);
    });

    it('should throw error when request fails', async () => {
      const mockResponse = { data: { success: false } };
      vi.mocked(mockHttpClient.get).mockResolvedValue(mockResponse);

      await expect(prescriptionService.getAllPrescriptions()).rejects.toThrow('Failed to fetch prescriptions');
    });
  });

  describe('getPrescriptionById', () => {
    it('should get prescription by id successfully', async () => {
      const prescriptionId = 'prescription-1';
      const mockResponse: PrescriptionResponse = {
        success: true,
        data: {
          id: prescriptionId,
          patientId: 'patient-1',
          doctorId: 'doctor-1',
          medicationName: 'Paracetamol',
          dosage: '500mg',
          frequency: '4 times daily',
          duration: '3 days',
          instructions: 'Take as needed for pain',
          dateIssued: new Date(),
          expirationDate: new Date(),
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      };

      vi.mocked(mockHttpClient.get).mockResolvedValue({ 
        data: mockResponse,
        status: 200
      });

      const result = await prescriptionService.getPrescriptionById(prescriptionId);

      expect(mockHttpClient.get).toHaveBeenCalledWith(`/api/prescriptions/${prescriptionId}`);
      expect(result).toEqual(mockResponse);
    });

    it('should throw error when prescription not found (404 status)', async () => {
      vi.mocked(mockHttpClient.get).mockResolvedValue({ 
        data: { success: false },
        status: 404
      });

      await expect(prescriptionService.getPrescriptionById('non-existent')).rejects.toThrow('Prescription not found');
    });

    it('should throw error when request fails (non-success response)', async () => {
      vi.mocked(mockHttpClient.get).mockResolvedValue({ 
        data: { success: false },
        status: 200
      });

      await expect(prescriptionService.getPrescriptionById('prescription-1')).rejects.toThrow('Failed to fetch prescription');
    });

    it('should handle 404 errors from http client', async () => {
      const error = new Error('Request failed with status code 404');
      vi.mocked(mockHttpClient.get).mockRejectedValue(error);

      await expect(prescriptionService.getPrescriptionById('non-existent')).rejects.toThrow('Prescription not found');
    });

    it('should re-throw non-404 errors', async () => {
      const error = new Error('Network error');
      vi.mocked(mockHttpClient.get).mockRejectedValue(error);

      await expect(prescriptionService.getPrescriptionById('prescription-1')).rejects.toThrow('Network error');
    });
  });

  describe('createPrescription', () => {
    it('should create prescription successfully', async () => {
      const prescriptionData: CreatePrescriptionRequestDto = {
        patientId: 'patient-1',
        doctorId: 'doctor-1',
        medicationName: 'Ibuprofen',
        dosage: '400mg',
        frequency: '2 times daily',
        duration: '5 days',
        instructions: 'Take with meals'
      };

      const mockResponse: PrescriptionResponse = {
        success: true,
        data: {
          id: 'new-prescription-id',
          ...prescriptionData,
          dateIssued: new Date(),
          expirationDate: new Date(),
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      };

      vi.mocked(mockHttpClient.post).mockResolvedValue({ data: mockResponse });

      const result = await prescriptionService.createPrescription(prescriptionData);

      expect(mockHttpClient.post).toHaveBeenCalledWith('/api/prescriptions', prescriptionData);
      expect(result).toEqual(mockResponse);
    });

    it('should throw error when creation fails', async () => {
      const prescriptionData: CreatePrescriptionRequestDto = {
        patientId: 'patient-1',
        doctorId: 'doctor-1',
        medicationName: 'Aspirin',
        dosage: '100mg',
        frequency: 'daily',
        duration: '30 days'
      };

      const mockResponse = { data: { success: false } };
      vi.mocked(mockHttpClient.post).mockResolvedValue(mockResponse);

      await expect(prescriptionService.createPrescription(prescriptionData)).rejects.toThrow('Failed to create prescription');
    });
  });

  describe('updatePrescription', () => {
    it('should update prescription successfully', async () => {
      const prescriptionId = 'prescription-1';
      const updateData: UpdatePrescriptionRequestDto = {
        dosage: '600mg',
        frequency: '2 times daily',
        instructions: 'Updated instructions'
      };

      const mockResponse: PrescriptionOperationResponse = {
        success: true,
        message: 'Prescription updated successfully'
      };

      vi.mocked(mockHttpClient.put).mockResolvedValue({ data: mockResponse });

      const result = await prescriptionService.updatePrescription(prescriptionId, updateData);

      expect(mockHttpClient.put).toHaveBeenCalledWith(`/api/prescriptions/${prescriptionId}`, updateData);
      expect(result).toEqual(mockResponse);
    });

    it('should throw error when update fails', async () => {
      const prescriptionId = 'prescription-1';
      const updateData: UpdatePrescriptionRequestDto = {
        dosage: '600mg'
      };

      const mockResponse = { status: 400, data: { success: false } };
      vi.mocked(mockHttpClient.put).mockResolvedValue(mockResponse);

      await expect(prescriptionService.updatePrescription(prescriptionId, updateData)).rejects.toThrow('Failed to update prescription');
    });
  });

  describe('deletePrescription', () => {
    it('should delete prescription successfully', async () => {
      const prescriptionId = 'prescription-1';
      const mockResponse: PrescriptionOperationResponse = {
        success: true,
        message: 'Prescription deleted successfully'
      };

      vi.mocked(mockHttpClient.delete).mockResolvedValue({ data: mockResponse });

      const result = await prescriptionService.deletePrescription(prescriptionId);

      expect(mockHttpClient.delete).toHaveBeenCalledWith(`/api/prescriptions/${prescriptionId}`);
      expect(result).toEqual(mockResponse);
    });

    it('should throw error when deletion fails', async () => {
      const prescriptionId = 'prescription-1';
      const mockResponse = { status: 404, data: { success: false } };
      vi.mocked(mockHttpClient.delete).mockResolvedValue(mockResponse);

      await expect(prescriptionService.deletePrescription(prescriptionId)).rejects.toThrow('Failed to delete prescription');
    });
  });

  describe('getPrescriptionsByPatientId', () => {
    it('should get prescriptions by patient id successfully', async () => {
      const patientId = 'patient-1';
      const mockResponse: PrescriptionListResponse = {
        success: true,
        data: [
          {
            id: 'prescription-1',
            patientId,
            doctorId: 'doctor-1',
            medicationName: 'Vitamin D',
            dosage: '1000 IU',
            frequency: 'daily',
            duration: '30 days',
            instructions: 'Take with breakfast',
            dateIssued: new Date(),
            expirationDate: new Date(),
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
          }
        ]
      };

      vi.mocked(mockHttpClient.get).mockResolvedValue({ data: mockResponse });

      const result = await prescriptionService.getPrescriptionsByPatientId(patientId);

      expect(mockHttpClient.get).toHaveBeenCalledWith(`/api/prescriptions/patient/${patientId}`);
      expect(result).toEqual(mockResponse);
    });

    it('should throw error when request fails', async () => {
      const patientId = 'patient-1';
      const mockResponse = { data: { success: false } };
      vi.mocked(mockHttpClient.get).mockResolvedValue(mockResponse);

      await expect(prescriptionService.getPrescriptionsByPatientId(patientId)).rejects.toThrow('Failed to fetch prescriptions by patient ID');
    });
  });

  describe('getPrescriptionsByDoctorId', () => {
    it('should get prescriptions by doctor id successfully', async () => {
      const doctorId = 'doctor-1';
      const mockResponse: PrescriptionListResponse = {
        success: true,
        data: [
          {
            id: 'prescription-2',
            patientId: 'patient-2',
            doctorId,
            medicationName: 'Antibiotic',
            dosage: '250mg',
            frequency: '2 times daily',
            duration: '10 days',
            instructions: 'Complete the full course',
            dateIssued: new Date(),
            expirationDate: new Date(),
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
          }
        ]
      };

      vi.mocked(mockHttpClient.get).mockResolvedValue({ data: mockResponse });

      const result = await prescriptionService.getPrescriptionsByDoctorId(doctorId);

      expect(mockHttpClient.get).toHaveBeenCalledWith(`/api/prescriptions/doctor/${doctorId}`);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getActivePrescriptions', () => {
    it('should get active prescriptions successfully', async () => {
      const mockResponse: PrescriptionListResponse = {
        success: true,
        data: [
          {
            id: 'prescription-3',
            patientId: 'patient-3',
            doctorId: 'doctor-1',
            medicationName: 'Blood Pressure Medication',
            dosage: '10mg',
            frequency: 'daily',
            duration: 'ongoing',
            instructions: 'Take in the morning',
            dateIssued: new Date(),
            expirationDate: new Date(),
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
          }
        ]
      };

      vi.mocked(mockHttpClient.get).mockResolvedValue({ data: mockResponse });

      const result = await prescriptionService.getActivePrescriptions();

      expect(mockHttpClient.get).toHaveBeenCalledWith('/api/prescriptions/active');
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getExpiredPrescriptions', () => {
    it('should get expired prescriptions successfully', async () => {
      const mockResponse: PrescriptionListResponse = {
        success: true,
        data: []
      };

      vi.mocked(mockHttpClient.get).mockResolvedValue({ data: mockResponse });

      const result = await prescriptionService.getExpiredPrescriptions();

      expect(mockHttpClient.get).toHaveBeenCalledWith('/api/prescriptions/expired');
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getPrescriptionsByMedicationName', () => {
    it('should get prescriptions by medication name successfully', async () => {
      const medicationName = 'Paracetamol';
      const mockResponse: PrescriptionListResponse = {
        success: true,
        data: [
          {
            id: 'prescription-4',
            patientId: 'patient-4',
            doctorId: 'doctor-2',
            medicationName,
            dosage: '500mg',
            frequency: 'as needed',
            duration: '7 days',
            instructions: 'For fever and pain',
            dateIssued: new Date(),
            expirationDate: new Date(),
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
          }
        ]
      };

      vi.mocked(mockHttpClient.get).mockResolvedValue({ data: mockResponse });

      const result = await prescriptionService.getPrescriptionsByMedicationName(medicationName);

      expect(mockHttpClient.get).toHaveBeenCalledWith(`/api/prescriptions/medication/${encodeURIComponent(medicationName)}`);
      expect(result).toEqual(mockResponse);
    });

    it('should handle special characters in medication name', async () => {
      const medicationName = 'Co-trimoxazole 800/160mg';
      const mockResponse: PrescriptionListResponse = {
        success: true,
        data: []
      };

      vi.mocked(mockHttpClient.get).mockResolvedValue({ data: mockResponse });

      await prescriptionService.getPrescriptionsByMedicationName(medicationName);

      expect(mockHttpClient.get).toHaveBeenCalledWith(`/api/prescriptions/medication/${medicationName}`);
    });
  });

  describe('edge cases', () => {
    it('should handle null response data', async () => {
      vi.mocked(mockHttpClient.get).mockResolvedValue({ data: null });

      await expect(prescriptionService.getAllPrescriptions()).rejects.toThrow();
    });

    it('should handle empty medication name', async () => {
      const mockResponse: PrescriptionListResponse = {
        success: true,
        data: []
      };

      vi.mocked(mockHttpClient.get).mockResolvedValue({ data: mockResponse });

      const result = await prescriptionService.getPrescriptionsByMedicationName('');

      expect(result).toEqual(mockResponse);
    });

    it('should handle empty prescription ID in update', async () => {
      const updateData: UpdatePrescriptionRequestDto = {
        dosage: '100mg'
      };

      const mockResponse = { status: 400, data: { success: false } };
      vi.mocked(mockHttpClient.put).mockResolvedValue(mockResponse);

      await expect(prescriptionService.updatePrescription('', updateData)).rejects.toThrow('Failed to update prescription');
    });
  });
});