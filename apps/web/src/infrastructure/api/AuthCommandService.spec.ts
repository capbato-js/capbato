import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthCommandService } from './AuthCommandService';
import { IAuthApiService } from './IAuthApiService';
import { 
  LoginUserCommand, 
  RegisterUserCommand,
  LoginUserResponseDto
} from '@nx-starter/application-shared';

// Mock the error mapping utilities
vi.mock('../utils/ErrorMapping', () => ({
  extractErrorMessage: vi.fn((error: any) => {
    // Simulate the real behavior - always returns fallback message for non-API errors
    if (error && typeof error === 'object' && 'message' in error) {
      return error.message;
    }
    return 'An unexpected error occurred. Please try again.';
  }),
  isApiError: vi.fn((error: any) => {
    return error && error.isApiError === true;
  })
}));

describe('AuthCommandService', () => {
  let authCommandService: AuthCommandService;
  let mockAuthApiService: IAuthApiService;

  beforeEach(() => {
    mockAuthApiService = {
      login: vi.fn(),
      register: vi.fn(),
      validateToken: vi.fn(),
      refreshToken: vi.fn()
    };

    authCommandService = new AuthCommandService(mockAuthApiService);
  });

  describe('login', () => {
    it('should login successfully', async () => {
      const loginCommand: LoginUserCommand = {
        identifier: 'test@example.com',
        password: 'password123'
      };

      const expectedResponse: LoginUserResponseDto = {
        token: 'jwt-token',
        refreshToken: 'refresh-token',
        user: {
          id: 'user-1',
          username: 'testuser',
          email: 'test@example.com',
          firstName: 'Test',
          lastName: 'User',
          roles: ['user'],
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      };

      vi.mocked(mockAuthApiService.login).mockResolvedValue(expectedResponse);

      const result = await authCommandService.login(loginCommand);

      expect(mockAuthApiService.login).toHaveBeenCalledWith(loginCommand);
      expect(result).toEqual(expectedResponse);
    });

    it('should preserve validation errors with details', async () => {
      const loginCommand: LoginUserCommand = {
        identifier: 'invalid@example.com',
        password: 'wrong'
      };

      const validationError = {
        isApiError: true,
        response: {
          data: {
            code: 'VALIDATION_ERROR',
            details: {
              identifier: ['Invalid email format'],
              password: ['Password too short']
            }
          }
        }
      };

      // Mock isApiError to return true for validation errors
      const { isApiError } = await import('../utils/ErrorMapping');
      vi.mocked(isApiError).mockReturnValue(true);

      vi.mocked(mockAuthApiService.login).mockRejectedValue(validationError);

      await expect(authCommandService.login(loginCommand)).rejects.toEqual(validationError);
      expect(mockAuthApiService.login).toHaveBeenCalledWith(loginCommand);
    });

    it('should handle non-validation API errors', async () => {
      const loginCommand: LoginUserCommand = {
        identifier: 'test@example.com',
        password: 'password123'
      };

      const serverError = {
        isApiError: true, // Mark as API error
        response: {
          data: {
            code: 'SERVER_ERROR',
            message: 'Internal server error'
          }
        }
      };

      const { isApiError, extractErrorMessage } = await import('../utils/ErrorMapping');
      vi.mocked(isApiError).mockReturnValue(true);
      vi.mocked(extractErrorMessage).mockReturnValue('An unexpected error occurred. Please try again.');

      vi.mocked(mockAuthApiService.login).mockRejectedValue(serverError);

      await expect(authCommandService.login(loginCommand)).rejects.toThrow('An unexpected error occurred. Please try again.');
    });

    it('should handle non-API errors', async () => {
      const loginCommand: LoginUserCommand = {
        identifier: 'test@example.com',
        password: 'password123'
      };

      const networkError = new Error('Network connection failed');

      const { isApiError, extractErrorMessage } = await import('../utils/ErrorMapping');
      vi.mocked(isApiError).mockReturnValue(false);
      vi.mocked(extractErrorMessage).mockReturnValue('Network connection failed');

      vi.mocked(mockAuthApiService.login).mockRejectedValue(networkError);

      await expect(authCommandService.login(loginCommand)).rejects.toThrow('Network connection failed');
    });
  });

  describe('register', () => {
    it('should register successfully', async () => {
      const registerCommand: RegisterUserCommand = {
        username: 'newuser',
        email: 'new@example.com',
        password: 'password123',
        firstName: 'New',
        lastName: 'User'
      };

      const expectedResponse = { id: 'new-user-id' };

      vi.mocked(mockAuthApiService.register).mockResolvedValue(expectedResponse);

      const result = await authCommandService.register(registerCommand);

      expect(mockAuthApiService.register).toHaveBeenCalledWith(registerCommand);
      expect(result).toEqual(expectedResponse);
    });

    it('should preserve validation errors with details', async () => {
      const registerCommand: RegisterUserCommand = {
        username: 'existing',
        email: 'invalid-email',
        password: '123',
        firstName: '',
        lastName: ''
      };

      const validationError = {
        isApiError: true,
        response: {
          data: {
            code: 'VALIDATION_ERROR',
            details: {
              username: ['Username already exists'],
              email: ['Invalid email format'],
              password: ['Password too short'],
              firstName: ['First name is required'],
              lastName: ['Last name is required']
            }
          }
        }
      };

      const { isApiError } = await import('../utils/ErrorMapping');
      vi.mocked(isApiError).mockReturnValue(true);

      vi.mocked(mockAuthApiService.register).mockRejectedValue(validationError);

      await expect(authCommandService.register(registerCommand)).rejects.toEqual(validationError);
      expect(mockAuthApiService.register).toHaveBeenCalledWith(registerCommand);
    });

    it('should handle non-validation API errors', async () => {
      const registerCommand: RegisterUserCommand = {
        username: 'newuser',
        email: 'new@example.com',
        password: 'password123',
        firstName: 'New',
        lastName: 'User'
      };

      const serverError = {
        isApiError: true,
        response: {
          data: {
            code: 'SERVER_ERROR',
            message: 'Database connection failed'
          }
        }
      };

      const { isApiError, extractErrorMessage } = await import('../utils/ErrorMapping');
      vi.mocked(isApiError).mockReturnValue(true);
      vi.mocked(extractErrorMessage).mockReturnValue('An unexpected error occurred. Please try again.');

      vi.mocked(mockAuthApiService.register).mockRejectedValue(serverError);

      await expect(authCommandService.register(registerCommand)).rejects.toThrow('An unexpected error occurred. Please try again.');
    });

    it('should handle non-API errors', async () => {
      const registerCommand: RegisterUserCommand = {
        username: 'newuser',
        email: 'new@example.com',
        password: 'password123',
        firstName: 'New',
        lastName: 'User'
      };

      const unknownError = 'Something went wrong';

      const { isApiError, extractErrorMessage } = await import('../utils/ErrorMapping');
      vi.mocked(isApiError).mockReturnValue(false);
      vi.mocked(extractErrorMessage).mockReturnValue('Something went wrong');

      vi.mocked(mockAuthApiService.register).mockRejectedValue(unknownError);

      await expect(authCommandService.register(registerCommand)).rejects.toThrow('Something went wrong');
    });
  });

  describe('error handling edge cases', () => {
    it('should handle validation errors without details', async () => {
      const validationErrorWithoutDetails = {
        isApiError: true,
        response: {
          data: {
            code: 'VALIDATION_ERROR'
            // No details property
          }
        }
      };

      const { isApiError, extractErrorMessage } = await import('../utils/ErrorMapping');
      vi.mocked(isApiError).mockReturnValue(true);
      vi.mocked(extractErrorMessage).mockReturnValue('An unexpected error occurred. Please try again.');

      vi.mocked(mockAuthApiService.login).mockRejectedValue(validationErrorWithoutDetails);

      await expect(authCommandService.login({ identifier: 'test', password: 'test' })).rejects.toThrow('An unexpected error occurred. Please try again.');
    });

    it('should handle API errors with different error codes', async () => {
      const authError = {
        isApiError: true,
        response: {
          data: {
            code: 'AUTHENTICATION_ERROR',
            details: { field: 'error' }
          }
        }
      };

      const { isApiError, extractErrorMessage } = await import('../utils/ErrorMapping');
      vi.mocked(isApiError).mockReturnValue(true);
      vi.mocked(extractErrorMessage).mockReturnValue('An unexpected error occurred. Please try again.');

      vi.mocked(mockAuthApiService.login).mockRejectedValue(authError);

      await expect(authCommandService.login({ identifier: 'test', password: 'test' })).rejects.toThrow('An unexpected error occurred. Please try again.');
    });
  });
});