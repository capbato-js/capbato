import { injectable, inject } from 'tsyringe';
import { IDoctorApiService } from './IDoctorApiService';
import { 
  DoctorDto, 
  DoctorSummaryDto, 
  DoctorListResponse, 
  DoctorSummaryListResponse, 
  DoctorResponse, 
  DoctorOperationResponse, 
  CreateDoctorProfileCommand, 
  CreateScheduleOverrideRequestDto,
  UpdateScheduleOverrideRequestDto,
  ScheduleOverrideDto,
  ScheduleOverrideListResponse,
  TOKENS 
} from '@nx-starter/application-shared';
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

  /**
   * Create a new doctor profile
   */
  async createDoctorProfile(command: CreateDoctorProfileCommand): Promise<DoctorOperationResponse> {
    try {
      const response = await this.httpClient.post<DoctorOperationResponse>(
        this.apiConfig.endpoints.doctors.all,
        command
      );

      if (!response.data.success) {
        throw new Error('Failed to create doctor profile');
      }

      return response.data;
    } catch (error) {
      console.error('Error creating doctor profile:', error);
      throw new Error(error instanceof Error ? error.message : 'Failed to create doctor profile');
    }
  }

  /**
   * Get all schedule overrides
   */
  async getAllScheduleOverrides(): Promise<ScheduleOverrideDto[]> {
    try {
      const response = await this.httpClient.get<ScheduleOverrideListResponse>(
        `${this.apiConfig.endpoints.doctors.all}/schedule-overrides`
      );

      if (!response.data.success) {
        throw new Error('Failed to fetch schedule overrides');
      }

      return response.data.data;
    } catch (error) {
      console.error('Error fetching schedule overrides:', error);
      throw new Error(error instanceof Error ? error.message : 'Failed to fetch schedule overrides');
    }
  }

  /**
   * Create a schedule override
   */
  async createScheduleOverride(request: CreateScheduleOverrideRequestDto): Promise<DoctorOperationResponse> {
    try {
      const response = await this.httpClient.post<DoctorOperationResponse>(
        `${this.apiConfig.endpoints.doctors.all}/schedule-override`,
        request
      );

      if (!response.data.success) {
        throw new Error('Failed to create schedule override');
      }

      return response.data;
    } catch (error) {
      console.error('Error creating schedule override:', error);
      throw new Error(error instanceof Error ? error.message : 'Failed to create schedule override');
    }
  }

  /**
   * Update an existing schedule override
   */
  async updateScheduleOverride(id: string, request: UpdateScheduleOverrideRequestDto): Promise<DoctorOperationResponse> {
    try {
      const response = await this.httpClient.put<DoctorOperationResponse>(
        `${this.apiConfig.endpoints.doctors.all}/schedule-override/${id}`,
        request
      );

      if (!response.data.success) {
        throw new Error('Failed to update schedule override');
      }

      return response.data;
    } catch (error) {
      console.error('Error updating schedule override:', error);
      throw new Error(error instanceof Error ? error.message : 'Failed to update schedule override');
    }
  }

  /**
   * Delete a schedule override by date
   */
  async deleteScheduleOverride(date: string): Promise<DoctorOperationResponse> {
    try {
      const response = await this.httpClient.delete<DoctorOperationResponse>(
        `${this.apiConfig.endpoints.doctors.all}/schedule-override/${date}`
      );

      if (!response.data.success) {
        throw new Error('Failed to delete schedule override');
      }

      return response.data;
    } catch (error) {
      console.error('Error deleting schedule override:', error);
      throw new Error(error instanceof Error ? error.message : 'Failed to delete schedule override');
    }
  }
}
