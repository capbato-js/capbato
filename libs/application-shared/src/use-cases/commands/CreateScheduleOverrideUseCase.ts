import { injectable, inject } from 'tsyringe';
import { DoctorScheduleOverride } from '@nx-starter/domain';
import type { IDoctorScheduleOverrideRepository } from '@nx-starter/domain';
import { ScheduleOverrideAlreadyExistsException } from '@nx-starter/domain';
import { TOKENS } from '../../di/tokens';
import { CreateScheduleOverrideCommand } from '../../dto/ScheduleOverrideCommands';

/**
 * Use case for creating a new doctor schedule override
 * Follows Clean Architecture principles with single responsibility
 */
@injectable()
export class CreateScheduleOverrideUseCase {
  constructor(
    @inject(TOKENS.ScheduleOverrideRepository)
    private readonly repository: IDoctorScheduleOverrideRepository
  ) {}

  async execute(command: CreateScheduleOverrideCommand): Promise<DoctorScheduleOverride> {
    // Check if override already exists for this date
    const existingOverride = await this.repository.getByDate(command.date);
    if (existingOverride) {
      throw new ScheduleOverrideAlreadyExistsException(command.date);
    }

    // Create new override entity
    const override = DoctorScheduleOverride.create(
      command.date,
      command.assignedDoctorId,
      command.reason,
      command.originalDoctorId
    );

    // Validate business rules
    override.validate();

    // Persist to repository
    return await this.repository.create(override);
  }
}
