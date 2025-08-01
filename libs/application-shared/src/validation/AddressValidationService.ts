import { injectable, inject } from 'tsyringe';
import { ValidationService } from './ValidationService';
import { TOKENS } from '../di/tokens';
import {
  GetCitiesQuerySchema,
  GetBarangaysQuerySchema,
  GetCitiesQuery,
  GetBarangaysQuery,
} from './AddressValidationSchemas';

/**
 * Validation service for GetCitiesQuery
 * Encapsulates validation logic for getting cities by province code
 */
@injectable()
export class GetCitiesValidationService extends ValidationService<unknown, GetCitiesQuery> {
  protected schema = GetCitiesQuerySchema;
}

/**
 * Validation service for GetBarangaysQuery
 * Encapsulates validation logic for getting barangays by city code
 */
@injectable()
export class GetBarangaysValidationService extends ValidationService<unknown, GetBarangaysQuery> {
  protected schema = GetBarangaysQuerySchema;
}

/**
 * Composite validation service that provides all Address validation operations
 * Follows the Facade pattern to provide a unified interface for Address validation
 */
@injectable()
export class AddressValidationService {
  constructor(
    @inject(TOKENS.GetCitiesValidationService)
    private getCitiesValidator: GetCitiesValidationService,
    @inject(TOKENS.GetBarangaysValidationService)
    private getBarangaysValidator: GetBarangaysValidationService
  ) {}

  /**
   * Validates data for getting cities by province code
   */
  validateGetCitiesQuery(data: unknown): GetCitiesQuery {
    return this.getCitiesValidator.validate(data);
  }

  /**
   * Validates data for getting barangays by city code
   */
  validateGetBarangaysQuery(data: unknown): GetBarangaysQuery {
    return this.getBarangaysValidator.validate(data);
  }

  /**
   * Safe validation for getting cities - returns validation result instead of throwing
   */
  safeValidateGetCitiesQuery(data: unknown) {
    return this.getCitiesValidator.safeParse(data);
  }

  /**
   * Safe validation for getting barangays - returns validation result instead of throwing
   */
  safeValidateGetBarangaysQuery(data: unknown) {
    return this.getBarangaysValidator.safeParse(data);
  }
}