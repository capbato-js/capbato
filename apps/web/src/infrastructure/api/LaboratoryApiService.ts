import { injectable, inject } from 'tsyringe';
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
import { IHttpClient } from '../http/IHttpClient';
import { ILaboratoryApiService } from './ILaboratoryApiService';

/**
 * API Service for Laboratory Operations
 * Handles HTTP communication with laboratory endpoints
 */
@injectable()
export class LaboratoryApiService implements ILaboratoryApiService {
  constructor(
    @inject(TOKENS.HttpClient) private httpClient: IHttpClient
  ) {}

  /**
   * Create a new laboratory test request
   */
  async createLabRequest(command: CreateLabRequestCommand): Promise<LabRequestResponse> {
    try {
      const response = await this.httpClient.post<LabRequestResponse>('/api/laboratory/requests', command);
      
      
      // The backend already returns { success: true, data: LabRequestDto }
      // So we can return it directly
      return response.data;
    } catch (error) {
      console.error('❌ Error creating lab request:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to create lab request'
      } as LabRequestResponse;
    }
  }

  /**
   * Get all laboratory test requests
   */
  async getAllLabRequests(): Promise<LabRequestListResponse> {
    try {
      
      const response = await this.httpClient.get<LabRequestListResponse>('/api/laboratory/requests');
      
      
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching lab requests:', error);
      
      
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to fetch lab requests',
        data: []
      };
    }
  }
  
  /**
   * Get laboratory test request by patient ID
   */
  async getLabRequestByPatientId(patientId: string): Promise<LabRequestResponse> {
    try {
      
      const response = await this.httpClient.get<LabRequestResponse>(`/api/laboratory/requests/${patientId}`);
      
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching lab request for patient:', patientId, error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to fetch lab request'
      } as LabRequestResponse;
    }
  }

  /**
   * Get lab tests by patient ID (formatted for frontend)
   */
  async getLabTestsByPatientId(patientId: string): Promise<LabTestListResponse> {
    try {
      const response = await this.httpClient.get<LabTestListResponse>(`/api/laboratory/lab-tests/${patientId}`);
    
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching lab tests for patient:', patientId, error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to fetch lab tests',
        data: []
      };
    }
  }

  /**
   * Update laboratory test results
   */
  async updateLabRequestResults(
    patientId: string, 
    requestDate: string, 
    results: Record<string, string>
  ): Promise<LaboratoryOperationResponse> {
    try {
      
      const response = await this.httpClient.put<{ message: string }>(
        `/api/laboratory/requests/${patientId}/results`,
        { requestDate, results }
      );
      
      return {
        success: true,
        message: response.data.message || 'Lab results updated successfully'
      };
    } catch (error) {
      console.error('❌ Error updating lab results:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to update lab results'
      };
    }
  }

  /**
   * Get completed laboratory test requests
   */
  async getCompletedLabRequests(): Promise<LabRequestListResponse> {
    try {
      
      const response = await this.httpClient.get<LabRequestListResponse>('/api/laboratory/requests/completed');
      
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching completed lab requests:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to fetch completed lab requests',
        data: []
      };
    }
  }

  /**
   * Create lab test result
   */
  async createLabTestResult(request: CreateLabTestResultRequestDto): Promise<LabTestResultResponse> {
    try {
      
      const response = await this.httpClient.post<LabTestResultResponse>('/api/laboratory/test-results', request);
      
      return response.data;
    } catch (error) {
      console.error('❌ Error creating lab test result:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to create lab test result'
      } as LabTestResultResponse;
    }
  }

  /**
   * Get lab test result by ID
   */
  async getLabTestResultById(id: string): Promise<LabTestResultResponse> {
    try {
      
      const response = await this.httpClient.get<LabTestResultResponse>(`/api/laboratory/test-results/${id}`);
      
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching lab test result for ID:', id, error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to fetch lab test result'
      } as LabTestResultResponse;
    }
  }

  /**
   * Get lab test result by lab request ID
   */
  async getLabTestResultByLabRequestId(labRequestId: string): Promise<LabTestResultResponse> {
    try {
      
      const response = await this.httpClient.get<LabTestResultResponse>(`/api/laboratory/test-results/by-request/${labRequestId}`);
      
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching lab test result for lab request ID:', labRequestId, error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to fetch lab test result'
      } as LabTestResultResponse;
    }
  }

  /**
   * Update lab test result by ID
   */
  async updateLabTestResult(id: string, request: UpdateLabTestResultRequestDto): Promise<LabTestResultResponse> {
    try {
      
      const response = await this.httpClient.put<LabTestResultResponse>(`/api/laboratory/test-results/${id}`, request);
      
      return response.data;
    } catch (error) {
      console.error('❌ Error updating lab test result:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to update lab test result'
      } as LabTestResultResponse;
    }
  }

  /**
   * Cancel a lab request
   */
  async cancelLabRequest(id: string): Promise<LaboratoryOperationResponse> {
    try {

      const response = await this.httpClient.put(`/api/laboratory/requests/${id}/cancel`);
      
      return response.data;
    } catch (error) {
      console.error('❌ Error cancelling lab request:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to cancel lab request'
      } as LaboratoryOperationResponse;
    }
  }
}