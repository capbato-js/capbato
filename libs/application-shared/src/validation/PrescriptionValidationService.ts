import { injectable, inject } from 'tsyringe';
import { ValidationService, IValidationService } from './ValidationService';
import { TOKENS } from '../di/tokens';
import {
  CreatePrescriptionCommandSchema,
  UpdatePrescriptionCommandSchema,
  DeletePrescriptionCommandSchema,
  CreatePrescriptionCommand,
  UpdatePrescriptionCommand,
  DeletePrescriptionCommand,
} from './PrescriptionValidationSchemas';

/**
 * Validation service for CreatePrescriptionCommand
 * Encapsulates validation logic for creating new prescriptions
 */
@injectable()
export class CreatePrescriptionValidationService extends ValidationService<unknown, CreatePrescriptionCommand> {
  protected schema = CreatePrescriptionCommandSchema;
}

/**
 * Validation service for UpdatePrescriptionCommand
 * Encapsulates validation logic for updating existing prescriptions
 */
@injectable()
export class UpdatePrescriptionValidationService extends ValidationService<unknown, UpdatePrescriptionCommand> {
  protected schema = UpdatePrescriptionCommandSchema;
}

/**
 * Validation service for DeletePrescriptionCommand
 * Encapsulates validation logic for deleting prescriptions
 */
@injectable()
export class DeletePrescriptionValidationService extends ValidationService<unknown, DeletePrescriptionCommand> {
  protected schema = DeletePrescriptionCommandSchema;
}

/**
 * Composite validation service that provides all Prescription validation operations
 * Follows the Facade pattern to provide a unified interface for Prescription validation
 */
@injectable()
export class PrescriptionValidationService {
  constructor(
    @inject(TOKENS.CreatePrescriptionValidationService)
    private createValidator: CreatePrescriptionValidationService,
    @inject(TOKENS.UpdatePrescriptionValidationService)
    private updateValidator: UpdatePrescriptionValidationService,
    @inject(TOKENS.DeletePrescriptionValidationService)
    private deleteValidator: DeletePrescriptionValidationService
  ) {}

  /**
   * Validates data for creating a prescription
   */
  validateCreateCommand(data: unknown): CreatePrescriptionCommand {
    return this.createValidator.validate(data);
  }

  /**
   * Validates data for updating a prescription
   */
  validateUpdateCommand(data: unknown): UpdatePrescriptionCommand {
    return this.updateValidator.validate(data);
  }

  /**
   * Validates data for deleting a prescription
   */
  validateDeleteCommand(data: unknown): DeletePrescriptionCommand {
    return this.deleteValidator.validate(data);
  }

  /**
   * Safe validation that returns validation result without throwing
   */
  safeValidateCreateCommand(data: unknown) {
    return this.createValidator.safeParse(data);
  }

  /**
   * Safe validation that returns validation result without throwing
   */
  safeValidateUpdateCommand(data: unknown) {
    return this.updateValidator.safeParse(data);
  }

  /**
   * Safe validation that returns validation result without throwing
   */
  safeValidateDeleteCommand(data: unknown) {
    return this.deleteValidator.safeParse(data);
  }
}