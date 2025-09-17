import { describe, it, expect } from 'vitest';
import { z } from 'zod';
import {
  mapZodErrorToFormErrors,
  getFieldError,
  hasFieldError,
  transformFormDataToCommand,
  isApiError,
  isHttpErrorResponse,
  isApiErrorResponse,
  isAuthErrorResponse,
  extractErrorMessage,
  FormError,
} from './ErrorMapping';

describe('ErrorMapping', () => {
  describe('mapZodErrorToFormErrors', () => {
    it('should map simple validation errors', () => {
      const schema = z.object({
        title: z.string().min(1),
        email: z.string().email(),
      });

      try {
        schema.parse({ title: '', email: 'invalid' });
      } catch (error) {
        const formErrors = mapZodErrorToFormErrors(error as z.ZodError);
        
        expect(formErrors).toHaveLength(2);
        expect(formErrors[0]).toEqual({
          field: 'title',
          message: 'Title is required',
        });
        expect(formErrors[1].field).toBe('email');
        expect(formErrors[1].message).toContain('email');
      }
    });

    it('should handle minimum length validation', () => {
      const schema = z.object({
        password: z.string().min(8),
      });

      try {
        schema.parse({ password: '123' });
      } catch (error) {
        const formErrors = mapZodErrorToFormErrors(error as z.ZodError);
        
        expect(formErrors[0]).toEqual({
          field: 'password',
          message: 'Password must be at least 8 characters',
        });
      }
    });

    it('should handle maximum length validation', () => {
      const schema = z.object({
        title: z.string().max(50),
      });

      try {
        schema.parse({ title: 'a'.repeat(100) });
      } catch (error) {
        const formErrors = mapZodErrorToFormErrors(error as z.ZodError);
        
        expect(formErrors[0]).toEqual({
          field: 'title',
          message: 'Title cannot exceed 50 characters',
        });
      }
    });

    it('should handle nested field paths', () => {
      const schema = z.object({
        user: z.object({
          name: z.string().min(1),
        }),
      });

      try {
        schema.parse({ user: { name: '' } });
      } catch (error) {
        const formErrors = mapZodErrorToFormErrors(error as z.ZodError);
        
        expect(formErrors[0]).toEqual({
          field: 'user.name',
          message: 'User is required',
        });
      }
    });

    it('should handle custom validation messages', () => {
      const schema = z.object({
        age: z.string().min(18, 'Must be at least 18 years old'),
      });

      try {
        schema.parse({ age: '16' });
      } catch (error) {
        const formErrors = mapZodErrorToFormErrors(error as z.ZodError);
        
        expect(formErrors[0]).toEqual({
          field: 'age',
          message: 'Age must be at least 18 characters',
        });
      }
    });
  });

  describe('getFieldError', () => {
    it('should return error message for specific field', () => {
      const schema = z.object({
        title: z.string().min(1),
        email: z.string().email(),
      });

      try {
        schema.parse({ title: '', email: 'valid@email.com' });
      } catch (error) {
        const titleError = getFieldError(error as z.ZodError, 'title');
        const emailError = getFieldError(error as z.ZodError, 'email');
        
        expect(titleError).toBe('Title is required');
        expect(emailError).toBeNull();
      }
    });

    it('should return null for non-existent field', () => {
      const schema = z.object({
        title: z.string().min(1),
      });

      try {
        schema.parse({ title: '' });
      } catch (error) {
        const nonExistentError = getFieldError(error as z.ZodError, 'nonExistent');
        expect(nonExistentError).toBeNull();
      }
    });

    it('should return null when no error', () => {
      const result = getFieldError(null, 'anyField');
      expect(result).toBeNull();
    });
  });

  describe('hasFieldError', () => {
    it('should return true when field has error', () => {
      const schema = z.object({
        title: z.string().min(1),
      });

      try {
        schema.parse({ title: '' });
      } catch (error) {
        const hasError = hasFieldError(error as z.ZodError, 'title');
        expect(hasError).toBe(true);
      }
    });

    it('should return false when field has no error', () => {
      const schema = z.object({
        title: z.string().min(1),
        email: z.string().email(),
      });

      try {
        schema.parse({ title: '', email: 'valid@email.com' });
      } catch (error) {
        const hasEmailError = hasFieldError(error as z.ZodError, 'email');
        expect(hasEmailError).toBe(false);
      }
    });

    it('should return false when no error', () => {
      const result = hasFieldError(null, 'anyField');
      expect(result).toBe(false);
    });
  });

  describe('transformFormDataToCommand', () => {
    it('should transform form data using string mapping', () => {
      const formData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
      };

      const transformMap = {
        firstName: 'first_name',
        lastName: 'last_name',
        email: 'email_address',
      };

      const command = transformFormDataToCommand(formData, transformMap);

      expect(command).toEqual({
        first_name: 'John',
        last_name: 'Doe',
        email_address: 'john@example.com',
      });
    });

    it('should transform form data using function mapping', () => {
      const formData = {
        name: 'John Doe',
        age: 30,
      };

      const transformMap = {
        name: (value: unknown) => {
          const [firstName, lastName] = (value as string).split(' ');
          return { first_name: firstName, last_name: lastName };
        },
        age: 'user_age',
      };

      const command = transformFormDataToCommand(formData, transformMap);

      expect(command).toEqual({
        first_name: 'John',
        last_name: 'Doe',
        user_age: 30,
      });
    });
  });

  describe('type guards', () => {
    describe('isApiError', () => {
      it('should return true for ApiError objects', () => {
        const apiError = { isApiError: true, message: 'Error' };
        expect(isApiError(apiError)).toBe(true);
      });

      it('should return false for non-ApiError objects', () => {
        expect(isApiError(new Error('Regular error'))).toBe(false);
        expect(isApiError(null)).toBe(false);
        expect(isApiError(undefined)).toBe(false);
        expect(isApiError('string')).toBe(false);
      });
    });

    describe('isHttpErrorResponse', () => {
      it('should return true for HttpErrorResponse objects', () => {
        const httpError = { response: {}, message: 'Error' };
        expect(isHttpErrorResponse(httpError)).toBe(true);
      });

      it('should return false for non-HttpErrorResponse objects', () => {
        expect(isHttpErrorResponse({ message: 'Error' })).toBe(false);
        expect(isHttpErrorResponse(null)).toBe(false);
      });
    });

    describe('isApiErrorResponse', () => {
      it('should return true for ApiErrorResponse objects', () => {
        const apiErrorResponse = { success: false, error: 'Error message' };
        expect(isApiErrorResponse(apiErrorResponse)).toBe(true);
      });

      it('should return false for non-ApiErrorResponse objects', () => {
        expect(isApiErrorResponse({ success: true })).toBe(false);
        expect(isApiErrorResponse({ error: 'Error' })).toBe(false);
      });
    });

    describe('isAuthErrorResponse', () => {
      it('should return true for AuthErrorResponse objects', () => {
        const authErrorResponse = {
          success: false,
          error: 'Auth error',
          code: 'AUTH_INVALID_CREDENTIALS',
        };
        expect(isAuthErrorResponse(authErrorResponse)).toBe(true);
      });

      it('should return false for non-AuthErrorResponse objects', () => {
        const apiErrorResponse = { success: false, error: 'Error message' };
        expect(isAuthErrorResponse(apiErrorResponse)).toBe(false);
      });
    });
  });

  describe('extractErrorMessage', () => {
    it('should extract message from ApiError', () => {
      const apiError = {
        isApiError: true,
        message: 'API error message',
        status: 400,
      };
      
      const message = extractErrorMessage(apiError);
      expect(message).toBe('API error message');
    });

    it('should extract message from ApiError with backend response', () => {
      const apiError = {
        isApiError: true,
        response: {
          data: {
            success: false,
            error: 'Backend error message',
          },
        },
      };
      
      const message = extractErrorMessage(apiError);
      expect(message).toBe('Backend error message');
    });

    it('should handle auth error responses', () => {
      const apiError = {
        isApiError: true,
        response: {
          data: {
            success: false,
            error: 'Invalid credentials',
            code: 'AUTH_INVALID_CREDENTIALS',
          },
        },
      };
      
      const message = extractErrorMessage(apiError);
      expect(message).toBe('Invalid credentials');
    });

    it('should handle network errors', () => {
      const networkError = {
        isApiError: true,
        code: 'NETWORK_ERROR',
        message: 'Network failed',
      };
      
      const message = extractErrorMessage(networkError);
      expect(message).toBe('Network error. Please check your connection.');
    });

    it('should handle status-based error mapping', () => {
      const apiError = {
        isApiError: true,
        status: 401,
        message: 'Unauthorized',
      };
      
      const message = extractErrorMessage(apiError);
      expect(message).toBe('Invalid email/username or password');
    });

    it('should handle HTTP error responses', () => {
      const httpError = {
        response: {
          status: 500,
          data: {
            success: false,
            error: 'Server error',
          },
        },
        message: 'HTTP error',
      };
      
      const message = extractErrorMessage(httpError);
      expect(message).toBe('Server error');
    });

    it('should handle generic Error objects', () => {
      const error = new Error('Generic error message');
      
      const message = extractErrorMessage(error);
      expect(message).toBe('Generic error message');
    });

    it('should handle string errors', () => {
      const message = extractErrorMessage('String error');
      expect(message).toBe('String error');
    });

    it('should provide fallback for unknown errors', () => {
      const message = extractErrorMessage({ unknown: 'error' });
      expect(message).toBe('An unexpected error occurred. Please try again.');
    });

    it('should handle null/undefined errors', () => {
      expect(extractErrorMessage(null)).toBe('An unexpected error occurred. Please try again.');
      expect(extractErrorMessage(undefined)).toBe('An unexpected error occurred. Please try again.');
    });

    it('should handle 429 rate limit errors', () => {
      const apiError = {
        isApiError: true,
        status: 429,
        message: 'Too many requests',
      };
      
      const message = extractErrorMessage(apiError);
      expect(message).toBe('Too many login attempts. Please try again later.');
    });

    it('should handle 500+ server errors', () => {
      const apiError = {
        isApiError: true,
        status: 503,
        message: 'Service unavailable',
      };
      
      const message = extractErrorMessage(apiError);
      expect(message).toBe('Server error. Please try again later.');
    });
  });

  describe('field display names', () => {
    it('should use predefined display names for known fields', () => {
      const schema = z.object({
        firstName: z.string().min(1),
        email: z.string().min(1),
        identifier: z.string().min(1),
      });

      try {
        schema.parse({ firstName: '', email: '', identifier: '' });
      } catch (error) {
        const formErrors = mapZodErrorToFormErrors(error as z.ZodError);
        
        const firstNameError = formErrors.find(e => e.field === 'firstName');
        const emailError = formErrors.find(e => e.field === 'email');
        const identifierError = formErrors.find(e => e.field === 'identifier');
        
        expect(firstNameError?.message).toBe('First name is required');
        expect(emailError?.message).toBe('Email is required');
        expect(identifierError?.message).toBe('Email or username is required');
      }
    });

    it('should capitalize unknown field names', () => {
      const schema = z.object({
        unknownField: z.string().min(1),
      });

      try {
        schema.parse({ unknownField: '' });
      } catch (error) {
        const formErrors = mapZodErrorToFormErrors(error as z.ZodError);
        
        expect(formErrors[0].message).toBe('UnknownField is required');
      }
    });
  });
});