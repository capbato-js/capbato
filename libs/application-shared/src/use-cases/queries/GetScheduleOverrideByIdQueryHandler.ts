import { injectable, inject } from 'tsyringe';
import { DoctorScheduleOverride } from '@nx-starter/domain';
import type { IDoctorScheduleOverrideRepository } from '@nx-starter/domain';
import { ScheduleOverrideNotFoundException } from '@nx-starter/domain';
import { TOKENS } from '../../di/tokens';
import { GetScheduleOverrideByIdQuery } from '../../dto/ScheduleOverrideQueries';

/**
 * Query handler for retrieving schedule override by ID
 * Follows CQRS pattern for data retrieval
 */
@injectable()
export class GetScheduleOverrideByIdQueryHandler {
  constructor(
    @inject(TOKENS.ScheduleOverrideRepository)
    private readonly repository: IDoctorScheduleOverrideRepository
  ) {}

  async execute(query: GetScheduleOverrideByIdQuery): Promise<DoctorScheduleOverride> {
    const override = await this.repository.getById(query.id);
    if (!override) {
      throw new ScheduleOverrideNotFoundException(query.id);
    }
    return override;
  }
}
