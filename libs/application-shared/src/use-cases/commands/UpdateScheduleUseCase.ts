import { injectable, inject } from 'tsyringe';
import { Schedule, ScheduleId } from '@nx-starter/domain';
import type { IScheduleRepository } from '@nx-starter/domain';
import type { UpdateScheduleCommand } from '../../dto/ScheduleCommands';
import { TOKENS } from '../../di/tokens';

/**
 * Use case for updating an existing schedule
 * Handles all business logic and validation for schedule updates
 */
@injectable()
export class UpdateScheduleUseCase {
  constructor(
    @inject(TOKENS.ScheduleRepository) private scheduleRepository: IScheduleRepository
  ) {}

  async execute(command: UpdateScheduleCommand): Promise<Schedule> {
    const scheduleId = new ScheduleId(command.id);

    // Get existing schedule
    const existingSchedule = await this.scheduleRepository.getById(scheduleId);
    if (!existingSchedule) {
      throw new Error(`Schedule with ID ${command.id} not found`);
    }

    // Create updated schedule with new values
    let updatedSchedule = existingSchedule;

    if (command.doctorId !== undefined) {
      updatedSchedule = updatedSchedule.updateDoctorId(command.doctorId);
    }

    if (command.date !== undefined) {
      updatedSchedule = updatedSchedule.rescheduleDate(command.date);
    }

    if (command.time !== undefined) {
      updatedSchedule = updatedSchedule.changeTime(command.time);
    }

    // If we're changing date or time, check for conflicts
    if (command.date !== undefined || command.time !== undefined) {
      const conflicts = await this.scheduleRepository.findConflicts(updatedSchedule);
      
      // Filter out the current schedule from conflicts (can't conflict with itself)
      const otherConflicts = conflicts.filter(conflict => 
        !conflict.id?.equals(scheduleId)
      );

      if (otherConflicts.length > 0) {
        const conflict = otherConflicts[0];
        throw new Error(
          `Schedule conflict: Doctor ${conflict.doctorIdString} already has a conflicting appointment on ${conflict.formattedDate} around ${conflict.formattedTime}`
        );
      }
    }

    // Validate business invariants
    updatedSchedule.validate();

    // Persist the updated schedule
    const savedSchedule = await this.scheduleRepository.update(updatedSchedule);

    return savedSchedule;
  }
}