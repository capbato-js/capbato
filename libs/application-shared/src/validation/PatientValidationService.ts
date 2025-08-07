import { injectable, inject } from 'tsyringe';
import { ValidationService, IValidationService } from './ValidationService';
import { TOKENS } from '../di/tokens';
import {
  CreatePatientCommandSchema,
  UpdatePatientCommandSchema,
  GetPatientByIdCommandSchema,
  CreatePatientCommand,
  UpdatePatientCommand,
  GetPatientByIdCommand,
} from './PatientValidationSchemas';

/**
 * Validation service for CreatePatientCommand
 * Encapsulates validation logic for creating new patients
 */
@injectable()
export class CreatePatientValidationService extends ValidationService<unknown, CreatePatientCommand> {
  protected schema = CreatePatientCommandSchema;
}

/**
 * Validation service for GetPatientByIdCommand
 * Encapsulates validation logic for retrieving patients by ID
 */
@injectable()
export class GetPatientByIdValidationService extends ValidationService<unknown, GetPatientByIdCommand> {
  protected schema = GetPatientByIdCommandSchema;
}

/**
 * Validation service for UpdatePatientCommand
 * Encapsulates validation logic for updating existing patients
 */
@injectable()
export class UpdatePatientValidationService extends ValidationService<unknown, UpdatePatientCommand> {
  protected schema = UpdatePatientCommandSchema;
}

/**
 * Composite validation service that provides all Patient validation operations
 * Follows the Facade pattern to provide a unified interface for Patient validation
 */
@injectable()
export class PatientValidationService {
  constructor(
    @inject(TOKENS.CreatePatientValidationService)
    private createValidator: CreatePatientValidationService,
    @inject(TOKENS.GetPatientByIdValidationService)
    private getByIdValidator: GetPatientByIdValidationService,
    @inject(TOKENS.UpdatePatientValidationService)
    private updateValidator: UpdatePatientValidationService
  ) {}

  /**
   * Validates data for creating a new patient
   */
  validateCreateCommand(data: unknown): CreatePatientCommand {
    return this.createValidator.validate(data);
  }

  /**
   * Validates data for getting a patient by ID
   */
  validateGetByIdCommand(data: unknown): GetPatientByIdCommand {
    return this.getByIdValidator.validate(data);
  }

  /**
   * Validates data for updating an existing patient
   */
  validateUpdateCommand(data: unknown): UpdatePatientCommand {
    return this.updateValidator.validate(data);
  }

  /**
   * Safe validation methods that don't throw exceptions
   */
  safeValidateCreateCommand(data: unknown) {
    return this.createValidator.safeParse(data);
  }

  safeValidateGetByIdCommand(data: unknown) {
    return this.getByIdValidator.safeParse(data);
  }

  safeValidateUpdateCommand(data: unknown) {
    return this.updateValidator.safeParse(data);
  }
}

// Export interfaces for dependency injection
export type ICreatePatientValidationService = IValidationService<unknown, CreatePatientCommand>;
export type IUpdatePatientValidationService = IValidationService<unknown, UpdatePatientCommand>;
export type IGetPatientByIdValidationService = IValidationService<unknown, GetPatientByIdCommand>;