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
  CreateUrinalysisResultCommand,
  UpdateUrinalysisResultCommand,
  CreateHematologyResultCommand,
  UpdateHematologyResultCommand,
  CreateFecalysisResultCommand,
  UpdateFecalysisResultCommand,
  CreateSerologyResultCommand,
  UpdateSerologyResultCommand,
  CreateLabTestResultCommand,
  UpdateLabTestResultCommand,
  DeleteLabTestResultCommand,
  CreateLabRequestCommandSchema,
  UpdateLabRequestCommandSchema,
  DeleteLabRequestCommandSchema,
  UpdateLabRequestResultsCommandSchema,
  CreateBloodChemistryCommandSchema,
  UpdateBloodChemistryCommandSchema,
  DeleteBloodChemistryCommandSchema,
  CreateUrinalysisResultCommandSchema,
  UpdateUrinalysisResultCommandSchema,
  CreateHematologyResultCommandSchema,
  UpdateHematologyResultCommandSchema,
  CreateFecalysisResultCommandSchema,
  UpdateFecalysisResultCommandSchema,
  CreateSerologyResultCommandSchema,
  UpdateSerologyResultCommandSchema,
  CreateLabTestResultCommandSchema,
  UpdateLabTestResultCommandSchema,
  DeleteLabTestResultCommandSchema,
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

// Specialized results validation services
@injectable()
export class CreateUrinalysisResultValidationService extends ValidationService<unknown, CreateUrinalysisResultCommand> {
  protected schema = CreateUrinalysisResultCommandSchema;
}

@injectable()
export class UpdateUrinalysisResultValidationService extends ValidationService<unknown, UpdateUrinalysisResultCommand> {
  protected schema = UpdateUrinalysisResultCommandSchema;
}

@injectable()
export class CreateHematologyResultValidationService extends ValidationService<unknown, CreateHematologyResultCommand> {
  protected schema = CreateHematologyResultCommandSchema;
}

@injectable()
export class UpdateHematologyResultValidationService extends ValidationService<unknown, UpdateHematologyResultCommand> {
  protected schema = UpdateHematologyResultCommandSchema;
}

@injectable()
export class CreateFecalysisResultValidationService extends ValidationService<unknown, CreateFecalysisResultCommand> {
  protected schema = CreateFecalysisResultCommandSchema;
}

@injectable()
export class UpdateFecalysisResultValidationService extends ValidationService<unknown, UpdateFecalysisResultCommand> {
  protected schema = UpdateFecalysisResultCommandSchema;
}

@injectable()
export class CreateSerologyResultValidationService extends ValidationService<unknown, CreateSerologyResultCommand> {
  protected schema = CreateSerologyResultCommandSchema;
}

@injectable()
export class UpdateSerologyResultValidationService extends ValidationService<unknown, UpdateSerologyResultCommand> {
  protected schema = UpdateSerologyResultCommandSchema;
}

@injectable()
export class CreateLabTestResultValidationService extends ValidationService<unknown, CreateLabTestResultCommand> {
  protected schema = CreateLabTestResultCommandSchema;
}

@injectable()
export class UpdateLabTestResultValidationService extends ValidationService<unknown, UpdateLabTestResultCommand> {
  protected schema = UpdateLabTestResultCommandSchema;
}

@injectable()
export class DeleteLabTestResultValidationService extends ValidationService<unknown, DeleteLabTestResultCommand> {
  protected schema = DeleteLabTestResultCommandSchema;
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
    @inject(TOKENS.DeleteBloodChemistryValidationService) private readonly deleteBloodChemistryValidator: DeleteBloodChemistryValidationService,
    @inject(TOKENS.CreateUrinalysisResultValidationService) private readonly createUrinalysisResultValidator: CreateUrinalysisResultValidationService,
    @inject(TOKENS.UpdateUrinalysisResultValidationService) private readonly updateUrinalysisResultValidator: UpdateUrinalysisResultValidationService,
    @inject(TOKENS.CreateHematologyResultValidationService) private readonly createHematologyResultValidator: CreateHematologyResultValidationService,
    @inject(TOKENS.UpdateHematologyResultValidationService) private readonly updateHematologyResultValidator: UpdateHematologyResultValidationService,
    @inject(TOKENS.CreateFecalysisResultValidationService) private readonly createFecalysisResultValidator: CreateFecalysisResultValidationService,
    @inject(TOKENS.UpdateFecalysisResultValidationService) private readonly updateFecalysisResultValidator: UpdateFecalysisResultValidationService,
    @inject(TOKENS.CreateSerologyResultValidationService) private readonly createSerologyResultValidator: CreateSerologyResultValidationService,
    @inject(TOKENS.UpdateSerologyResultValidationService) private readonly updateSerologyResultValidator: UpdateSerologyResultValidationService,
    @inject(TOKENS.CreateLabTestResultValidationService) private readonly createLabTestResultValidator: CreateLabTestResultValidationService,
    @inject(TOKENS.UpdateLabTestResultValidationService) private readonly updateLabTestResultValidator: UpdateLabTestResultValidationService,
    @inject(TOKENS.DeleteLabTestResultValidationService) private readonly deleteLabTestResultValidator: DeleteLabTestResultValidationService
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

  // Specialized Results validation methods
  validateCreateUrinalysisResultCommand(data: unknown): CreateUrinalysisResultCommand {
    return this.createUrinalysisResultValidator.validate(data);
  }

  validateUpdateUrinalysisResultCommand(data: unknown): UpdateUrinalysisResultCommand {
    return this.updateUrinalysisResultValidator.validate(data);
  }

  validateCreateHematologyResultCommand(data: unknown): CreateHematologyResultCommand {
    return this.createHematologyResultValidator.validate(data);
  }

  validateUpdateHematologyResultCommand(data: unknown): UpdateHematologyResultCommand {
    return this.updateHematologyResultValidator.validate(data);
  }

  validateCreateFecalysisResultCommand(data: unknown): CreateFecalysisResultCommand {
    return this.createFecalysisResultValidator.validate(data);
  }

  validateUpdateFecalysisResultCommand(data: unknown): UpdateFecalysisResultCommand {
    return this.updateFecalysisResultValidator.validate(data);
  }

  validateCreateSerologyResultCommand(data: unknown): CreateSerologyResultCommand {
    return this.createSerologyResultValidator.validate(data);
  }

  validateUpdateSerologyResultCommand(data: unknown): UpdateSerologyResultCommand {
    return this.updateSerologyResultValidator.validate(data);
  }

  validateCreateLabTestResultCommand(data: unknown): CreateLabTestResultCommand {
    return this.createLabTestResultValidator.validate(data);
  }

  validateUpdateLabTestResultCommand(data: unknown): UpdateLabTestResultCommand {
    return this.updateLabTestResultValidator.validate(data);
  }

  validateDeleteLabTestResultCommand(data: unknown): DeleteLabTestResultCommand {
    return this.deleteLabTestResultValidator.validate(data);
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
