import { injectable, inject } from 'tsyringe';
import { DoctorScheduleOverride } from '@nx-starter/domain';
import type { IDoctorScheduleOverrideRepository } from '@nx-starter/domain';
import { ScheduleOverrideNotFoundException } from '@nx-starter/domain';
import { TOKENS } from '../../di/tokens';
import { UpdateScheduleOverrideCommand } from '../../dto/ScheduleOverrideCommands';

/**
 * Use case for updating an existing doctor schedule override
 * Follows Clean Architecture principles with single responsibility
 */
@injectable()
export class UpdateScheduleOverrideUseCase {
  constructor(
    @inject(TOKENS.ScheduleOverrideRepository)
    private readonly repository: IDoctorScheduleOverrideRepository
  ) {}

  async execute(command: UpdateScheduleOverrideCommand): Promise<DoctorScheduleOverride> {
    // Get existing override
    const existingOverride = await this.repository.getById(command.id);
    if (!existingOverride) {
      throw new ScheduleOverrideNotFoundException(command.id);
    }

    // Apply updates
    let updatedOverride = existingOverride;

    if (command.reason) {
      updatedOverride = updatedOverride.updateReason(command.reason);
    }

    if (command.assignedDoctorId) {
      updatedOverride = updatedOverride.updateAssignedDoctor(command.assignedDoctorId);
    }

    // Validate business rules
    updatedOverride.validate();

    // Persist changes
    return await this.repository.update(updatedOverride);
  }
}
