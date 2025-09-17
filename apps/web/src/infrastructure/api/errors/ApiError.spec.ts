import { describe, it, expect } from 'vitest';
import { ApiError } from './ApiError';

describe('ApiError', () => {
  describe('constructor', () => {
    it('should create an ApiError with message only', () => {
      const error = new ApiError('Test error');
      
      expect(error.message).toBe('Test error');
      expect(error.name).toBe('ApiError');
      expect(error.status).toBe(0);
      expect(error.data).toBeUndefined();
      expect(error.isApiError).toBe(true);
    });

    it('should create an ApiError with message and status', () => {
      const error = new ApiError('Not found', 404);
      
      expect(error.message).toBe('Not found');
      expect(error.status).toBe(404);
      expect(error.data).toBeUndefined();
    });

    it('should create an ApiError with message, status, and data', () => {
      const data = { field: 'value', errors: ['validation error'] };
      const error = new ApiError('Validation failed', 400, data);
      
      expect(error.message).toBe('Validation failed');
      expect(error.status).toBe(400);
      expect(error.data).toEqual(data);
    });

    it('should extend Error properly', () => {
      const error = new ApiError('Test error');
      
      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(ApiError);
      expect(error.stack).toBeDefined();
    });
  });

  describe('isNetworkError', () => {
    it('should return true for status 0', () => {
      const error = new ApiError('Network error', 0);
      expect(error.isNetworkError).toBe(true);
    });

    it('should return false for non-zero status', () => {
      const error = new ApiError('Server error', 500);
      expect(error.isNetworkError).toBe(false);
    });
  });

  describe('isClientError', () => {
    it('should return true for 4xx status codes', () => {
      expect(new ApiError('Bad Request', 400).isClientError).toBe(true);
      expect(new ApiError('Not Found', 404).isClientError).toBe(true);
      expect(new ApiError('Unprocessable Entity', 422).isClientError).toBe(true);
      expect(new ApiError('Too Many Requests', 429).isClientError).toBe(true);
    });

    it('should return false for non-4xx status codes', () => {
      expect(new ApiError('OK', 200).isClientError).toBe(false);
      expect(new ApiError('Server Error', 500).isClientError).toBe(false);
      expect(new ApiError('Network Error', 0).isClientError).toBe(false);
    });
  });

  describe('isServerError', () => {
    it('should return true for 5xx status codes', () => {
      expect(new ApiError('Internal Server Error', 500).isServerError).toBe(true);
      expect(new ApiError('Bad Gateway', 502).isServerError).toBe(true);
      expect(new ApiError('Service Unavailable', 503).isServerError).toBe(true);
      expect(new ApiError('Gateway Timeout', 504).isServerError).toBe(true);
    });

    it('should return false for non-5xx status codes', () => {
      expect(new ApiError('OK', 200).isServerError).toBe(false);
      expect(new ApiError('Bad Request', 400).isServerError).toBe(false);
      expect(new ApiError('Network Error', 0).isServerError).toBe(false);
    });
  });

  describe('isNotFound', () => {
    it('should return true for 404 status', () => {
      const error = new ApiError('Not Found', 404);
      expect(error.isNotFound).toBe(true);
    });

    it('should return false for non-404 status', () => {
      expect(new ApiError('Bad Request', 400).isNotFound).toBe(false);
      expect(new ApiError('Server Error', 500).isNotFound).toBe(false);
      expect(new ApiError('Network Error', 0).isNotFound).toBe(false);
    });
  });

  describe('userMessage', () => {
    it('should return network error message for status 0', () => {
      const error = new ApiError('Network failed', 0);
      expect(error.userMessage).toBe('Unable to connect to the server. Please check your internet connection.');
    });

    it('should return not found message for 404 status', () => {
      const error = new ApiError('Resource not found', 404);
      expect(error.userMessage).toBe('The requested resource was not found.');
    });

    it('should return server error message for 5xx status', () => {
      const error = new ApiError('Internal error', 500);
      expect(error.userMessage).toBe('Server error occurred. Please try again later.');
    });

    it('should return original message for 4xx errors', () => {
      const error = new ApiError('Invalid input', 400);
      expect(error.userMessage).toBe('Invalid input');
    });

    it('should return default message for 4xx errors without message', () => {
      const error = new ApiError('', 400);
      expect(error.userMessage).toBe('Request failed. Please check your input and try again.');
    });

    it('should return original message for other status codes', () => {
      const error = new ApiError('Custom error', 201);
      expect(error.userMessage).toBe('Custom error');
    });

    it('should return default message for unknown status without message', () => {
      const error = new ApiError('', 201);
      expect(error.userMessage).toBe('An unexpected error occurred.');
    });
  });

  describe('toJSON', () => {
    it('should serialize error to JSON object', () => {
      const data = { field: 'value' };
      const error = new ApiError('Test error', 400, data);
      const json = error.toJSON();
      
      expect(json).toEqual({
        name: 'ApiError',
        message: 'Test error',
        status: 400,
        data: data,
        stack: error.stack,
      });
    });

    it('should handle error without data', () => {
      const error = new ApiError('Simple error', 500);
      const json = error.toJSON();
      
      expect(json.data).toBeUndefined();
      expect(json.name).toBe('ApiError');
      expect(json.message).toBe('Simple error');
      expect(json.status).toBe(500);
    });
  });

  describe('edge cases', () => {
    it('should handle empty message', () => {
      const error = new ApiError('', 400);
      expect(error.message).toBe('');
      expect(error.userMessage).toBe('Request failed. Please check your input and try again.');
    });

    it('should handle negative status codes', () => {
      const error = new ApiError('Negative status', -1);
      expect(error.status).toBe(-1);
      expect(error.isNetworkError).toBe(false);
      expect(error.isClientError).toBe(false);
      expect(error.isServerError).toBe(false);
    });

    it('should handle very large status codes', () => {
      const error = new ApiError('Large status', 999);
      expect(error.status).toBe(999);
      expect(error.isServerError).toBe(false);
      expect(error.isClientError).toBe(false);
    });

    it('should handle complex data objects', () => {
      const complexData = {
        nested: { deep: { value: 'test' } },
        array: [1, 2, 3],
        function: () => 'test',
        date: new Date(),
      };
      const error = new ApiError('Complex data error', 400, complexData);
      expect(error.data).toEqual(complexData);
    });
  });
});