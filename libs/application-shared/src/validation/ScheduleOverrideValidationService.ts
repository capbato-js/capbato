import { injectable, inject } from 'tsyringe';
import { ValidationService, IValidationService } from './ValidationService';
import { TOKENS } from '../di/tokens';
import {
  CreateScheduleOverrideSchema,
  UpdateScheduleOverrideSchema,
} from './ScheduleOverrideValidationSchemas';
import { CreateScheduleOverrideCommand, UpdateScheduleOverrideCommand } from '../dto/ScheduleOverrideCommands';

/**
 * Validation service for CreateScheduleOverrideCommand
 * Encapsulates validation logic for creating new schedule overrides
 */
@injectable()
export class CreateScheduleOverrideValidationService extends ValidationService<unknown, CreateScheduleOverrideCommand> {
  protected schema = CreateScheduleOverrideSchema;
}

/**
 * Validation service for UpdateScheduleOverrideCommand
 * Encapsulates validation logic for updating existing schedule overrides
 */
@injectable()
export class UpdateScheduleOverrideValidationService extends ValidationService<unknown, UpdateScheduleOverrideCommand> {
  protected schema = UpdateScheduleOverrideSchema;
}

/**
 * Composite validation service that provides all Schedule Override validation operations
 * Follows the Facade pattern to provide a unified interface for Schedule Override validation
 */
@injectable()
export class ScheduleOverrideValidationService {
  constructor(
    @inject(TOKENS.CreateScheduleOverrideValidationService)
    private createValidator: CreateScheduleOverrideValidationService,
    @inject(TOKENS.UpdateScheduleOverrideValidationService)
    private updateValidator: UpdateScheduleOverrideValidationService
  ) {}

  /**
   * Validates data for creating a new schedule override
   */
  validateCreateCommand(data: unknown): CreateScheduleOverrideCommand {
    return this.createValidator.validate(data);
  }

  /**
   * Validates data for updating an existing schedule override
   */
  validateUpdateCommand(data: unknown): UpdateScheduleOverrideCommand {
    return this.updateValidator.validate(data);
  }

  /**
   * Safe validation methods that don't throw exceptions
   */
  safeValidateCreateCommand(data: unknown) {
    return this.createValidator.safeParse(data);
  }

  safeValidateUpdateCommand(data: unknown) {
    return this.updateValidator.safeParse(data);
  }
}

// Export interfaces for dependency injection
export type ICreateScheduleOverrideValidationService = IValidationService<unknown, CreateScheduleOverrideCommand>;
export type IUpdateScheduleOverrideValidationService = IValidationService<unknown, UpdateScheduleOverrideCommand>;
