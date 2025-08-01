import { injectable, inject } from 'tsyringe';
import { ScheduleId } from '@nx-starter/domain';
import type { IScheduleRepository } from '@nx-starter/domain';
import type { DeleteScheduleCommand } from '../../dto/ScheduleCommands';
import { TOKENS } from '../../di/tokens';

/**
 * Use case for deleting a schedule
 * Handles all business logic and validation for schedule deletion
 */
@injectable()
export class DeleteScheduleUseCase {
  constructor(
    @inject(TOKENS.ScheduleRepository) private scheduleRepository: IScheduleRepository
  ) {}

  async execute(command: DeleteScheduleCommand): Promise<void> {
    const scheduleId = new ScheduleId(command.id);

    // Check if schedule exists
    const existingSchedule = await this.scheduleRepository.getById(scheduleId);
    if (!existingSchedule) {
      throw new Error(`Schedule with ID ${command.id} not found`);
    }

    // Business rule: Can only delete future schedules
    if (!existingSchedule.isFuture() && !existingSchedule.isToday()) {
      throw new Error('Cannot delete past schedules');
    }

    // Delete the schedule
    const deleted = await this.scheduleRepository.delete(scheduleId);
    
    if (!deleted) {
      throw new Error(`Failed to delete schedule with ID ${command.id}`);
    }
  }
}