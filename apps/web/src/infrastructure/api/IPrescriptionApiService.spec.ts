import { describe, it, expect } from 'vitest';
import { IPrescriptionApiService } from './IPrescriptionApiService';

describe('IPrescriptionApiService', () => {
  describe('interface contract', () => {
    it('should define all required methods with correct signatures', () => {
      const mockService: IPrescriptionApiService = {
        getAllPrescriptions: async () => ({ success: true, data: [] }),
        getPrescriptionById: async (id: string) => ({ success: true, data: {} as any }),
        createPrescription: async (prescriptionData: any) => ({ success: true, data: {} as any }),
        updatePrescription: async (id: string, updateData: any) => ({ success: true }),
        deletePrescription: async (id: string) => ({ success: true }),
        getPrescriptionsByPatientId: async (patientId: string) => ({ success: true, data: [] }),
        getPrescriptionsByDoctorId: async (doctorId: string) => ({ success: true, data: [] }),
        getActivePrescriptions: async () => ({ success: true, data: [] }),
        getExpiredPrescriptions: async () => ({ success: true, data: [] }),
        getPrescriptionsByMedicationName: async (medicationName: string) => ({ success: true, data: [] })
      };

      // Test all method definitions
      const methods = [
        'getAllPrescriptions',
        'getPrescriptionById', 
        'createPrescription',
        'updatePrescription',
        'deletePrescription',
        'getPrescriptionsByPatientId',
        'getPrescriptionsByDoctorId',
        'getActivePrescriptions',
        'getExpiredPrescriptions',
        'getPrescriptionsByMedicationName'
      ];

      methods.forEach(method => {
        expect(mockService[method as keyof IPrescriptionApiService]).toBeDefined();
        expect(typeof mockService[method as keyof IPrescriptionApiService]).toBe('function');
      });
    });

    it('should ensure all methods return Promises', async () => {
      const mockService: IPrescriptionApiService = {
        getAllPrescriptions: async () => ({ success: true, data: [] }),
        getPrescriptionById: async () => ({ success: true, data: {} as any }),
        createPrescription: async () => ({ success: true, data: {} as any }),
        updatePrescription: async () => ({ success: true }),
        deletePrescription: async () => ({ success: true }),
        getPrescriptionsByPatientId: async () => ({ success: true, data: [] }),
        getPrescriptionsByDoctorId: async () => ({ success: true, data: [] }),
        getActivePrescriptions: async () => ({ success: true, data: [] }),
        getExpiredPrescriptions: async () => ({ success: true, data: [] }),
        getPrescriptionsByMedicationName: async () => ({ success: true, data: [] })
      };

      const results = await Promise.all([
        mockService.getAllPrescriptions(),
        mockService.getPrescriptionById('id'),
        mockService.createPrescription({}),
        mockService.updatePrescription('id', {}),
        mockService.deletePrescription('id'),
        mockService.getPrescriptionsByPatientId('patient-id'),
        mockService.getPrescriptionsByDoctorId('doctor-id'),
        mockService.getActivePrescriptions(),
        mockService.getExpiredPrescriptions(),
        mockService.getPrescriptionsByMedicationName('medication')
      ]);

      results.forEach(result => {
        expect(result).toBeDefined();
      });
    });
  });
});