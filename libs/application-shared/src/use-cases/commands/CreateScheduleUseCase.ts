import { injectable, inject } from 'tsyringe';
import { Schedule } from '@nx-starter/domain';
import type { IScheduleRepository } from '@nx-starter/domain';
import type { CreateScheduleCommand } from '../../dto/ScheduleCommands';
import { TOKENS } from '../../di/tokens';

/**
 * Use case for creating a new schedule
 * Handles all business logic and validation for schedule creation
 */
@injectable()
export class CreateScheduleUseCase {
  constructor(
    @inject(TOKENS.ScheduleRepository) private scheduleRepository: IScheduleRepository
  ) {}

  async execute(command: CreateScheduleCommand): Promise<Schedule> {
    // Create schedule entity with domain logic and validation
    const schedule = new Schedule(
      command.doctorId,
      command.date,
      command.time
    );

    // Validate business invariants
    schedule.validate();

    // Check for conflicts with existing schedules
    const conflicts = await this.scheduleRepository.findConflicts(schedule);
    if (conflicts.length > 0) {
      const conflict = conflicts[0];
      throw new Error(
        `Schedule conflict: Doctor ${conflict.doctorIdString} already has a conflicting appointment on ${conflict.formattedDate} around ${conflict.formattedTime}`
      );
    }

    // Persist using repository
    const createdSchedule = await this.scheduleRepository.create(schedule);

    return createdSchedule;
  }
}