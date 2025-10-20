import { injectable, inject } from 'tsyringe';
import { type ILabRequestRepository, type TopLabTestDto } from '@nx-starter/domain';
import type { GetTopLabTestsQuery } from '../../dto/LabRequestQueries';
import { TOKENS } from '../../di/tokens';

/**
 * Query handler for retrieving top requested lab tests
 */
@injectable()
export class GetTopLabTestsQueryHandler {
  constructor(
    @inject(TOKENS.LabRequestRepository) private labRequestRepository: ILabRequestRepository
  ) {}

  async execute(query?: GetTopLabTestsQuery): Promise<TopLabTestDto[]> {
    return this.labRequestRepository.getTopLabTests(query);
  }
}
