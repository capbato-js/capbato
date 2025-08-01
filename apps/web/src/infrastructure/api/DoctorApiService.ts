import { injectable, inject } from 'tsyringe';
import { IDoctorApiService } from './IDoctorApiService';
import { DoctorDto, DoctorSummaryDto, DoctorListResponse, DoctorSummaryListResponse, DoctorResponse, TOKENS } from '@nx-starter/application-shared';
import { IHttpClient } from '../http/IHttpClient';
import { getApiConfig } from './config/ApiConfig';

/**
 * Doctor API Service Implementation
 * Handles HTTP communication with the Doctor API endpoints
 */
@injectable()
export class DoctorApiService implements IDoctorApiService {
  private readonly apiConfig = getApiConfig();

  constructor(
    @inject(TOKENS.HttpClient) private readonly httpClient: IHttpClient
  ) {}

  /**
   * Get all doctors with optional filtering
   * @param activeOnly - Whether to include only active doctors (default: true)
   * @param format - Response format: 'full' | 'summary' (default: 'full')
   */
  async getAllDoctors(activeOnly = true, format: 'full' | 'summary' = 'full'): Promise<DoctorDto[] | DoctorSummaryDto[]> {
    try {
      const params = new URLSearchParams();
      params.append('active', activeOnly.toString());
      if (format !== 'full') {
        params.append('format', format);
      }

      const response = await this.httpClient.get<DoctorListResponse | DoctorSummaryListResponse>(
        `${this.apiConfig.endpoints.doctors.all}?${params.toString()}`
      );

      if (!response.data.success) {
        throw new Error('Failed to fetch doctors');
      }

      return response.data.data;
    } catch (error) {
      console.error('Error fetching doctors:', error);
      throw new Error(error instanceof Error ? error.message : 'Failed to fetch doctors');
    }
  }

  /**
   * Get doctor profile by doctor ID
   */
  async getDoctorById(id: string): Promise<DoctorDto> {
    try {
      const response = await this.httpClient.get<DoctorResponse>(
        this.apiConfig.endpoints.doctors.byId(id)
      );

      if (!response.data.success) {
        throw new Error(`Doctor with ID ${id} not found`);
      }

      return response.data.data;
    } catch (error) {
      console.error(`Error fetching doctor with ID ${id}:`, error);
      throw new Error(error instanceof Error ? error.message : `Failed to fetch doctor with ID ${id}`);
    }
  }

  /**
   * Get doctor profile by user ID
   */
  async getDoctorByUserId(userId: string): Promise<DoctorDto> {
    try {
      const response = await this.httpClient.get<DoctorResponse>(
        this.apiConfig.endpoints.doctors.byUserId(userId)
      );

      if (!response.data.success) {
        throw new Error(`Doctor profile for user ${userId} not found`);
      }

      return response.data.data;
    } catch (error) {
      console.error(`Error fetching doctor profile for user ${userId}:`, error);
      throw new Error(error instanceof Error ? error.message : `Failed to fetch doctor profile for user ${userId}`);
    }
  }

  /**
   * Get doctors by specialization
   */
  async getDoctorsBySpecialization(specialization: string, activeOnly = true): Promise<DoctorDto[]> {
    try {
      const params = new URLSearchParams();
      params.append('active', activeOnly.toString());

      const response = await this.httpClient.get<DoctorListResponse>(
        `${this.apiConfig.endpoints.doctors.bySpecialization(specialization)}?${params.toString()}`
      );

      if (!response.data.success) {
        throw new Error(`Failed to fetch doctors with specialization: ${specialization}`);
      }

      return response.data.data;
    } catch (error) {
      console.error(`Error fetching doctors by specialization ${specialization}:`, error);
      throw new Error(error instanceof Error ? error.message : `Failed to fetch doctors with specialization: ${specialization}`);
    }
  }

  /**
   * Check if user has a doctor profile
   */
  async checkDoctorProfileExists(userId: string): Promise<boolean> {
    try {
      const response = await this.httpClient.get<{ exists: boolean }>(
        this.apiConfig.endpoints.doctors.check(userId)
      );
      return response.data.exists;
    } catch (error) {
      console.error(`Error checking doctor profile existence for user ${userId}:`, error);
      // Return false if there's an error checking existence
      return false;
    }
  }
}
