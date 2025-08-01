import { injectable, inject } from 'tsyringe';
import { 
  CreatePatientCommand, 
  PatientDto,
  PatientListDto,
  PatientStatsDto,
  IPatientCommandService,
  IPatientQueryService,
  TOKENS 
} from '@nx-starter/application-shared';
import { IPatientApiService } from '../api/IPatientApiService';

/**
 * Patient Command Service Implementation
 * Handles patient command operations (Create, Update, Delete) following CQRS pattern
 * Coordinates between application layer commands and infrastructure layer API services
 */
@injectable()
export class PatientCommandService implements IPatientCommandService {
  constructor(
    @inject(TOKENS.PatientApiService) 
    private readonly patientApiService: IPatientApiService
  ) {}

  /**
   * Create a new patient
   * Delegates to the API service and handles any service-level orchestration
   */
  async createPatient(command: CreatePatientCommand): Promise<PatientDto> {
    try {
      const response = await this.patientApiService.createPatient(command);
      return response.data;
    } catch (error: unknown) {
      // Re-throw with more context if needed
      if (error instanceof Error) {
        throw new Error(`Failed to create patient: ${error.message}`);
      }
      throw new Error('Failed to create patient: Unknown error occurred');
    }
  }
}

/**
 * Patient Query Service Implementation
 * Handles patient query operations (Read) following CQRS pattern
 * Separates read operations from write operations for better scalability
 */
@injectable()
export class PatientQueryService implements IPatientQueryService {
  constructor(
    @inject(TOKENS.PatientApiService) 
    private readonly patientApiService: IPatientApiService
  ) {}

  /**
   * Get all patients
   */
  async getAllPatients(): Promise<PatientListDto[]> {
    try {
      const response = await this.patientApiService.getAllPatients();
      return response.data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Failed to fetch patients: ${error.message}`);
      }
      throw new Error('Failed to fetch patients: Unknown error occurred');
    }
  }

  /**
   * Get patient by ID
   */
  async getPatientById(id: string): Promise<PatientDto> {
    try {
      const response = await this.patientApiService.getPatientById(id);
      return response.data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Failed to fetch patient: ${error.message}`);
      }
      throw new Error('Failed to fetch patient: Unknown error occurred');
    }
  }

  /**
   * Get patient statistics
   */
  async getPatientStats(): Promise<PatientStatsDto> {
    try {
      const response = await this.patientApiService.getPatientStats();
      return response.data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Failed to fetch patient statistics: ${error.message}`);
      }
      throw new Error('Failed to fetch patient statistics: Unknown error occurred');
    }
  }
}
