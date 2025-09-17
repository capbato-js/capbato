import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthApiService } from './AuthApiService';
import { IHttpClient } from '../http/IHttpClient';
import { 
  LoginUserCommand, 
  RegisterUserCommand, 
  TOKENS 
} from '@nx-starter/application-shared';

// Mock dependencies
vi.mock('./config/ApiConfig', () => ({
  getApiConfig: () => ({
    endpoints: {
      auth: {
        login: '/api/auth/login',
        register: '/api/auth/register',
        validate: '/api/auth/validate',
        refresh: '/api/auth/refresh'
      }
    }
  })
}));

describe('AuthApiService', () => {
  let authService: AuthApiService;
  let mockHttpClient: IHttpClient;

  beforeEach(() => {
    mockHttpClient = {
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      delete: vi.fn()
    };

    // Create service with mocked dependency
    authService = new AuthApiService(mockHttpClient);
  });

  describe('login', () => {
    it('should login with email successfully', async () => {
      const loginCommand: LoginUserCommand = {
        identifier: 'test@example.com',
        password: 'password123'
      };

      const mockResponse = {
        data: {
          success: true,
          data: {
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
          }
        }
      };

      vi.mocked(mockHttpClient.post).mockResolvedValue(mockResponse);

      const result = await authService.login(loginCommand);

      expect(mockHttpClient.post).toHaveBeenCalledWith('/api/auth/login', {
        email: 'test@example.com',
        password: 'password123'
      });
      expect(result).toEqual(mockResponse.data.data);
    });

    it('should login with username successfully', async () => {
      const loginCommand: LoginUserCommand = {
        identifier: 'testuser',
        password: 'password123'
      };

      const mockResponse = {
        data: {
          success: true,
          data: {
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
          }
        }
      };

      vi.mocked(mockHttpClient.post).mockResolvedValue(mockResponse);

      const result = await authService.login(loginCommand);

      expect(mockHttpClient.post).toHaveBeenCalledWith('/api/auth/login', {
        username: 'testuser',
        password: 'password123'
      });
      expect(result).toEqual(mockResponse.data.data);
    });

    it('should throw error when auth endpoints not configured', async () => {
      const authServiceWithoutConfig = new (class extends AuthApiService {
        constructor() {
          super(mockHttpClient);
          // Override private readonly property for testing
          (this as any).apiConfig = { endpoints: {} };
        }
      })();

      await expect(authServiceWithoutConfig.login({
        identifier: 'test',
        password: 'test'
      })).rejects.toThrow('Authentication endpoints not configured');
    });

    it('should throw error when no response data', async () => {
      const mockResponse = { data: null };
      vi.mocked(mockHttpClient.post).mockResolvedValue(mockResponse);

      await expect(authService.login({
        identifier: 'test',
        password: 'test'
      })).rejects.toThrow('Login failed - no response data');
    });

    it('should throw error when API response unsuccessful', async () => {
      const mockResponse = {
        data: {
          success: false,
          data: null
        }
      };
      vi.mocked(mockHttpClient.post).mockResolvedValue(mockResponse);

      await expect(authService.login({
        identifier: 'test',
        password: 'test'
      })).rejects.toThrow('Login failed - invalid response format');
    });
  });

  describe('register', () => {
    it('should register user successfully', async () => {
      const registerCommand: RegisterUserCommand = {
        username: 'newuser',
        email: 'new@example.com',
        password: 'password123',
        firstName: 'New',
        lastName: 'User'
      };

      const mockResponse = {
        data: {
          success: true,
          data: { id: 'new-user-id' }
        }
      };

      vi.mocked(mockHttpClient.post).mockResolvedValue(mockResponse);

      const result = await authService.register(registerCommand);

      expect(mockHttpClient.post).toHaveBeenCalledWith('/api/auth/register', registerCommand);
      expect(result).toEqual({ id: 'new-user-id' });
    });

    it('should throw error when auth endpoints not configured', async () => {
      const authServiceWithoutConfig = new (class extends AuthApiService {
        constructor() {
          super(mockHttpClient);
          (this as any).apiConfig = { endpoints: {} };
        }
      })();

      await expect(authServiceWithoutConfig.register({
        username: 'test',
        email: 'test@example.com',
        password: 'test',
        firstName: 'Test',
        lastName: 'User'
      })).rejects.toThrow('Authentication endpoints not configured');
    });

    it('should throw error when registration fails', async () => {
      const mockResponse = {
        data: {
          success: false,
          data: null
        }
      };
      vi.mocked(mockHttpClient.post).mockResolvedValue(mockResponse);

      await expect(authService.register({
        username: 'test',
        email: 'test@example.com',
        password: 'test',
        firstName: 'Test',
        lastName: 'User'
      })).rejects.toThrow('Registration failed - invalid response format');
    });
  });

  describe('validateToken', () => {
    it('should validate token successfully', async () => {
      const mockResponse = {
        data: { valid: true, user: { id: 'user-1' } }
      };

      vi.mocked(mockHttpClient.get).mockResolvedValue(mockResponse);

      const result = await authService.validateToken('valid-token');

      expect(mockHttpClient.get).toHaveBeenCalledWith('/api/auth/validate', {
        headers: {
          Authorization: 'Bearer valid-token'
        }
      });
      expect(result).toEqual(mockResponse.data);
    });

    it('should return invalid when token validation fails', async () => {
      vi.mocked(mockHttpClient.get).mockRejectedValue(new Error('Token invalid'));

      const result = await authService.validateToken('invalid-token');

      expect(result).toEqual({ valid: false });
    });

    it('should throw error when auth endpoints not configured', async () => {
      const authServiceWithoutConfig = new (class extends AuthApiService {
        constructor() {
          super(mockHttpClient);
          (this as any).apiConfig = { endpoints: {} };
        }
      })();

      await expect(authServiceWithoutConfig.validateToken('token')).rejects.toThrow('Authentication endpoints not configured');
    });
  });

  describe('refreshToken', () => {
    it('should refresh token successfully', async () => {
      const mockResponse = {
        data: { token: 'new-jwt-token' }
      };

      vi.mocked(mockHttpClient.post).mockResolvedValue(mockResponse);

      const result = await authService.refreshToken('refresh-token');

      expect(mockHttpClient.post).toHaveBeenCalledWith('/api/auth/refresh', {
        refreshToken: 'refresh-token'
      });
      expect(result).toEqual(mockResponse.data);
    });

    it('should throw error when refresh fails', async () => {
      const mockResponse = { data: null };
      vi.mocked(mockHttpClient.post).mockResolvedValue(mockResponse);

      await expect(authService.refreshToken('invalid-refresh-token')).rejects.toThrow('Token refresh failed');
    });

    it('should throw error when auth endpoints not configured', async () => {
      const authServiceWithoutConfig = new (class extends AuthApiService {
        constructor() {
          super(mockHttpClient);
          (this as any).apiConfig = { endpoints: {} };
        }
      })();

      await expect(authServiceWithoutConfig.refreshToken('token')).rejects.toThrow('Authentication endpoints not configured');
    });
  });
});