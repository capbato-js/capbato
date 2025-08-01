import { injectable } from 'tsyringe';
import { UserDto } from '../dto/UserDto';

/**
 * User Query Service Interface
 * Handles read operations for users following CQRS pattern
 */
export interface IUserQueryService {
  getAllUsers(): Promise<UserDto[]>;
}

/**
 * User Query Service Implementation
 * Orchestrates user read operations
 */
@injectable()
export class UserQueryService implements IUserQueryService {
  async getAllUsers(): Promise<UserDto[]> {
    // This will be implemented by the infrastructure layer
    throw new Error('Not implemented - should be injected from infrastructure');
  }
}
