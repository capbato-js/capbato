import { injectable, inject } from 'tsyringe';
import type { IDoctorScheduleOverrideRepository } from '@nx-starter/domain';
import { ScheduleOverrideNotFoundException } from '@nx-starter/domain';
import { TOKENS } from '../../di/tokens';
import { DeleteScheduleOverrideCommand } from '../../dto/ScheduleOverrideCommands';

/**
 * Use case for deleting a doctor schedule override
 * Follows Clean Architecture principles with single responsibility
 */
@injectable()
export class DeleteScheduleOverrideUseCase {
  constructor(
    @inject(TOKENS.ScheduleOverrideRepository)
    private readonly repository: IDoctorScheduleOverrideRepository
  ) {}

  async execute(command: DeleteScheduleOverrideCommand): Promise<void> {
    // Check if override exists
    const existingOverride = await this.repository.getById(command.id);
    if (!existingOverride) {
      throw new ScheduleOverrideNotFoundException(command.id);
    }

    // Delete the override
    await this.repository.delete(command.id);
  }
}
