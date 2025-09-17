import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UserApiService, UserListResponse } from './UserApiService';
import { IHttpClient } from '../http/IHttpClient';
import { UserDto, UpdateUserDetailsRequestDto, TOKENS } from '@nx-starter/application-shared';

describe('UserApiService', () => {
  let userService: UserApiService;
  let mockHttpClient: IHttpClient;

  beforeEach(() => {
    mockHttpClient = {
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      delete: vi.fn()
    };

    userService = new UserApiService(mockHttpClient);
  });

  describe('getAllUsers', () => {
    it('should get all users successfully', async () => {
      const mockResponse: UserListResponse = {
        success: true,
        data: [
          {
            id: 'user-1',
            firstName: 'John',
            lastName: 'Doe',
            fullName: 'John Doe',
            role: 'admin',
            email: 'john.doe@example.com',
            mobile: '+1234567890'
          },
          {
            id: 'user-2',
            firstName: 'Jane',
            lastName: 'Smith',
            fullName: 'Jane Smith',
            role: 'user',
            email: 'jane.smith@example.com',
            mobile: null
          }
        ]
      };

      vi.mocked(mockHttpClient.get).mockResolvedValue({ data: mockResponse });

      const result = await userService.getAllUsers();

      expect(mockHttpClient.get).toHaveBeenCalledWith('/api/users');
      expect(result).toHaveLength(2);
      
      // Check first user transformation
      expect(result[0]).toEqual({
        id: 'user-1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        username: '',
        role: 'admin',
        mobile: '+1234567890',
        createdAt: expect.any(Date)
      });

      // Check second user transformation (null mobile)
      expect(result[1]).toEqual({
        id: 'user-2',
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@example.com',
        username: '',
        role: 'user',
        mobile: undefined,
        createdAt: expect.any(Date)
      });
    });

    it('should throw error when request fails', async () => {
      const mockResponse = { data: { success: false } };
      vi.mocked(mockHttpClient.get).mockResolvedValue(mockResponse);

      await expect(userService.getAllUsers()).rejects.toThrow('Failed to fetch users');
    });

    it('should handle network errors', async () => {
      const networkError = new Error('Network connection failed');
      vi.mocked(mockHttpClient.get).mockRejectedValue(networkError);

      await expect(userService.getAllUsers()).rejects.toThrow('Network connection failed');
    });

    it('should handle empty user list', async () => {
      const mockResponse: UserListResponse = {
        success: true,
        data: []
      };

      vi.mocked(mockHttpClient.get).mockResolvedValue({ data: mockResponse });

      const result = await userService.getAllUsers();

      expect(result).toEqual([]);
    });

    it('should handle users without mobile numbers', async () => {
      const mockResponse: UserListResponse = {
        success: true,
        data: [
          {
            id: 'user-1',
            firstName: 'Test',
            lastName: 'User',
            fullName: 'Test User',
            role: 'user',
            email: 'test@example.com'
          }
        ]
      };

      vi.mocked(mockHttpClient.get).mockResolvedValue({ data: mockResponse });

      const result = await userService.getAllUsers();

      expect(result[0].mobile).toBeUndefined();
    });
  });

  describe('updateUserDetails', () => {
    it('should update user details successfully', async () => {
      const userId = 'user-1';
      const updateData: UpdateUserDetailsRequestDto = {
        firstName: 'Updated',
        lastName: 'Name',
        email: 'updated@example.com'
      };

      const mockResponse = {
        data: {
          success: true,
          data: {
            id: userId,
            firstName: 'Updated',
            lastName: 'Name',
            email: 'updated@example.com',
            username: 'updateduser',
            roles: ['user'],
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
          } as UserDto
        }
      };

      vi.mocked(mockHttpClient.put).mockResolvedValue(mockResponse);

      const result = await userService.updateUserDetails(userId, updateData);

      expect(mockHttpClient.put).toHaveBeenCalledWith(`/api/users/${userId}`, updateData);
      expect(result).toEqual(mockResponse.data.data);
    });

    it('should throw error when update fails', async () => {
      const userId = 'user-1';
      const updateData: UpdateUserDetailsRequestDto = {
        firstName: 'Updated',
        lastName: 'Name'
      };

      const mockResponse = { data: { success: false } };
      vi.mocked(mockHttpClient.put).mockResolvedValue(mockResponse);

      await expect(userService.updateUserDetails(userId, updateData)).rejects.toThrow('Failed to update user details');
    });

    it('should handle network errors during update', async () => {
      const userId = 'user-1';
      const updateData: UpdateUserDetailsRequestDto = {
        firstName: 'Updated',
        lastName: 'Name'
      };

      const networkError = new Error('Network timeout');
      vi.mocked(mockHttpClient.put).mockRejectedValue(networkError);

      await expect(userService.updateUserDetails(userId, updateData)).rejects.toThrow('Network timeout');
    });

    it('should handle empty user ID', async () => {
      const updateData: UpdateUserDetailsRequestDto = {
        firstName: 'Updated',
        lastName: 'Name'
      };

      const mockResponse = { data: { success: false } };
      vi.mocked(mockHttpClient.put).mockResolvedValue(mockResponse);

      await expect(userService.updateUserDetails('', updateData)).rejects.toThrow('Failed to update user details');
      expect(mockHttpClient.put).toHaveBeenCalledWith('/api/users/', updateData);
    });

    it('should handle partial updates', async () => {
      const userId = 'user-1';
      const updateData: UpdateUserDetailsRequestDto = {
        firstName: 'OnlyFirstName'
      };

      const mockResponse = {
        data: {
          success: true,
          data: {
            id: userId,
            firstName: 'OnlyFirstName',
            lastName: 'ExistingLast',
            email: 'existing@example.com',
            username: 'existinguser',
            roles: ['user'],
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
          } as UserDto
        }
      };

      vi.mocked(mockHttpClient.put).mockResolvedValue(mockResponse);

      const result = await userService.updateUserDetails(userId, updateData);

      expect(result.firstName).toBe('OnlyFirstName');
      expect(result.lastName).toBe('ExistingLast');
    });
  });

  describe('error handling', () => {
    it('should log errors during getAllUsers', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const error = new Error('API Error');
      vi.mocked(mockHttpClient.get).mockRejectedValue(error);

      await expect(userService.getAllUsers()).rejects.toThrow('API Error');
      expect(consoleSpy).toHaveBeenCalledWith('Error fetching users:', error);

      consoleSpy.mockRestore();
    });

    it('should log errors during updateUserDetails', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const error = new Error('Update Error');
      vi.mocked(mockHttpClient.put).mockRejectedValue(error);

      await expect(userService.updateUserDetails('user-1', { firstName: 'Test' })).rejects.toThrow('Update Error');
      expect(consoleSpy).toHaveBeenCalledWith('Error updating user details:', error);

      consoleSpy.mockRestore();
    });
  });

  describe('data transformation', () => {
    it('should properly transform API response to UserDto format', async () => {
      const mockResponse: UserListResponse = {
        success: true,
        data: [
          {
            id: 'test-id',
            firstName: 'Test',
            lastName: 'User',
            fullName: 'Test User',
            role: 'admin',
            email: 'test@example.com',
            mobile: '+1234567890'
          }
        ]
      };

      vi.mocked(mockHttpClient.get).mockResolvedValue({ data: mockResponse });

      const result = await userService.getAllUsers();
      const transformedUser = result[0];

      // Check all required UserDto fields are present
      expect(transformedUser).toHaveProperty('id');
      expect(transformedUser).toHaveProperty('firstName');
      expect(transformedUser).toHaveProperty('lastName');
      expect(transformedUser).toHaveProperty('email');
      expect(transformedUser).toHaveProperty('username');
      expect(transformedUser).toHaveProperty('role');
      expect(transformedUser).toHaveProperty('mobile');
      expect(transformedUser).toHaveProperty('createdAt');

      // Check specific values
      expect(transformedUser.username).toBe(''); // Should be empty as not provided by API
      expect(transformedUser.createdAt).toBeInstanceOf(Date);
    });
  });
});