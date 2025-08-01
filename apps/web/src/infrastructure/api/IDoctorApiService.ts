import { DoctorDto, DoctorSummaryDto } from '@nx-starter/application-shared';

/**
 * Interface for Doctor API Service
 * Defines the contract for interacting with the Doctor API endpoints
 */
export interface IDoctorApiService {
  /**
   * Get all doctors with optional filtering
   * @param activeOnly - Whether to include only active doctors (default: true)
   * @param format - Response format: 'full' | 'summary' (default: 'full')
   */
  getAllDoctors(activeOnly?: boolean, format?: 'full' | 'summary'): Promise<DoctorDto[] | DoctorSummaryDto[]>;

  /**
   * Get doctor profile by doctor ID
   */
  getDoctorById(id: string): Promise<DoctorDto>;

  /**
   * Get doctor profile by user ID
   */
  getDoctorByUserId(userId: string): Promise<DoctorDto>;

  /**
   * Get doctors by specialization
   */
  getDoctorsBySpecialization(specialization: string, activeOnly?: boolean): Promise<DoctorDto[]>;

  /**
   * Check if user has a doctor profile
   */
  checkDoctorProfileExists(userId: string): Promise<boolean>;
}
