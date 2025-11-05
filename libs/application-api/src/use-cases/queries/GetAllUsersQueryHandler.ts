import { injectable, inject } from 'tsyringe';
import { User, IUserRepository } from '@nx-starter/domain';
import { TOKENS } from '@nx-starter/application-shared';

/**
 * Get All Users Query Handler
 * Handles retrieving all users following Clean Architecture and CQRS principles
 */
@injectable()
export class GetAllUsersQueryHandler {
  constructor(
    @inject(TOKENS.UserRepository)
    private userRepository: IUserRepository
  ) {}

  /**
   * Executes get all users query
   * Returns all active (non-deactivated) users in the system
   */
  async execute(): Promise<User[]> {
    // Retrieve all users from repository
    const allUsers = await this.userRepository.getAll();

    // Filter out deactivated users
    return allUsers.filter(user => !user.isDeactivated);
  }
}
