import { injectable, inject } from 'tsyringe';
import { IHttpClient } from '../http/IHttpClient';
import { IUserApiService } from './IUserApiService';
import { UserDto, UpdateUserDetailsRequestDto, TOKENS } from '@nx-starter/application-shared';

export interface UserListResponse {
  success: boolean;
  data: Array<{
    id: string;
    firstName: string;
    lastName: string;
    fullName: string; // Keep for backward compatibility
    role: string;
    email: string;
    mobile?: string | null;
  }>;
}

/**
 * User API Service Implementation
 * Handles HTTP communication for user-related operations
 */
@injectable()
export class UserApiService implements IUserApiService {
  constructor(
    @inject(TOKENS.HttpClient)
    private readonly httpClient: IHttpClient
  ) {}

  async getAllUsers(): Promise<UserDto[]> {
    try {
      const response = await this.httpClient.get<UserListResponse>('/api/users');
      
      if (!response.data.success) {
        throw new Error('Failed to fetch users');
      }

      // Transform API response to UserDto format
      return response.data.data.map(user => ({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        username: '', // Not provided by API
        role: user.role,
        mobile: user.mobile || undefined,
        createdAt: new Date(), // Not provided by API
        isDeactivated: false, // Active users only returned by API
      }));
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }

  async updateUserDetails(id: string, data: UpdateUserDetailsRequestDto): Promise<UserDto> {
    try {
      const response = await this.httpClient.put<{ success: boolean; data: UserDto }>(`/api/users/${id}`, data);

      if (!response.data.success) {
        throw new Error('Failed to update user details');
      }

      return response.data.data;
    } catch (error) {
      console.error('Error updating user details:', error);
      throw error;
    }
  }

  async deactivateUser(id: string): Promise<void> {
    try {
      const response = await this.httpClient.put<{ success: boolean; data: { message: string } }>(`/api/users/${id}/deactivate`, {});

      if (!response.data.success) {
        throw new Error('Failed to deactivate user');
      }
    } catch (error) {
      console.error('Error deactivating user:', error);
      throw error;
    }
  }
}
