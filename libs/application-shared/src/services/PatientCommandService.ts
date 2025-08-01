import { CreatePatientCommand } from '../dto/PatientCommands';
import { PatientDto, PatientListDto, PatientStatsDto } from '../dto/PatientDto';

/**
 * Patient Command Service Interface
 * Handles patient-related command operations following CQRS pattern
 * This interface belongs in the shared application layer
 */
export interface IPatientCommandService {
  /**
   * Process patient creation
   */
  createPatient(command: CreatePatientCommand): Promise<PatientDto>;
}

/**
 * Patient Query Service Interface
 * Handles patient-related query operations following CQRS pattern
 * This interface belongs in the shared application layer
 */
export interface IPatientQueryService {
  /**
   * Get all patients
   */
  getAllPatients(): Promise<PatientListDto[]>;
  
  /**
   * Get patient by ID
   */
  getPatientById(id: string): Promise<PatientDto>;
  
  /**
   * Get patient statistics
   */
  getPatientStats(): Promise<PatientStatsDto>;
}
