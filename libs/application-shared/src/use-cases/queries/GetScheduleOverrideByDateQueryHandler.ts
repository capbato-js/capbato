import { injectable, inject } from 'tsyringe';
import { DoctorScheduleOverride } from '@nx-starter/domain';
import type { IDoctorScheduleOverrideRepository } from '@nx-starter/domain';
import { TOKENS } from '../../di/tokens';
import { GetScheduleOverrideByDateQuery } from '../../dto/ScheduleOverrideQueries';

/**
 * Query handler for retrieving schedule override by date
 * Follows CQRS pattern for data retrieval
 */
@injectable()
export class GetScheduleOverrideByDateQueryHandler {
  constructor(
    @inject(TOKENS.ScheduleOverrideRepository)
    private readonly repository: IDoctorScheduleOverrideRepository
  ) {}

  async execute(query: GetScheduleOverrideByDateQuery): Promise<DoctorScheduleOverride | null> {
    return await this.repository.getByDate(query.date);
  }
}
