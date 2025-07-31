import { injectable, inject } from 'tsyringe';
import { IUserRepository } from '@nx-starter/domain';
import { ChangeUserPasswordCommand, TOKENS } from '@nx-starter/application-shared';
import { IPasswordHashingService } from '../../services/PasswordHashingService';

/**
 * Change User Password Use Case
 * Handles user password changes following Clean Architecture principles
 */
@injectable()
export class ChangeUserPasswordUseCase {
  constructor(
    @inject(TOKENS.UserRepository)
    private userRepository: IUserRepository,
    @inject(TOKENS.PasswordHashingService)
    private passwordHashingService: IPasswordHashingService
  ) {}

  /**
   * Executes user password change
   * 1. Verify user exists
   * 2. Hash the new password
   * 3. Update user password
   */
  async execute(command: ChangeUserPasswordCommand): Promise<void> {
    // 1. Verify user exists
    const user = await this.userRepository.getById(command.userId);
    if (!user) {
      throw new Error('User not found');
    }

    // 2. Hash the new password
    const hashedPassword = await this.passwordHashingService.hash(command.newPassword);

    // 3. Update user password in repository
    await this.userRepository.updatePassword(command.userId, hashedPassword);
  }
}
