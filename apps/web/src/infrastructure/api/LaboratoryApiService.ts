import { injectable, inject } from 'tsyringe';
import { 
  CreateLabRequestCommand, 
  CreateBloodChemistryCommand,
  LabRequestResponse,
  LabRequestListResponse,
  LabTestListResponse,
  BloodChemistryResponse,
  LaboratoryOperationResponse,
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
      
      const response = await this.httpClient.post<LabRequestResponse>('/api/laboratory/lab-requests', command);
      
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
      console.log('📋 Fetching all lab requests from:', '/api/laboratory/lab-requests');
      
      const response = await this.httpClient.get<LabRequestListResponse>('/api/laboratory/lab-requests');
      
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
      
      const response = await this.httpClient.get<LabRequestResponse>(`/api/laboratory/lab-requests/${patientId}`);
      
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
        `/api/laboratory/lab-requests/${patientId}/results`,
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
      
      const response = await this.httpClient.get<LabRequestListResponse>('/api/laboratory/lab-requests/completed');
      
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
   * Create blood chemistry results
   */
  async createBloodChemistry(command: CreateBloodChemistryCommand): Promise<BloodChemistryResponse> {
    try {
      console.log('🧪 Creating blood chemistry results:', command);
      
      const response = await this.httpClient.post<BloodChemistryResponse>('/api/laboratory/blood-chemistry', command);
      
      console.log('✅ Blood chemistry results created successfully');
      return response.data;
    } catch (error) {
      console.error('❌ Error creating blood chemistry results:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to create blood chemistry results'
      } as BloodChemistryResponse;
    }
  }
}