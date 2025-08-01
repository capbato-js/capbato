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
