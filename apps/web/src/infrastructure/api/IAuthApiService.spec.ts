import { describe, it, expect } from 'vitest';
import { IAuthApiService } from './IAuthApiService';
import { LoginUserCommand, RegisterUserCommand } from '@nx-starter/application-shared';

describe('IAuthApiService', () => {
  describe('interface contract', () => {
    it('should define login method with correct signature', () => {
      // Create a mock implementation to verify interface contract
      const mockService: IAuthApiService = {
        login: async (command: LoginUserCommand) => ({
          token: 'mock-token',
          refreshToken: 'mock-refresh-token',
          user: {
            id: 'user-id',
            username: 'testuser',
            email: 'test@example.com',
            firstName: 'Test',
            lastName: 'User',
            roles: ['user'],
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
          }
        }),
        register: async (command: RegisterUserCommand) => ({ id: 'new-user-id' }),
        validateToken: async (token: string) => ({ valid: true }),
        refreshToken: async (refreshToken: string) => ({ token: 'new-token' })
      };

      expect(mockService.login).toBeDefined();
      expect(typeof mockService.login).toBe('function');
    });

    it('should define register method with correct signature', () => {
      const mockService: IAuthApiService = {
        login: async () => ({
          token: 'mock-token',
          refreshToken: 'mock-refresh-token',
          user: {
            id: 'user-id',
            username: 'testuser',
            email: 'test@example.com',
            firstName: 'Test',
            lastName: 'User',
            roles: ['user'],
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
          }
        }),
        register: async (command: RegisterUserCommand) => ({ id: 'new-user-id' }),
        validateToken: async (token: string) => ({ valid: true }),
        refreshToken: async (refreshToken: string) => ({ token: 'new-token' })
      };

      expect(mockService.register).toBeDefined();
      expect(typeof mockService.register).toBe('function');
    });

    it('should define validateToken method with correct signature', () => {
      const mockService: IAuthApiService = {
        login: async () => ({
          token: 'mock-token',
          refreshToken: 'mock-refresh-token',
          user: {
            id: 'user-id',
            username: 'testuser',
            email: 'test@example.com',
            firstName: 'Test',
            lastName: 'User',
            roles: ['user'],
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
          }
        }),
        register: async () => ({ id: 'new-user-id' }),
        validateToken: async (token: string) => ({ valid: token === 'valid-token' }),
        refreshToken: async (refreshToken: string) => ({ token: 'new-token' })
      };

      expect(mockService.validateToken).toBeDefined();
      expect(typeof mockService.validateToken).toBe('function');
    });

    it('should define refreshToken method with correct signature', () => {
      const mockService: IAuthApiService = {
        login: async () => ({
          token: 'mock-token',
          refreshToken: 'mock-refresh-token',
          user: {
            id: 'user-id',
            username: 'testuser',
            email: 'test@example.com',
            firstName: 'Test',
            lastName: 'User',
            roles: ['user'],
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
          }
        }),
        register: async () => ({ id: 'new-user-id' }),
        validateToken: async () => ({ valid: true }),
        refreshToken: async (refreshToken: string) => ({ token: `refreshed-${refreshToken}` })
      };

      expect(mockService.refreshToken).toBeDefined();
      expect(typeof mockService.refreshToken).toBe('function');
    });

    it('should ensure all methods return Promises', async () => {
      const mockService: IAuthApiService = {
        login: async () => ({
          token: 'mock-token',
          refreshToken: 'mock-refresh-token',
          user: {
            id: 'user-id',
            username: 'testuser',
            email: 'test@example.com',
            firstName: 'Test',
            lastName: 'User',
            roles: ['user'],
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
          }
        }),
        register: async () => ({ id: 'new-user-id' }),
        validateToken: async () => ({ valid: true }),
        refreshToken: async () => ({ token: 'new-token' })
      };

      // Test that all methods return promises
      const loginResult = mockService.login({ identifier: 'test', password: 'test' });
      const registerResult = mockService.register({ 
        username: 'test', 
        email: 'test@example.com', 
        password: 'test',
        firstName: 'Test',
        lastName: 'User'
      });
      const validateResult = mockService.validateToken('token');
      const refreshResult = mockService.refreshToken('refresh');

      expect(loginResult).toBeInstanceOf(Promise);
      expect(registerResult).toBeInstanceOf(Promise);
      expect(validateResult).toBeInstanceOf(Promise);
      expect(refreshResult).toBeInstanceOf(Promise);

      await expect(loginResult).resolves.toBeDefined();
      await expect(registerResult).resolves.toBeDefined();
      await expect(validateResult).resolves.toBeDefined();
      await expect(refreshResult).resolves.toBeDefined();
    });
  });
});