import { injectable, inject } from 'tsyringe';
import { IUserRepository, CannotDeactivateSelfException } from '@nx-starter/domain';
import type { DeactivateUserCommand } from '../../dto/UserCommands';
import { TOKENS } from '../../di/tokens';

/**
 * Use case for deactivating a user account
 * Handles business logic and validation for account deactivation
 */
@injectable()
export class DeactivateUserUseCase {
  constructor(
    @inject(TOKENS.UserRepository) private userRepository: IUserRepository
  ) {}

  async execute(command: DeactivateUserCommand): Promise<void> {
    console.log('[DeactivateUserUseCase] Received command:', JSON.stringify(command, null, 2));

    // Prevent self-deactivation
    if (command.userId === command.requestingUserId) {
      throw new CannotDeactivateSelfException();
    }

    // Get existing user
    const existingUser = await this.userRepository.getById(command.userId);
    if (!existingUser) {
      throw new Error(`User with ID ${command.userId} not found`);
    }

    // Check if user is already deactivated
    if (existingUser.isDeactivated) {
      throw new Error(`User with ID ${command.userId} is already deactivated`);
    }

    // Deactivate the user
    await this.userRepository.deactivateUser(command.userId);

    console.log('[DeactivateUserUseCase] User deactivated successfully');
  }
}
