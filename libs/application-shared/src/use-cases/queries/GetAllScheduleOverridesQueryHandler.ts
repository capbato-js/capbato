import { injectable, inject } from 'tsyringe';
import { DoctorScheduleOverride } from '@nx-starter/domain';
import type { IDoctorScheduleOverrideRepository } from '@nx-starter/domain';
import { TOKENS } from '../../di/tokens';

/**
 * Query handler for retrieving all schedule overrides
 * Follows CQRS pattern for data retrieval
 */
@injectable()
export class GetAllScheduleOverridesQueryHandler {
  constructor(
    @inject(TOKENS.ScheduleOverrideRepository)
    private readonly repository: IDoctorScheduleOverrideRepository
  ) {}

  async execute(): Promise<DoctorScheduleOverride[]> {
    return await this.repository.getAll();
  }
}
