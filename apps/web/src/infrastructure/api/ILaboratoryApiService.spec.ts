import { describe, it, expect } from 'vitest';
import { ILaboratoryApiService } from './ILaboratoryApiService';
import { 
  CreateLabRequestCommand,
  LabRequestResponse,
  LabRequestListResponse,
  LabTestListResponse,
  LaboratoryOperationResponse,
  CreateLabTestResultRequestDto,
  UpdateLabTestResultRequestDto,
  LabTestResultResponse
} from '@nx-starter/application-shared';

describe('ILaboratoryApiService', () => {
  describe('interface contract', () => {
    it('should define all required methods with correct signatures', () => {
      const mockService: ILaboratoryApiService = {
        createLabRequest: async (command: CreateLabRequestCommand) => ({} as LabRequestResponse),
        getAllLabRequests: async () => ({} as LabRequestListResponse),
        getCompletedLabRequests: async () => ({} as LabRequestListResponse),
        getLabRequestByPatientId: async (patientId: string) => ({} as LabRequestResponse),
        getLabTestsByPatientId: async (patientId: string) => ({} as LabTestListResponse),
        updateLabRequestResults: async (patientId: string, requestDate: string, results: Record<string, string>) => ({} as LaboratoryOperationResponse),
        createLabTestResult: async (request: CreateLabTestResultRequestDto) => ({} as LabTestResultResponse),
        getLabTestResultById: async (id: string) => ({} as LabTestResultResponse),
        getLabTestResultByLabRequestId: async (labRequestId: string) => ({} as LabTestResultResponse),
        updateLabTestResult: async (id: string, request: UpdateLabTestResultRequestDto) => ({} as LabTestResultResponse),
        cancelLabRequest: async (id: string) => ({} as LaboratoryOperationResponse)
      };

      expect(mockService.createLabRequest).toBeDefined();
      expect(mockService.getAllLabRequests).toBeDefined();
      expect(mockService.getCompletedLabRequests).toBeDefined();
      expect(mockService.getLabRequestByPatientId).toBeDefined();
      expect(mockService.getLabTestsByPatientId).toBeDefined();
      expect(mockService.updateLabRequestResults).toBeDefined();
      expect(mockService.createLabTestResult).toBeDefined();
      expect(mockService.getLabTestResultById).toBeDefined();
      expect(mockService.getLabTestResultByLabRequestId).toBeDefined();
      expect(mockService.updateLabTestResult).toBeDefined();
      expect(mockService.cancelLabRequest).toBeDefined();
    });

    it('should ensure all methods return Promises', async () => {
      const mockService: ILaboratoryApiService = {
        createLabRequest: async () => ({ success: true } as LabRequestResponse),
        getAllLabRequests: async () => ({ success: true, data: [] } as LabRequestListResponse),
        getCompletedLabRequests: async () => ({ success: true, data: [] } as LabRequestListResponse),
        getLabRequestByPatientId: async () => ({ success: true } as LabRequestResponse),
        getLabTestsByPatientId: async () => ({ success: true, data: [] } as LabTestListResponse),
        updateLabRequestResults: async () => ({ success: true } as LaboratoryOperationResponse),
        createLabTestResult: async () => ({ success: true } as LabTestResultResponse),
        getLabTestResultById: async () => ({ success: true } as LabTestResultResponse),
        getLabTestResultByLabRequestId: async () => ({ success: true } as LabTestResultResponse),
        updateLabTestResult: async () => ({ success: true } as LabTestResultResponse),
        cancelLabRequest: async () => ({ success: true } as LaboratoryOperationResponse)
      };

      const results = await Promise.all([
        mockService.createLabRequest({} as CreateLabRequestCommand),
        mockService.getAllLabRequests(),
        mockService.getCompletedLabRequests(),
        mockService.getLabRequestByPatientId('patient-1'),
        mockService.getLabTestsByPatientId('patient-1'),
        mockService.updateLabRequestResults('patient-1', '2024-01-01', {}),
        mockService.createLabTestResult({} as CreateLabTestResultRequestDto),
        mockService.getLabTestResultById('result-1'),
        mockService.getLabTestResultByLabRequestId('request-1'),
        mockService.updateLabTestResult('result-1', {} as UpdateLabTestResultRequestDto),
        mockService.cancelLabRequest('request-1')
      ]);

      results.forEach(result => {
        expect(result).toBeDefined();
      });
    });
  });
});