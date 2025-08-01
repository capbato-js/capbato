import { UserDto } from '@nx-starter/application-shared';

/**
 * User API Service Interface
 * Defines contract for user-related HTTP operations
 */
export interface IUserApiService {
  getAllUsers(): Promise<UserDto[]>;
}
