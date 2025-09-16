import { describe, it, expect } from 'vitest';
import { HttpResponse, HttpRequestConfig, IHttpClient } from './IHttpClient';

describe('IHttpClient Interfaces', () => {
  describe('HttpResponse', () => {
    it('should define correct interface structure', () => {
      const response: HttpResponse<{ message: string }> = {
        data: { message: 'test' },
        status: 200,
        statusText: 'OK',
        headers: { 'content-type': 'application/json' },
      };

      expect(response.data).toEqual({ message: 'test' });
      expect(response.status).toBe(200);
      expect(response.statusText).toBe('OK');
      expect(response.headers).toEqual({ 'content-type': 'application/json' });
    });

    it('should support generic typing', () => {
      const stringResponse: HttpResponse<string> = {
        data: 'test string',
        status: 200,
        statusText: 'OK',
        headers: {},
      };

      const numberResponse: HttpResponse<number> = {
        data: 42,
        status: 200,
        statusText: 'OK',
        headers: {},
      };

      expect(typeof stringResponse.data).toBe('string');
      expect(typeof numberResponse.data).toBe('number');
    });
  });

  describe('HttpRequestConfig', () => {
    it('should define optional configuration properties', () => {
      const config: HttpRequestConfig = {
        headers: { 'Authorization': 'Bearer token' },
        timeout: 5000,
        params: { page: 1, limit: 10 },
      };

      expect(config.headers).toEqual({ 'Authorization': 'Bearer token' });
      expect(config.timeout).toBe(5000);
      expect(config.params).toEqual({ page: 1, limit: 10 });
    });

    it('should allow empty configuration', () => {
      const config: HttpRequestConfig = {};
      
      expect(config.headers).toBeUndefined();
      expect(config.timeout).toBeUndefined();
      expect(config.params).toBeUndefined();
    });

    it('should allow partial configuration', () => {
      const configWithHeaders: HttpRequestConfig = {
        headers: { 'Content-Type': 'application/json' },
      };

      const configWithTimeout: HttpRequestConfig = {
        timeout: 3000,
      };

      expect(configWithHeaders.headers).toBeDefined();
      expect(configWithHeaders.timeout).toBeUndefined();
      expect(configWithTimeout.timeout).toBeDefined();
      expect(configWithTimeout.headers).toBeUndefined();
    });
  });

  describe('IHttpClient', () => {
    it('should define all required HTTP methods', () => {
      // Create a mock implementation to verify interface structure
      const mockClient: IHttpClient = {
        get: async () => ({ data: null, status: 200, statusText: 'OK', headers: {} }),
        post: async () => ({ data: null, status: 201, statusText: 'Created', headers: {} }),
        put: async () => ({ data: null, status: 200, statusText: 'OK', headers: {} }),
        delete: async () => ({ data: null, status: 204, statusText: 'No Content', headers: {} }),
        patch: async () => ({ data: null, status: 200, statusText: 'OK', headers: {} }),
      };

      expect(typeof mockClient.get).toBe('function');
      expect(typeof mockClient.post).toBe('function');
      expect(typeof mockClient.put).toBe('function');
      expect(typeof mockClient.delete).toBe('function');
      expect(typeof mockClient.patch).toBe('function');
    });

    it('should support generic typing for all methods', async () => {
      const mockClient: IHttpClient = {
        get: async <T>() => ({ data: {} as T, status: 200, statusText: 'OK', headers: {} }),
        post: async <T>() => ({ data: {} as T, status: 201, statusText: 'Created', headers: {} }),
        put: async <T>() => ({ data: {} as T, status: 200, statusText: 'OK', headers: {} }),
        delete: async <T>() => ({ data: {} as T, status: 204, statusText: 'No Content', headers: {} }),
        patch: async <T>() => ({ data: {} as T, status: 200, statusText: 'OK', headers: {} }),
      };

      // Verify methods can be called with different types
      const getResponse = await mockClient.get<{ id: number }>('/test');
      const postResponse = await mockClient.post<string>('/test', { data: 'test' });

      expect(getResponse.status).toBe(200);
      expect(postResponse.status).toBe(201);
    });

    it('should support optional config parameter', async () => {
      const mockClient: IHttpClient = {
        get: async (url, config?) => ({ 
          data: { url, config }, 
          status: 200, 
          statusText: 'OK', 
          headers: {} 
        }),
        post: async (url, data?, config?) => ({ 
          data: { url, data, config }, 
          status: 201, 
          statusText: 'Created', 
          headers: {} 
        }),
        put: async (url, data?, config?) => ({ 
          data: { url, data, config }, 
          status: 200, 
          statusText: 'OK', 
          headers: {} 
        }),
        delete: async (url, config?) => ({ 
          data: { url, config }, 
          status: 204, 
          statusText: 'No Content', 
          headers: {} 
        }),
        patch: async (url, data?, config?) => ({ 
          data: { url, data, config }, 
          status: 200, 
          statusText: 'OK', 
          headers: {} 
        }),
      };

      // Test with and without config
      const withoutConfig = await mockClient.get('/test');
      const withConfig = await mockClient.get('/test', { timeout: 5000 });

      expect(withoutConfig.data.config).toBeUndefined();
      expect(withConfig.data.config).toEqual({ timeout: 5000 });
    });
  });

  describe('type compatibility', () => {
    it('should maintain type safety across interfaces', () => {
      // Test that the interfaces work together properly
      const createResponse = <T>(data: T): HttpResponse<T> => ({
        data,
        status: 200,
        statusText: 'OK',
        headers: {},
      });

      const stringResponse = createResponse('test');
      const objectResponse = createResponse({ id: 1, name: 'test' });

      expect(stringResponse.data).toBe('test');
      expect(objectResponse.data.id).toBe(1);
      expect(objectResponse.data.name).toBe('test');
    });
  });
});