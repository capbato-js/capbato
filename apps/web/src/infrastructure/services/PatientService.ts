import { injectable, inject } from 'tsyringe';
import { 
  CreatePatientCommand, 
  PatientDto,
  PatientListDto,
  PatientStatsDto,
  IPatientCommandService,
  IPatientQueryService,
  TOKENS,
  Patient 
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
  async getAllPatients(): Promise<Patient[]> {
    try {
      const response = await this.patientApiService.getAllPatients();
      // Convert DTOs to domain entities (simplified approach)
      return response.data.map(dto => ({
        id: dto.id,
        patientNumber: dto.patientNumber || 'N/A',
        firstName: dto.firstName || 'Unknown',
        lastName: dto.lastName || 'Unknown',
        middleName: dto.middleName,
        dateOfBirth: new Date(dto.dateOfBirth),
        gender: dto.gender as 'Male' | 'Female',
        contactNumber: dto.contactNumber || 'N/A',
        address: dto.address || 'N/A',
        guardianName: dto.guardianName,
        guardianGender: dto.guardianGender as 'Male' | 'Female' | undefined,
        guardianRelationship: dto.guardianRelationship,
        guardianContactNumber: dto.guardianContactNumber,
        guardianAddress: dto.guardianAddress,
        createdAt: new Date(dto.createdAt || Date.now()),
        updatedAt: new Date(dto.updatedAt || Date.now()),
        get fullName() { 
          return [this.firstName, this.middleName, this.lastName].filter(Boolean).join(' ');
        },
        get age() {
          const today = new Date();
          const birth = this.dateOfBirth;
          let age = today.getFullYear() - birth.getFullYear();
          const monthDiff = today.getMonth() - birth.getMonth();
          if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
          }
          return age;
        }
      } as Patient));
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
  async getPatientById(id: string): Promise<Patient> {
    try {
      const response = await this.patientApiService.getPatientById(id);
      const dto = response.data;
      // Convert DTO to domain entity (simplified approach)
      return {
        id: dto.id,
        patientNumber: dto.patientNumber || 'N/A',
        firstName: dto.firstName || 'Unknown',
        lastName: dto.lastName || 'Unknown',
        middleName: dto.middleName,
        dateOfBirth: new Date(dto.dateOfBirth),
        gender: dto.gender as 'Male' | 'Female',
        contactNumber: dto.contactNumber || 'N/A',
        address: dto.address || 'N/A',
        guardianName: dto.guardianName,
        guardianGender: dto.guardianGender as 'Male' | 'Female' | undefined,
        guardianRelationship: dto.guardianRelationship,
        guardianContactNumber: dto.guardianContactNumber,
        guardianAddress: dto.guardianAddress,
        createdAt: new Date(dto.createdAt || Date.now()),
        updatedAt: new Date(dto.updatedAt || Date.now()),
        get fullName() { 
          return [this.firstName, this.middleName, this.lastName].filter(Boolean).join(' ');
        },
        get age() {
          const today = new Date();
          const birth = this.dateOfBirth;
          let age = today.getFullYear() - birth.getFullYear();
          const monthDiff = today.getMonth() - birth.getMonth();
          if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
          }
          return age;
        }
      } as Patient;
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
