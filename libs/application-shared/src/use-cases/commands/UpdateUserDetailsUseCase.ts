import { injectable, inject } from 'tsyringe';
import { User, IUserRepository } from '@nx-starter/domain';
import type { UpdateUserDetailsCommand } from '../../dto/UserCommands';
import { TOKENS } from '../../di/tokens';

/**
 * Use case for updating user details
 * Handles all business logic and validation for user profile updates
 */
@injectable()
export class UpdateUserDetailsUseCase {
  constructor(
    @inject(TOKENS.UserRepository) private userRepository: IUserRepository
  ) {}

  async execute(command: UpdateUserDetailsCommand): Promise<User> {
    // Get existing user
    const existingUser = await this.userRepository.getById(command.id);
    if (!existingUser) {
      throw new Error(`User with ID ${command.id} not found`);
    }

    // Prepare the updates - convert to value object format for the repository
    const updates: any = {};

    if (command.firstName !== undefined) {
      updates.firstName = { value: command.firstName };
    }

    if (command.lastName !== undefined) {
      updates.lastName = { value: command.lastName };
    }

    if (command.email !== undefined) {
      updates.email = { value: command.email };
    }

    if (command.mobile !== undefined) {
      updates.mobile = command.mobile ? { value: command.mobile } : undefined;
    }

    if (command.role !== undefined) {
      updates.role = { value: command.role };
    }

    // Persist changes
    await this.userRepository.update(command.id, updates);

    // Return updated user
    const updatedUser = await this.userRepository.getById(command.id);
    if (!updatedUser) {
      throw new Error('Failed to retrieve updated user');
    }

    return updatedUser;
  }
}