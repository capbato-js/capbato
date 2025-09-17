import { describe, it, expect, vi, beforeEach } from 'vitest';
import { LaboratoryApiService } from './LaboratoryApiService';
import { IHttpClient } from '../http/IHttpClient';
import { 
  CreateLabRequestCommand, 
  CreateLabTestResultRequestDto,
  UpdateLabTestResultRequestDto,
  LabRequestResponse,
  LabRequestListResponse,
  LabTestListResponse,
  LaboratoryOperationResponse,
  LabTestResultResponse,
  TOKENS 
} from '@nx-starter/application-shared';

describe('LaboratoryApiService', () => {
  let laboratoryService: LaboratoryApiService;
  let mockHttpClient: IHttpClient;

  beforeEach(() => {
    mockHttpClient = {
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      delete: vi.fn()
    };

    laboratoryService = new LaboratoryApiService(mockHttpClient);
  });

  describe('createLabRequest', () => {
    it('should create lab request successfully', async () => {
      const createCommand: CreateLabRequestCommand = {
        patientId: 'patient-1',
        doctorId: 'doctor-1',
        testType: 'CBC',
        priority: 'normal',
        notes: 'Routine checkup'
      };

      const mockResponse: LabRequestResponse = {
        success: true,
        data: {
          id: 'lab-request-1',
          patientId: 'patient-1',
          doctorId: 'doctor-1',
          testType: 'CBC',
          priority: 'normal',
          status: 'pending',
          notes: 'Routine checkup',
          requestDate: new Date(),
          createdAt: new Date(),
          updatedAt: new Date()
        }
      };

      vi.mocked(mockHttpClient.post).mockResolvedValue({ data: mockResponse });

      const result = await laboratoryService.createLabRequest(createCommand);

      expect(mockHttpClient.post).toHaveBeenCalledWith('/api/laboratory/requests', createCommand);
      expect(result).toEqual(mockResponse);
    });

    it('should handle errors gracefully', async () => {
      const createCommand: CreateLabRequestCommand = {
        patientId: 'patient-1',
        doctorId: 'doctor-1',
        testType: 'Invalid Test',
        priority: 'urgent'
      };

      const error = new Error('Validation failed');
      vi.mocked(mockHttpClient.post).mockRejectedValue(error);

      // Mock console.error to avoid test output pollution
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const result = await laboratoryService.createLabRequest(createCommand);

      expect(result).toEqual({
        success: false,
        message: 'Validation failed'
      });
      expect(consoleSpy).toHaveBeenCalledWith('❌ Error creating lab request:', error);

      consoleSpy.mockRestore();
    });

    it('should handle unknown errors', async () => {
      const createCommand: CreateLabRequestCommand = {
        patientId: 'patient-1',
        doctorId: 'doctor-1',
        testType: 'CBC',
        priority: 'normal'
      };

      vi.mocked(mockHttpClient.post).mockRejectedValue('Unknown error');

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const result = await laboratoryService.createLabRequest(createCommand);

      expect(result).toEqual({
        success: false,
        message: 'Failed to create lab request'
      });

      consoleSpy.mockRestore();
    });
  });

  describe('getAllLabRequests', () => {
    it('should get all lab requests successfully', async () => {
      const mockResponse: LabRequestListResponse = {
        success: true,
        data: [
          {
            id: 'lab-request-1',
            patientId: 'patient-1',
            doctorId: 'doctor-1',
            testType: 'CBC',
            priority: 'normal',
            status: 'pending',
            notes: 'Test request',
            requestDate: new Date(),
            createdAt: new Date(),
            updatedAt: new Date()
          }
        ]
      };

      vi.mocked(mockHttpClient.get).mockResolvedValue({ data: mockResponse });

      const result = await laboratoryService.getAllLabRequests();

      expect(mockHttpClient.get).toHaveBeenCalledWith('/api/laboratory/requests');
      expect(result).toEqual(mockResponse);
    });

    it('should handle errors gracefully', async () => {
      const error = new Error('Network error');
      vi.mocked(mockHttpClient.get).mockRejectedValue(error);

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const result = await laboratoryService.getAllLabRequests();

      expect(result).toEqual({
        success: false,
        message: 'Network error',
        data: []
      });

      consoleSpy.mockRestore();
    });
  });

  describe('getCompletedLabRequests', () => {
    it('should get completed lab requests successfully', async () => {
      const mockResponse: LabRequestListResponse = {
        success: true,
        data: [
          {
            id: 'lab-request-2',
            patientId: 'patient-2',
            doctorId: 'doctor-2',
            testType: 'Blood Sugar',
            priority: 'urgent',
            status: 'completed',
            notes: 'Completed test',
            requestDate: new Date(),
            createdAt: new Date(),
            updatedAt: new Date()
          }
        ]
      };

      vi.mocked(mockHttpClient.get).mockResolvedValue({ data: mockResponse });

      const result = await laboratoryService.getCompletedLabRequests();

      expect(mockHttpClient.get).toHaveBeenCalledWith('/api/laboratory/requests/completed');
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getLabRequestByPatientId', () => {
    it('should get lab request by patient ID successfully', async () => {
      const patientId = 'patient-1';
      const mockResponse: LabRequestResponse = {
        success: true,
        data: {
          id: 'lab-request-1',
          patientId,
          doctorId: 'doctor-1',
          testType: 'Lipid Panel',
          priority: 'normal',
          status: 'pending',
          notes: 'Cholesterol check',
          requestDate: new Date(),
          createdAt: new Date(),
          updatedAt: new Date()
        }
      };

      vi.mocked(mockHttpClient.get).mockResolvedValue({ data: mockResponse });

      const result = await laboratoryService.getLabRequestByPatientId(patientId);

      expect(mockHttpClient.get).toHaveBeenCalledWith(`/api/laboratory/requests/${patientId}`);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getLabTestsByPatientId', () => {
    it('should get lab tests by patient ID successfully', async () => {
      const patientId = 'patient-1';
      const mockResponse: LabTestListResponse = {
        success: true,
        data: [
          {
            id: 'test-1',
            patientId,
            testName: 'CBC',
            result: 'Normal',
            testDate: new Date(),
            doctorId: 'doctor-1',
            notes: 'All values within normal range'
          }
        ]
      };

      vi.mocked(mockHttpClient.get).mockResolvedValue({ data: mockResponse });

      const result = await laboratoryService.getLabTestsByPatientId(patientId);

      expect(mockHttpClient.get).toHaveBeenCalledWith(`/api/laboratory/lab-tests/${patientId}`);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('updateLabRequestResults', () => {
    it('should update lab request results successfully', async () => {
      const patientId = 'patient-1';
      const requestDate = '2024-01-01';
      const results = {
        'Hemoglobin': '12.5 g/dL',
        'WBC Count': '7500/µL',
        'Platelet Count': '300,000/µL'
      };

      const mockResponse: LaboratoryOperationResponse = {
        success: true,
        message: 'Lab request results updated successfully'
      };

      vi.mocked(mockHttpClient.put).mockResolvedValue({ data: mockResponse });

      const result = await laboratoryService.updateLabRequestResults(patientId, requestDate, results);

      expect(mockHttpClient.put).toHaveBeenCalledWith(
        `/api/laboratory/requests/${patientId}/results`,
        { requestDate, results }
      );
      expect(result).toEqual(mockResponse);
    });

    it('should handle update errors gracefully', async () => {
      const patientId = 'patient-1';
      const requestDate = '2024-01-01';
      const results = { 'Test': 'Result' };

      const error = new Error('Update failed');
      vi.mocked(mockHttpClient.put).mockRejectedValue(error);

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const result = await laboratoryService.updateLabRequestResults(patientId, requestDate, results);

      expect(result).toEqual({
        success: false,
        message: 'Update failed'
      });

      consoleSpy.mockRestore();
    });
  });

  describe('createLabTestResult', () => {
    it('should create lab test result successfully', async () => {
      const request: CreateLabTestResultRequestDto = {
        labRequestId: 'lab-request-1',
        testResults: {
          'Glucose': '95 mg/dL',
          'Cholesterol': '180 mg/dL'
        },
        notes: 'Normal results',
        completedDate: new Date()
      };

      const mockResponse: LabTestResultResponse = {
        success: true,
        data: {
          id: 'result-1',
          labRequestId: 'lab-request-1',
          testResults: request.testResults,
          notes: 'Normal results',
          completedDate: request.completedDate!,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      };

      vi.mocked(mockHttpClient.post).mockResolvedValue({ data: mockResponse });

      const result = await laboratoryService.createLabTestResult(request);

      expect(mockHttpClient.post).toHaveBeenCalledWith('/api/laboratory/test-results', request);
      expect(result).toEqual(mockResponse);
    });

    it('should handle creation errors gracefully', async () => {
      const request: CreateLabTestResultRequestDto = {
        labRequestId: 'invalid-id',
        testResults: {},
        notes: 'Test'
      };

      const error = new Error('Invalid lab request ID');
      vi.mocked(mockHttpClient.post).mockRejectedValue(error);

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const result = await laboratoryService.createLabTestResult(request);

      expect(result).toEqual({
        success: false,
        message: 'Invalid lab request ID'
      });

      consoleSpy.mockRestore();
    });
  });

  describe('getLabTestResultById', () => {
    it('should get lab test result by ID successfully', async () => {
      const resultId = 'result-1';
      const mockResponse: LabTestResultResponse = {
        success: true,
        data: {
          id: resultId,
          labRequestId: 'lab-request-1',
          testResults: {
            'Hemoglobin': '13.2 g/dL',
            'Hematocrit': '40%'
          },
          notes: 'Slightly elevated',
          completedDate: new Date(),
          createdAt: new Date(),
          updatedAt: new Date()
        }
      };

      vi.mocked(mockHttpClient.get).mockResolvedValue({ data: mockResponse });

      const result = await laboratoryService.getLabTestResultById(resultId);

      expect(mockHttpClient.get).toHaveBeenCalledWith(`/api/laboratory/test-results/${resultId}`);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getLabTestResultByLabRequestId', () => {
    it('should get lab test result by lab request ID successfully', async () => {
      const labRequestId = 'lab-request-1';
      const mockResponse: LabTestResultResponse = {
        success: true,
        data: {
          id: 'result-1',
          labRequestId,
          testResults: {
            'Total Protein': '7.2 g/dL',
            'Albumin': '4.1 g/dL'
          },
          notes: 'Normal protein levels',
          completedDate: new Date(),
          createdAt: new Date(),
          updatedAt: new Date()
        }
      };

      vi.mocked(mockHttpClient.get).mockResolvedValue({ data: mockResponse });

      const result = await laboratoryService.getLabTestResultByLabRequestId(labRequestId);

      expect(mockHttpClient.get).toHaveBeenCalledWith(`/api/laboratory/test-results/by-request/${labRequestId}`);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('updateLabTestResult', () => {
    it('should update lab test result successfully', async () => {
      const resultId = 'result-1';
      const request: UpdateLabTestResultRequestDto = {
        testResults: {
          'Updated Test': 'Updated Result'
        },
        notes: 'Updated notes'
      };

      const mockResponse: LabTestResultResponse = {
        success: true,
        data: {
          id: resultId,
          labRequestId: 'lab-request-1',
          testResults: request.testResults!,
          notes: request.notes!,
          completedDate: new Date(),
          createdAt: new Date(),
          updatedAt: new Date()
        }
      };

      vi.mocked(mockHttpClient.put).mockResolvedValue({ data: mockResponse });

      const result = await laboratoryService.updateLabTestResult(resultId, request);

      expect(mockHttpClient.put).toHaveBeenCalledWith(`/api/laboratory/test-results/${resultId}`, request);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('cancelLabRequest', () => {
    it('should cancel lab request successfully', async () => {
      const requestId = 'lab-request-1';
      const mockResponse: LaboratoryOperationResponse = {
        success: true,
        message: 'Lab request cancelled successfully'
      };

      vi.mocked(mockHttpClient.put).mockResolvedValue({ data: mockResponse });

      const result = await laboratoryService.cancelLabRequest(requestId);

      expect(mockHttpClient.put).toHaveBeenCalledWith(`/api/laboratory/requests/${requestId}/cancel`);
      expect(result).toEqual(mockResponse);
    });

    it('should handle cancellation errors gracefully', async () => {
      const requestId = 'lab-request-1';
      const error = new Error('Cannot cancel completed request');
      vi.mocked(mockHttpClient.put).mockRejectedValue(error);

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const result = await laboratoryService.cancelLabRequest(requestId);

      expect(result).toEqual({
        success: false,
        message: 'Cannot cancel completed request'
      });

      consoleSpy.mockRestore();
    });
  });

  describe('error handling edge cases', () => {
    it('should handle network errors gracefully', async () => {
      const error = new Error('Network failure');
      vi.mocked(mockHttpClient.get).mockRejectedValue(error);

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const result = await laboratoryService.getAllLabRequests();

      expect(result.success).toBe(false);
      expect(result.message).toBe('Network failure');

      consoleSpy.mockRestore();
    });

    it('should handle creation errors gracefully', async () => {
      const error = new Error('Creation failed');
      vi.mocked(mockHttpClient.post).mockRejectedValue(error);

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const result = await laboratoryService.createLabRequest({
        patientId: 'patient-1',
        doctorId: 'doctor-1',
        testType: 'CBC',
        priority: 'normal'
      });

      expect(result.success).toBe(false);
      expect(result.message).toBe('Creation failed');

      consoleSpy.mockRestore();
    });
  });
});