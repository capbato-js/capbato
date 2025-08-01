import { injectable } from 'tsyringe';
import { ValidationService } from './ValidationService';
import {
  GetDoctorByIdQuerySchema,
  GetDoctorsBySpecializationQuerySchema,
} from './DoctorValidationSchemas';
import type {
  GetDoctorByIdQuery,
  GetDoctorsBySpecializationQuery,
} from '../dto/DoctorQueries';
import type { ZodType } from 'zod';

/**
 * Validation service for GetDoctorByIdQuery
 * Encapsulates validation logic for getting doctor by ID
 */
@injectable()
export class GetDoctorByIdValidationService extends ValidationService<unknown, GetDoctorByIdQuery> {
  protected schema = GetDoctorByIdQuerySchema as ZodType<GetDoctorByIdQuery>;
}

/**
 * Validation service for GetDoctorsBySpecializationQuery
 * Encapsulates validation logic for getting doctors by specialization
 */
@injectable()
export class GetDoctorsBySpecializationValidationService extends ValidationService<unknown, GetDoctorsBySpecializationQuery> {
  protected schema = GetDoctorsBySpecializationQuerySchema as ZodType<GetDoctorsBySpecializationQuery>;
}

/**
 * Composite Doctor Validation Service
 * Aggregates all doctor-related validation services following TodoValidationService pattern
 */
@injectable()
export class DoctorValidationService {
  constructor(
    private getDoctorByIdValidationService: GetDoctorByIdValidationService,
    private getDoctorsBySpecializationValidationService: GetDoctorsBySpecializationValidationService
  ) {}

  /**
   * Validates GetDoctorByIdQuery data
   */
  validateGetDoctorByIdQuery(data: unknown): GetDoctorByIdQuery {
    return this.getDoctorByIdValidationService.validate(data);
  }

  /**
   * Validates GetDoctorsBySpecializationQuery data
   */
  validateGetDoctorsBySpecializationQuery(data: unknown): GetDoctorsBySpecializationQuery {
    return this.getDoctorsBySpecializationValidationService.validate(data);
  }

  /**
   * Safe validation for GetDoctorByIdQuery (returns validation result without throwing)
   */
  safeValidateGetDoctorByIdQuery(data: unknown) {
    return this.getDoctorByIdValidationService.safeParse(data);
  }

  /**
   * Safe validation for GetDoctorsBySpecializationQuery (returns validation result without throwing)
   */
  safeValidateGetDoctorsBySpecializationQuery(data: unknown) {
    return this.getDoctorsBySpecializationValidationService.safeParse(data);
  }
}
