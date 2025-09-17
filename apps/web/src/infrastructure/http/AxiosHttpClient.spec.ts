import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import axios, { AxiosResponse, AxiosError } from 'axios';
import { AxiosHttpClient } from './AxiosHttpClient';
import { ApiError } from '../api/errors/ApiError';
import { HttpRequestConfig } from './IHttpClient';

// Mock axios
vi.mock('axios', () => {
  const actualAxios = vi.importActual('axios');
  return {
    ...actualAxios,
    default: {
      create: vi.fn(),
      isAxiosError: vi.fn(),
    },
    create: vi.fn(),
    isAxiosError: vi.fn(),
  };
});

// Mock config
const mockApiConfig = {
  baseUrl: 'http://localhost:4000',
  timeout: 5000,
};

vi.mock('../config', () => ({
  getApiConfig: vi.fn(() => mockApiConfig),
}));

// Mock localStorage
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

describe('AxiosHttpClient', () => {
  let httpClient: AxiosHttpClient;
  let mockAxiosInstance: any;
  let consoleSpy: any;

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Setup axios create mock
    mockAxiosInstance = {
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      delete: vi.fn(),
      patch: vi.fn(),
      interceptors: {
        request: {
          use: vi.fn(),
        },
        response: {
          use: vi.fn(),
        },
      },
    };
    
    (axios.create as any).mockReturnValue(mockAxiosInstance);
    (axios.isAxiosError as any).mockImplementation(() => true);
    
    // Mock window and localStorage
    Object.defineProperty(global, 'window', {
      value: {
        localStorage: mockLocalStorage,
        location: {
          pathname: '/dashboard',
          href: '',
        },
      },
      writable: true,
    });
    
    consoleSpy = {
      warn: vi.spyOn(console, 'warn').mockImplementation(() => {}),
      error: vi.spyOn(console, 'error').mockImplementation(() => {}),
    };
  });

  afterEach(() => {
    consoleSpy.warn.mockRestore();
    consoleSpy.error.mockRestore();
    vi.resetAllMocks();
  });

  describe('Constructor', () => {
    it('should create axios instance with default config', () => {
      httpClient = new AxiosHttpClient();
      
      expect(axios.create).toHaveBeenCalledWith({
        baseURL: 'http://localhost:4000',
        timeout: 5000,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    });

    it('should create axios instance with custom baseURL', () => {
      const customBaseURL = 'http://custom-api.com';
      httpClient = new AxiosHttpClient(customBaseURL);
      
      expect(axios.create).toHaveBeenCalledWith({
        baseURL: customBaseURL,
        timeout: 5000,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    });

    it('should setup request and response interceptors', () => {
      httpClient = new AxiosHttpClient();
      
      expect(mockAxiosInstance.interceptors.request.use).toHaveBeenCalled();
      expect(mockAxiosInstance.interceptors.response.use).toHaveBeenCalled();
    });
  });

  describe('Request Interceptor', () => {
    let requestInterceptor: any;

    beforeEach(() => {
      httpClient = new AxiosHttpClient();
      requestInterceptor = mockAxiosInstance.interceptors.request.use.mock.calls[0][0];
    });

    it('should add auth token from localStorage when available', () => {
      mockLocalStorage.getItem.mockReturnValue('test-token');
      
      const config = { headers: {} };
      const result = requestInterceptor(config);
      
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith('auth_token');
      expect(result.headers.Authorization).toBe('Bearer test-token');
    });

    it('should not add auth header when token is not available', () => {
      mockLocalStorage.getItem.mockReturnValue(null);
      
      const config = { headers: {} };
      const result = requestInterceptor(config);
      
      expect(result.headers.Authorization).toBeUndefined();
    });

    it('should handle missing window object', () => {
      const originalWindow = global.window;
      delete (global as any).window;
      
      const config = { headers: {} };
      const result = requestInterceptor(config);
      
      expect(result).toBe(config);
      
      global.window = originalWindow;
    });
  });

  describe('Response Interceptor', () => {
    let responseInterceptor: any;
    let errorInterceptor: any;

    beforeEach(() => {
      httpClient = new AxiosHttpClient();
      responseInterceptor = mockAxiosInstance.interceptors.response.use.mock.calls[0][0];
      errorInterceptor = mockAxiosInstance.interceptors.response.use.mock.calls[0][1];
    });

    it('should pass through successful responses', () => {
      const response = { data: { success: true }, status: 200 };
      const result = responseInterceptor(response);
      
      expect(result).toBe(response);
    });

    it('should handle 401 unauthorized errors', async () => {
      const error = {
        response: { status: 401, statusText: 'Unauthorized' },
      };
      
      try {
        await errorInterceptor(error);
      } catch (e) {
        expect(e).toBe(error);
      }
      
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('auth_token');
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('auth_user');
      expect((global.window as any).location.href).toBe('/login');
      expect(consoleSpy.warn).toHaveBeenCalledWith('Unauthorized access - redirecting to login');
    });

    it('should not redirect when already on login page', async () => {
      (global.window as any).location.pathname = '/login';
      
      const error = {
        response: { status: 401, statusText: 'Unauthorized' },
      };
      
      try {
        await errorInterceptor(error);
      } catch (e) {
        expect(e).toBe(error);
      }
      
      expect((global.window as any).location.href).toBe('');
    });

    it('should handle server errors (5xx)', async () => {
      const error = {
        response: { status: 500, statusText: 'Internal Server Error' },
      };
      
      try {
        await errorInterceptor(error);
      } catch (e) {
        expect(e).toBe(error);
      }
      
      expect(consoleSpy.error).toHaveBeenCalledWith('Server error:', 500, 'Internal Server Error');
    });

    it('should handle network errors', async () => {
      const error = {
        request: {},
        response: undefined,
      };
      
      await expect(errorInterceptor(error)).rejects.toThrow('Network error: Unable to connect to the API server');
    });

    it('should handle missing window object in error interceptor', async () => {
      const originalWindow = global.window;
      delete (global as any).window;
      
      const error = {
        response: { status: 401, statusText: 'Unauthorized' },
      };
      
      try {
        await errorInterceptor(error);
      } catch (e) {
        expect(e).toBe(error);
      }
      
      global.window = originalWindow;
    });
  });

  describe('HTTP Methods', () => {
    beforeEach(() => {
      httpClient = new AxiosHttpClient();
    });

    describe('GET', () => {
      it('should make GET request and return transformed response', async () => {
        const mockResponse: AxiosResponse = {
          data: { id: 1, name: 'test' },
          status: 200,
          statusText: 'OK',
          headers: { 'content-type': 'application/json' },
          config: {},
        };
        
        mockAxiosInstance.get.mockResolvedValue(mockResponse);
        
        const result = await httpClient.get('/test');
        
        expect(mockAxiosInstance.get).toHaveBeenCalledWith('/test', undefined);
        expect(result).toEqual({
          data: { id: 1, name: 'test' },
          status: 200,
          statusText: 'OK',
          headers: { 'content-type': 'application/json' },
        });
      });

      it('should make GET request with config', async () => {
        const mockResponse: AxiosResponse = {
          data: { id: 1 },
          status: 200,
          statusText: 'OK',
          headers: {},
          config: {},
        };
        
        mockAxiosInstance.get.mockResolvedValue(mockResponse);
        
        const config: HttpRequestConfig = {
          headers: { 'Authorization': 'Bearer token' },
          timeout: 3000,
          params: { page: 1 },
        };
        
        await httpClient.get('/test', config);
        
        expect(mockAxiosInstance.get).toHaveBeenCalledWith('/test', {
          headers: { 'Authorization': 'Bearer token' },
          timeout: 3000,
          params: { page: 1 },
        });
      });

      it('should handle GET errors', async () => {
        const axiosError = new Error('Network error') as AxiosError;
        axiosError.request = {};
        mockAxiosInstance.get.mockRejectedValue(axiosError);
        
        await expect(httpClient.get('/test')).rejects.toBeInstanceOf(ApiError);
      });
    });

    describe('POST', () => {
      it('should make POST request and return transformed response', async () => {
        const mockResponse: AxiosResponse = {
          data: { id: 1, name: 'created' },
          status: 201,
          statusText: 'Created',
          headers: {},
          config: {},
        };
        
        mockAxiosInstance.post.mockResolvedValue(mockResponse);
        
        const data = { name: 'test' };
        const result = await httpClient.post('/test', data);
        
        expect(mockAxiosInstance.post).toHaveBeenCalledWith('/test', data, undefined);
        expect(result.status).toBe(201);
        expect(result.data).toEqual({ id: 1, name: 'created' });
      });

      it('should make POST request with config', async () => {
        const mockResponse: AxiosResponse = {
          data: {},
          status: 201,
          statusText: 'Created',
          headers: {},
          config: {},
        };
        
        mockAxiosInstance.post.mockResolvedValue(mockResponse);
        
        const data = { name: 'test' };
        const config: HttpRequestConfig = { timeout: 3000 };
        
        await httpClient.post('/test', data, config);
        
        expect(mockAxiosInstance.post).toHaveBeenCalledWith('/test', data, { timeout: 3000 });
      });
    });

    describe('PUT', () => {
      it('should make PUT request and return transformed response', async () => {
        const mockResponse: AxiosResponse = {
          data: { id: 1, name: 'updated' },
          status: 200,
          statusText: 'OK',
          headers: {},
          config: {},
        };
        
        mockAxiosInstance.put.mockResolvedValue(mockResponse);
        
        const data = { name: 'updated' };
        const result = await httpClient.put('/test/1', data);
        
        expect(mockAxiosInstance.put).toHaveBeenCalledWith('/test/1', data, undefined);
        expect(result.data).toEqual({ id: 1, name: 'updated' });
      });
    });

    describe('DELETE', () => {
      it('should make DELETE request and return transformed response', async () => {
        const mockResponse: AxiosResponse = {
          data: null,
          status: 204,
          statusText: 'No Content',
          headers: {},
          config: {},
        };
        
        mockAxiosInstance.delete.mockResolvedValue(mockResponse);
        
        const result = await httpClient.delete('/test/1');
        
        expect(mockAxiosInstance.delete).toHaveBeenCalledWith('/test/1', undefined);
        expect(result.status).toBe(204);
      });
    });

    describe('PATCH', () => {
      it('should make PATCH request and return transformed response', async () => {
        const mockResponse: AxiosResponse = {
          data: { id: 1, name: 'patched' },
          status: 200,
          statusText: 'OK',
          headers: {},
          config: {},
        };
        
        mockAxiosInstance.patch.mockResolvedValue(mockResponse);
        
        const data = { name: 'patched' };
        const result = await httpClient.patch('/test/1', data);
        
        expect(mockAxiosInstance.patch).toHaveBeenCalledWith('/test/1', data, undefined);
        expect(result.data).toEqual({ id: 1, name: 'patched' });
      });
    });
  });

  describe('Error Handling', () => {
    beforeEach(() => {
      httpClient = new AxiosHttpClient();
    });

    it('should handle axios errors with response', async () => {
      const axiosError = {
        message: 'Request failed',
        response: {
          status: 400,
          statusText: 'Bad Request',
          data: { error: 'Invalid input' },
        },
      } as AxiosError;
      
      mockAxiosInstance.get.mockRejectedValue(axiosError);
      
      try {
        await httpClient.get('/test');
      } catch (error) {
        expect(error).toBeInstanceOf(ApiError);
        expect((error as ApiError).status).toBe(400);
        expect((error as ApiError).data).toEqual({ error: 'Invalid input' });
        expect((error as any).response.status).toBe(400);
      }
    });

    it('should handle axios network errors', async () => {
      const axiosError = {
        message: 'Network Error',
        request: {},
      } as AxiosError;
      
      mockAxiosInstance.get.mockRejectedValue(axiosError);
      
      try {
        await httpClient.get('/test');
      } catch (error) {
        expect(error).toBeInstanceOf(ApiError);
        expect((error as ApiError).message).toBe('Network error: Unable to connect to the API server');
        expect((error as any).code).toBe('NETWORK_ERROR');
      }
    });

    it('should handle non-axios errors', async () => {
      const genericError = new Error('Something went wrong');
      
      (axios.isAxiosError as any).mockReturnValue(false);
      mockAxiosInstance.get.mockRejectedValue(genericError);
      
      try {
        await httpClient.get('/test');
      } catch (error) {
        expect(error).toBeInstanceOf(ApiError);
        expect((error as ApiError).message).toBe('Something went wrong');
      }
    });

    it('should handle unknown errors', async () => {
      const unknownError = 'string error';
      
      (axios.isAxiosError as any).mockReturnValue(false);
      mockAxiosInstance.get.mockRejectedValue(unknownError);
      
      try {
        await httpClient.get('/test');
      } catch (error) {
        expect(error).toBeInstanceOf(ApiError);
        expect((error as ApiError).message).toBe('An unexpected error occurred');
      }
    });
  });

  describe('Config Transformation', () => {
    beforeEach(() => {
      httpClient = new AxiosHttpClient();
    });

    it('should transform HttpRequestConfig to AxiosRequestConfig', async () => {
      const mockResponse: AxiosResponse = {
        data: {},
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
      };
      
      mockAxiosInstance.get.mockResolvedValue(mockResponse);
      
      const config: HttpRequestConfig = {
        headers: { 'Custom-Header': 'value' },
        timeout: 10000,
        params: { filter: 'active' },
      };
      
      await httpClient.get('/test', config);
      
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/test', {
        headers: { 'Custom-Header': 'value' },
        timeout: 10000,
        params: { filter: 'active' },
      });
    });

    it('should handle undefined config', async () => {
      const mockResponse: AxiosResponse = {
        data: {},
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
      };
      
      mockAxiosInstance.get.mockResolvedValue(mockResponse);
      
      await httpClient.get('/test');
      
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/test', undefined);
    });
  });
});