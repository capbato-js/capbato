import { injectable, inject } from 'tsyringe';
import { ValidationService, IValidationService } from './ValidationService';
import { TOKENS } from '../di/tokens';
import {
  CreateAppointmentCommandSchema,
  UpdateAppointmentCommandSchema,
  DeleteAppointmentCommandSchema,
  ConfirmAppointmentCommandSchema,
  CancelAppointmentCommandSchema,
  CompleteAppointmentCommandSchema,
  RescheduleAppointmentCommandSchema,
  GetAppointmentByIdQuerySchema,
  GetAppointmentsByPatientIdQuerySchema,
  GetAppointmentsByDateQuerySchema,
  GetAppointmentsByDateRangeQuerySchema,
  CreateAppointmentCommand,
  UpdateAppointmentCommand,
  DeleteAppointmentCommand,
  ConfirmAppointmentCommand,
  CancelAppointmentCommand,
  CompleteAppointmentCommand,
  RescheduleAppointmentCommand,
  GetAppointmentByIdQuery,
  GetAppointmentsByPatientIdQuery,
  GetAppointmentsByDateQuery,
  GetAppointmentsByDateRangeQuery,
} from './AppointmentValidationSchemas';

/**
 * Validation service for CreateAppointmentCommand
 * Encapsulates validation logic for creating new appointments
 */
@injectable()
export class CreateAppointmentValidationService extends ValidationService<unknown, CreateAppointmentCommand> {
  protected schema = CreateAppointmentCommandSchema;
}

/**
 * Validation service for UpdateAppointmentCommand
 * Encapsulates validation logic for updating existing appointments
 */
@injectable()
export class UpdateAppointmentValidationService extends ValidationService<unknown, UpdateAppointmentCommand> {
  protected schema = UpdateAppointmentCommandSchema;
}

/**
 * Validation service for DeleteAppointmentCommand
 * Encapsulates validation logic for deleting appointments
 */
@injectable()
export class DeleteAppointmentValidationService extends ValidationService<unknown, DeleteAppointmentCommand> {
  protected schema = DeleteAppointmentCommandSchema;
}

/**
 * Validation service for ConfirmAppointmentCommand
 * Encapsulates validation logic for confirming appointments
 */
@injectable()
export class ConfirmAppointmentValidationService extends ValidationService<unknown, ConfirmAppointmentCommand> {
  protected schema = ConfirmAppointmentCommandSchema;
}

/**
 * Validation service for CancelAppointmentCommand
 * Encapsulates validation logic for cancelling appointments
 */
@injectable()
export class CancelAppointmentValidationService extends ValidationService<unknown, CancelAppointmentCommand> {
  protected schema = CancelAppointmentCommandSchema;
}

/**
 * Validation service for CompleteAppointmentCommand
 * Encapsulates validation logic for completing appointments
 */
@injectable()
export class CompleteAppointmentValidationService extends ValidationService<unknown, CompleteAppointmentCommand> {
  protected schema = CompleteAppointmentCommandSchema;
}

/**
 * Validation service for RescheduleAppointmentCommand
 * Encapsulates validation logic for rescheduling appointments
 */
@injectable()
export class RescheduleAppointmentValidationService extends ValidationService<unknown, RescheduleAppointmentCommand> {
  protected schema = RescheduleAppointmentCommandSchema;
}

/**
 * Validation service for GetAppointmentByIdQuery
 * Encapsulates validation logic for retrieving appointment by ID
 */
@injectable()
export class GetAppointmentByIdValidationService extends ValidationService<unknown, GetAppointmentByIdQuery> {
  protected schema = GetAppointmentByIdQuerySchema;
}

/**
 * Validation service for GetAppointmentsByPatientIdQuery
 * Encapsulates validation logic for retrieving appointments by patient ID
 */
@injectable()
export class GetAppointmentsByPatientIdValidationService extends ValidationService<unknown, GetAppointmentsByPatientIdQuery> {
  protected schema = GetAppointmentsByPatientIdQuerySchema;
}

/**
 * Validation service for GetAppointmentsByDateQuery
 * Encapsulates validation logic for retrieving appointments by date
 */
@injectable()
export class GetAppointmentsByDateValidationService extends ValidationService<unknown, GetAppointmentsByDateQuery> {
  protected schema = GetAppointmentsByDateQuerySchema;
}

/**
 * Validation service for GetAppointmentsByDateRangeQuery
 * Encapsulates validation logic for retrieving appointments by date range
 */
@injectable()
export class GetAppointmentsByDateRangeValidationService extends ValidationService<unknown, GetAppointmentsByDateRangeQuery> {
  protected schema = GetAppointmentsByDateRangeQuerySchema;
}

/**
 * Composite validation service for all appointment operations
 * Acts as a facade combining all appointment validation services
 */
