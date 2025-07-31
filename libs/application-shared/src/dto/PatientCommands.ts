// Re-export command types from validation schemas
// This ensures type consistency between validation and application layers
export type { CreatePatientCommand, GetPatientByIdCommand } from '../validation/PatientValidationSchemas';