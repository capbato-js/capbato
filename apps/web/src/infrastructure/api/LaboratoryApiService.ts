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
      console.log('📋 Creating lab request:', command);
      
      const response = await this.httpClient.post<LabRequestResponse>('/api/laboratory/requests', command);
      
      console.log('✅ Lab request created successfully:', response.data);
      
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
      console.log('📋 Fetching all lab requests from:', '/api/laboratory/requests');
      
      const response = await this.httpClient.get<LabRequestListResponse>('/api/laboratory/requests');
      
      console.log('🔍 Raw API response:', response);
      console.log('📊 Response data:', response.data);
      console.log('✅ Lab requests fetched successfully:', response.data?.data?.length || 0, 'items');
      
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching lab requests:', error);
      
      // Check if it's a 404 or other HTTP error
      if (error && typeof error === 'object' && 'response' in error) {
        const httpError = error as { response?: { status?: number; data?: unknown } };
        console.error('HTTP Error Status:', httpError.response?.status);
        console.error('HTTP Error Data:', httpError.response?.data);
      }
      
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
      console.log('📋 Fetching lab request for patient:', patientId);
      
      const response = await this.httpClient.get<LabRequestResponse>(`/api/laboratory/requests/${patientId}`);
      
      console.log('✅ Lab request fetched successfully for patient:', patientId);
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
      console.log('🧪 Fetching lab tests for patient:', patientId);
      
      const response = await this.httpClient.get<LabTestListResponse>(`/api/laboratory/lab-tests/${patientId}`);
      
      console.log('🔍 Raw API response:', response.data);
      console.log('🔍 Lab tests data array:', response.data?.data);
      if (response.data?.data && response.data.data.length > 0) {
        console.log('🔍 First lab test item:', response.data.data[0]);
      }
      
      console.log('✅ Lab tests fetched successfully for patient:', patientId, '- Found', response.data?.data?.length || 0, 'tests');
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
      console.log('📋 Updating lab results for patient:', patientId, 'date:', requestDate);
      
      const response = await this.httpClient.put<{ message: string }>(
        `/api/laboratory/requests/${patientId}/results`,
        { requestDate, results }
      );
      
      console.log('✅ Lab results updated successfully');
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
      console.log('📋 Fetching completed lab requests');
      
      const response = await this.httpClient.get<LabRequestListResponse>('/api/laboratory/requests/completed');
      
      console.log('✅ Completed lab requests fetched successfully:', response.data?.data?.length || 0, 'items');
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
      console.log('🧪 Creating lab test result:', request);
      
      const response = await this.httpClient.post<LabTestResultResponse>('/api/laboratory/test-results', request);
      
      console.log('✅ Lab test result created successfully');
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
      console.log('🔍 Fetching lab test result for ID:', id);
      
      const response = await this.httpClient.get<LabTestResultResponse>(`/api/laboratory/test-results/${id}`);
      
      console.log('✅ Lab test result fetched successfully for ID:', id);
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
      console.log('🔍 Fetching lab test result for lab request ID:', labRequestId);
      
      const response = await this.httpClient.get<LabTestResultResponse>(`/api/laboratory/test-results/by-request/${labRequestId}`);
      
      console.log('✅ Lab test result fetched successfully for lab request ID:', labRequestId);
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
      console.log('🔄 Updating lab test result ID:', id, 'with data:', request);
      
      const response = await this.httpClient.put<LabTestResultResponse>(`/api/laboratory/test-results/${id}`, request);
      
      console.log('✅ Lab test result updated successfully');
      return response.data;
    } catch (error) {
      console.error('❌ Error updating lab test result:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to update lab test result'
      } as LabTestResultResponse;
    }
  }
}