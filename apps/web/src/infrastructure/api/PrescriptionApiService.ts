import { injectable, inject } from 'tsyringe';
import { IHttpClient } from '../http/IHttpClient';
import { IPrescriptionApiService } from './IPrescriptionApiService';
import { getApiConfig } from './config/ApiConfig';
import {
  PrescriptionListResponse,
  PrescriptionResponse,
  PrescriptionOperationResponse,
  CreatePrescriptionRequestDto,
  UpdatePrescriptionRequestDto,
  TOKENS,
} from '@nx-starter/application-shared';

@injectable()
export class PrescriptionApiService implements IPrescriptionApiService {
  private readonly apiConfig = getApiConfig();

  constructor(
    @inject(TOKENS.HttpClient) private readonly httpClient: IHttpClient
  ) {}

  async getAllPrescriptions(): Promise<PrescriptionListResponse> {
    const response = await this.httpClient.get<PrescriptionListResponse>(
      this.apiConfig.endpoints.prescriptions.all
    );
    
    if (!response.data.success) {
      throw new Error('Failed to fetch prescriptions');
    }
    
    return response.data;
  }

  async getPrescriptionById(id: string): Promise<PrescriptionResponse> {
    try {
      const response = await this.httpClient.get<PrescriptionResponse>(
        this.apiConfig.endpoints.prescriptions.byId(id)
      );
      
      if (response.status === 404) {
        throw new Error('Prescription not found');
      }
      
      if (!response.data.success) {
        throw new Error('Failed to fetch prescription');
      }
      
      return response.data;
    } catch (error) {
      if (error instanceof Error && error.message.includes('404')) {
        throw new Error('Prescription not found');
      }
      throw error;
    }
  }

  async createPrescription(prescriptionData: CreatePrescriptionRequestDto): Promise<PrescriptionResponse> {
    const response = await this.httpClient.post<PrescriptionResponse>(
      this.apiConfig.endpoints.prescriptions.base,
      prescriptionData
    );
    
    if (!response.data.success) {
      throw new Error('Failed to create prescription');
    }
    
    return response.data;
  }

  async updatePrescription(id: string, updateData: UpdatePrescriptionRequestDto): Promise<PrescriptionOperationResponse> {
    const response = await this.httpClient.put<PrescriptionOperationResponse>(
      this.apiConfig.endpoints.prescriptions.byId(id),
      updateData
    );
    
    if (response.status >= 400) {
      throw new Error('Failed to update prescription');
    }
    
    return response.data;
  }

  async deletePrescription(id: string): Promise<PrescriptionOperationResponse> {
    const response = await this.httpClient.delete<PrescriptionOperationResponse>(
      this.apiConfig.endpoints.prescriptions.byId(id)
    );
    
    if (response.status >= 400) {
      throw new Error('Failed to delete prescription');
    }
    
    return response.data;
  }

  async getPrescriptionsByPatientId(patientId: string): Promise<PrescriptionListResponse> {
    const response = await this.httpClient.get<PrescriptionListResponse>(
      this.apiConfig.endpoints.prescriptions.byPatientId(patientId)
    );
    
    if (!response.data.success) {
      throw new Error('Failed to fetch prescriptions by patient ID');
    }
    
    return response.data;
  }

  async getPrescriptionsByDoctorId(doctorId: string): Promise<PrescriptionListResponse> {
    const response = await this.httpClient.get<PrescriptionListResponse>(
      this.apiConfig.endpoints.prescriptions.byDoctorId(doctorId)
    );
    
    if (!response.data.success) {
      throw new Error('Failed to fetch prescriptions by doctor ID');
    }
    
    return response.data;
  }

  async getActivePrescriptions(): Promise<PrescriptionListResponse> {
    const response = await this.httpClient.get<PrescriptionListResponse>(
      this.apiConfig.endpoints.prescriptions.active
    );
    
    if (!response.data.success) {
      throw new Error('Failed to fetch active prescriptions');
    }
    
    return response.data;
  }

  async getExpiredPrescriptions(): Promise<PrescriptionListResponse> {
    const response = await this.httpClient.get<PrescriptionListResponse>(
      this.apiConfig.endpoints.prescriptions.expired
    );
    
    if (!response.data.success) {
      throw new Error('Failed to fetch expired prescriptions');
    }
    
    return response.data;
  }

  async getPrescriptionsByMedicationName(medicationName: string): Promise<PrescriptionListResponse> {
    const response = await this.httpClient.get<PrescriptionListResponse>(
      this.apiConfig.endpoints.prescriptions.byMedicationName(medicationName)
    );
    
    if (!response.data.success) {
      throw new Error('Failed to fetch prescriptions by medication name');
    }
    
    return response.data;
  }
}