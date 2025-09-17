import { describe, it, expect } from 'vitest';
import { IUserApiService } from './IUserApiService';

describe('IUserApiService', () => {
  describe('interface contract', () => {
    it('should define all required methods with correct signatures', () => {
      const mockService: IUserApiService = {
        getAllUsers: async () => [],
        updateUserDetails: async (id: string, data: any) => ({
          id,
          username: 'testuser',
          email: 'test@example.com',
          firstName: 'Test',
          lastName: 'User',
          roles: ['user'],
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        })
      };

      expect(mockService.getAllUsers).toBeDefined();
      expect(mockService.updateUserDetails).toBeDefined();
      expect(typeof mockService.getAllUsers).toBe('function');
      expect(typeof mockService.updateUserDetails).toBe('function');
    });

    it('should ensure all methods return Promises', async () => {
      const mockService: IUserApiService = {
        getAllUsers: async () => [],
        updateUserDetails: async () => ({
          id: 'user-1',
          username: 'testuser',
          email: 'test@example.com',
          firstName: 'Test',
          lastName: 'User',
          roles: ['user'],
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        })
      };

      const getAllResult = mockService.getAllUsers();
      const updateResult = mockService.updateUserDetails('user-1', {});

      expect(getAllResult).toBeInstanceOf(Promise);
      expect(updateResult).toBeInstanceOf(Promise);

      const results = await Promise.all([getAllResult, updateResult]);
      expect(results).toHaveLength(2);
      expect(Array.isArray(results[0])).toBe(true);
      expect(results[1]).toBeDefined();
    });
  });
});