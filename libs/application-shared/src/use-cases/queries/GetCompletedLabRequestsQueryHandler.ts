import { injectable, inject } from 'tsyringe';
import { TOKENS } from '../../di/tokens';
import { ILabRequestRepository } from '@nx-starter/domain';
import { LabRequest } from '@nx-starter/domain';

/**
 * Query handler for retrieving completed lab requests
 * Follows CQRS pattern - separate from command operations
 */
@injectable()
export class GetCompletedLabRequestsQueryHandler {
  constructor(
    @inject(TOKENS.LabRequestRepository) private readonly labRequestRepository: ILabRequestRepository
  ) {}

  async execute(): Promise<LabRequest[]> {
    return await this.labRequestRepository.findCompleted();
  }
}
