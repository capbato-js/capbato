import { injectable, inject } from 'tsyringe';
import { IHttpClient } from '../http/IHttpClient';
import { IUserApiService } from './IUserApiService';
import { UserDto, TOKENS } from '@nx-starter/application-shared';

export interface UserListResponse {
  success: boolean;
  data: Array<{
    id: string;
    fullName: string;
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
        firstName: user.fullName.split(' ')[0] || '',
        lastName: user.fullName.split(' ').slice(1).join(' ') || '',
        email: user.email,
        username: '', // Not provided by API
        role: user.role,
        mobile: user.mobile || undefined,
        createdAt: new Date(), // Not provided by API
      }));
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }
}
