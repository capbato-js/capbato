import { injectable, inject } from 'tsyringe';
import { IAuthCommandService } from '@nx-starter/application-shared';
import { IAuthApiService } from '../api/IAuthApiService';
import {
  LoginUserCommand,
  LoginUserResponseDto,
  RegisterUserCommand,
  TOKENS,
} from '@nx-starter/application-shared';
import { extractErrorMessage, isApiError } from '../utils/ErrorMapping';

/**
 * Authentication Command Service Implementation
 * Handles authentication command operations following CQRS pattern
 */
@injectable()
export class AuthCommandService implements IAuthCommandService {
  constructor(
    @inject(TOKENS.AuthApiService) private readonly authApiService: IAuthApiService
  ) {}

  async login(command: LoginUserCommand): Promise<LoginUserResponseDto> {
    try {
      return await this.authApiService.login(command);
    } catch (error: unknown) {
      // For validation errors, preserve the original error structure
      // so the UI can extract field-specific validation details
      if (isApiError(error)) {
        const apiError = error as any;
        const backendError = apiError.response?.data;
        
        // If it's a validation error with details, preserve the original error
        if (backendError?.code === 'VALIDATION_ERROR' && backendError.details) {
          throw error; // Preserve original error with validation details
        }
      }
      
      // For non-validation errors, use the unified error extraction utility
      const errorMessage = extractErrorMessage(error);
      throw new Error(errorMessage);
    }
  }

  async register(command: RegisterUserCommand): Promise<{ id: string }> {
    try {
      return await this.authApiService.register(command);
    } catch (error: unknown) {
      // For validation errors, preserve the original error structure
      // so the UI can extract field-specific validation details
      if (isApiError(error)) {
        const apiError = error as any;
        const backendError = apiError.response?.data;
        
        // If it's a validation error with details, preserve the original error
        if (backendError?.code === 'VALIDATION_ERROR' && backendError.details) {
          throw error; // Preserve original error with validation details
        }
      }
      
      // For non-validation errors, use the unified error extraction utility
      const errorMessage = extractErrorMessage(error);
      throw new Error(errorMessage);
    }
  }
}