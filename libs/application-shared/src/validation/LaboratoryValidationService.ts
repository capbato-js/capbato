import { injectable, inject } from 'tsyringe';
import { ValidationService } from './ValidationService';
import { TOKENS } from '../di/tokens';
import {
  CreateLabRequestCommand,
  UpdateLabRequestCommand,
  DeleteLabRequestCommand,
  UpdateLabRequestResultsCommand,
  CreateBloodChemistryCommand,
  UpdateBloodChemistryCommand,
  DeleteBloodChemistryCommand,
  CreateLabRequestCommandSchema,
  UpdateLabRequestCommandSchema,
  DeleteLabRequestCommandSchema,
  UpdateLabRequestResultsCommandSchema,
  CreateBloodChemistryCommandSchema,
  UpdateBloodChemistryCommandSchema,
  DeleteBloodChemistryCommandSchema,
  LabRequestIdSchema,
  BloodChemistryIdSchema,
} from './LaboratoryValidationSchemas';

// Individual validation services for each command type
@injectable()
export class CreateLabRequestValidationService extends ValidationService<unknown, CreateLabRequestCommand> {
  protected schema = CreateLabRequestCommandSchema;
}

@injectable()
export class UpdateLabRequestValidationService extends ValidationService<unknown, UpdateLabRequestCommand> {
  protected schema = UpdateLabRequestCommandSchema;
}

@injectable()
export class DeleteLabRequestValidationService extends ValidationService<unknown, DeleteLabRequestCommand> {
  protected schema = DeleteLabRequestCommandSchema;
}

@injectable()
export class UpdateLabRequestResultsValidationService extends ValidationService<unknown, UpdateLabRequestResultsCommand> {
  protected schema = UpdateLabRequestResultsCommandSchema;
}

@injectable()
export class CreateBloodChemistryValidationService extends ValidationService<unknown, CreateBloodChemistryCommand> {
  protected schema = CreateBloodChemistryCommandSchema;
}

@injectable()
export class UpdateBloodChemistryValidationService extends ValidationService<unknown, UpdateBloodChemistryCommand> {
  protected schema = UpdateBloodChemistryCommandSchema;
}

@injectable()
export class DeleteBloodChemistryValidationService extends ValidationService<unknown, DeleteBloodChemistryCommand> {
  protected schema = DeleteBloodChemistryCommandSchema;
}

// Composite facade service combining all validations following TodoValidationService pattern
@injectable()
export class LaboratoryValidationService {
  constructor(
    @inject(TOKENS.CreateLabRequestValidationService) private readonly createLabRequestValidator: CreateLabRequestValidationService,
    @inject(TOKENS.UpdateLabRequestValidationService) private readonly updateLabRequestValidator: UpdateLabRequestValidationService,
    @inject(TOKENS.DeleteLabRequestValidationService) private readonly deleteLabRequestValidator: DeleteLabRequestValidationService,
    @inject(TOKENS.UpdateLabRequestResultsValidationService) private readonly updateLabRequestResultsValidator: UpdateLabRequestResultsValidationService,
    @inject(TOKENS.CreateBloodChemistryValidationService) private readonly createBloodChemistryValidator: CreateBloodChemistryValidationService,
    @inject(TOKENS.UpdateBloodChemistryValidationService) private readonly updateBloodChemistryValidator: UpdateBloodChemistryValidationService,
    @inject(TOKENS.DeleteBloodChemistryValidationService) private readonly deleteBloodChemistryValidator: DeleteBloodChemistryValidationService
  ) {}

  // Lab Request validation methods
  validateCreateLabRequestCommand(data: unknown): CreateLabRequestCommand {
    return this.createLabRequestValidator.validate(data);
  }

  validateUpdateLabRequestCommand(data: unknown): UpdateLabRequestCommand {
    return this.updateLabRequestValidator.validate(data);
  }

  validateDeleteLabRequestCommand(data: unknown): DeleteLabRequestCommand {
    return this.deleteLabRequestValidator.validate(data);
  }

  validateUpdateLabRequestResultsCommand(data: unknown): UpdateLabRequestResultsCommand {
    return this.updateLabRequestResultsValidator.validate(data);
  }

  // Blood Chemistry validation methods
  validateCreateBloodChemistryCommand(data: unknown): CreateBloodChemistryCommand {
    return this.createBloodChemistryValidator.validate(data);
  }

  validateUpdateBloodChemistryCommand(data: unknown): UpdateBloodChemistryCommand {
    return this.updateBloodChemistryValidator.validate(data);
  }

  validateDeleteBloodChemistryCommand(data: unknown): DeleteBloodChemistryCommand {
    return this.deleteBloodChemistryValidator.validate(data);
  }

  // ID validation methods
  validateLabRequestId(id: unknown): string {
    return LabRequestIdSchema.parse(id);
  }

  validateBloodChemistryId(id: unknown): string {
    return BloodChemistryIdSchema.parse(id);
  }

  // Safe validation methods (non-throwing)
  safeValidateCreateLabRequestCommand(data: unknown) {
    return this.createLabRequestValidator.safeParse(data);
  }

  safeValidateUpdateLabRequestCommand(data: unknown) {
    return this.updateLabRequestValidator.safeParse(data);
  }

  safeValidateDeleteLabRequestCommand(data: unknown) {
    return this.deleteLabRequestValidator.safeParse(data);
  }

  safeValidateUpdateLabRequestResultsCommand(data: unknown) {
    return this.updateLabRequestResultsValidator.safeParse(data);
  }

  safeValidateCreateBloodChemistryCommand(data: unknown) {
    return this.createBloodChemistryValidator.safeParse(data);
  }

  safeValidateUpdateBloodChemistryCommand(data: unknown) {
    return this.updateBloodChemistryValidator.safeParse(data);
  }

  safeValidateDeleteBloodChemistryCommand(data: unknown) {
    return this.deleteBloodChemistryValidator.safeParse(data);
  }
}