@injectable()
export class AppointmentValidationService {
  constructor(
    @inject(TOKENS.CreateAppointmentValidationService)
    private createValidationService: CreateAppointmentValidationService,
    @inject(TOKENS.UpdateAppointmentValidationService)
    private updateValidationService: UpdateAppointmentValidationService,
    @inject(TOKENS.DeleteAppointmentValidationService)
    private deleteValidationService: DeleteAppointmentValidationService,
    @inject(TOKENS.ConfirmAppointmentValidationService)
    private confirmValidationService: ConfirmAppointmentValidationService,
    @inject(TOKENS.CancelAppointmentValidationService)
    private cancelValidationService: CancelAppointmentValidationService,
    @inject(TOKENS.CompleteAppointmentValidationService)
    private completeValidationService: CompleteAppointmentValidationService,
    @inject(TOKENS.RescheduleAppointmentValidationService)
    private rescheduleValidationService: RescheduleAppointmentValidationService,
    @inject(TOKENS.GetAppointmentByIdValidationService)
    private getByIdValidationService: GetAppointmentByIdValidationService,
    @inject(TOKENS.GetAppointmentsByPatientIdValidationService)
    private getByPatientIdValidationService: GetAppointmentsByPatientIdValidationService,
    @inject(TOKENS.GetAppointmentsByDateValidationService)
    private getByDateValidationService: GetAppointmentsByDateValidationService,
    @inject(TOKENS.GetAppointmentsByDateRangeValidationService)
    private getByDateRangeValidationService: GetAppointmentsByDateRangeValidationService
  ) {}

  // Command validation methods
  validateCreateCommand(data: unknown): CreateAppointmentCommand {
    return this.createValidationService.validate(data);
  }

  validateUpdateCommand(data: unknown): UpdateAppointmentCommand {
    return this.updateValidationService.validate(data);
  }

  validateDeleteCommand(data: unknown): DeleteAppointmentCommand {
    return this.deleteValidationService.validate(data);
  }

  validateConfirmCommand(data: unknown): ConfirmAppointmentCommand {
    return this.confirmValidationService.validate(data);
  }

  validateCancelCommand(data: unknown): CancelAppointmentCommand {
    return this.cancelValidationService.validate(data);
  }

  validateCompleteCommand(data: unknown): CompleteAppointmentCommand {
    return this.completeValidationService.validate(data);
  }

  validateRescheduleCommand(data: unknown): RescheduleAppointmentCommand {
    return this.rescheduleValidationService.validate(data);
  }

  // Query validation methods
  validateGetByIdQuery(data: unknown): GetAppointmentByIdQuery {
    return this.getByIdValidationService.validate(data);
  }

  validateGetByPatientIdQuery(data: unknown): GetAppointmentsByPatientIdQuery {
    return this.getByPatientIdValidationService.validate(data);
  }

  validateGetByDateQuery(data: unknown): GetAppointmentsByDateQuery {
    return this.getByDateValidationService.validate(data);
  }

  validateGetByDateRangeQuery(data: unknown): GetAppointmentsByDateRangeQuery {
    return this.getByDateRangeValidationService.validate(data);
  }

  // Safe validation methods (return null on error instead of throwing)
  safeValidateCreateCommand(data: unknown): CreateAppointmentCommand | null {
    const result = this.createValidationService.safeParse(data);
    return result.success ? result.data : null;
  }

  safeValidateUpdateCommand(data: unknown): UpdateAppointmentCommand | null {
    const result = this.updateValidationService.safeParse(data);
    return result.success ? result.data : null;
  }

  safeValidateDeleteCommand(data: unknown): DeleteAppointmentCommand | null {
    const result = this.deleteValidationService.safeParse(data);
    return result.success ? result.data : null;
  }

  safeValidateConfirmCommand(data: unknown): ConfirmAppointmentCommand | null {
    const result = this.confirmValidationService.safeParse(data);
    return result.success ? result.data : null;
  }

  safeValidateCancelCommand(data: unknown): CancelAppointmentCommand | null {
    const result = this.cancelValidationService.safeParse(data);
    return result.success ? result.data : null;
  }

  safeValidateRescheduleCommand(data: unknown): RescheduleAppointmentCommand | null {
    const result = this.rescheduleValidationService.safeParse(data);
    return result.success ? result.data : null;
  }

  safeValidateGetByIdQuery(data: unknown): GetAppointmentByIdQuery | null {
    const result = this.getByIdValidationService.safeParse(data);
    return result.success ? result.data : null;
  }

  safeValidateGetByPatientIdQuery(data: unknown): GetAppointmentsByPatientIdQuery | null {
    const result = this.getByPatientIdValidationService.safeParse(data);
    return result.success ? result.data : null;
  }

  safeValidateGetByDateQuery(data: unknown): GetAppointmentsByDateQuery | null {
    const result = this.getByDateValidationService.safeParse(data);
    return result.success ? result.data : null;
  }

  safeValidateGetByDateRangeQuery(data: unknown): GetAppointmentsByDateRangeQuery | null {
    const result = this.getByDateRangeValidationService.safeParse(data);
    return result.success ? result.data : null;
  }
}
