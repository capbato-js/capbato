import { injectable, inject } from 'tsyringe';
import { TOKENS } from '../../di/tokens';
import { ISerologyResultRepository } from '@nx-starter/domain';
import { SerologyResult } from '@nx-starter/domain';

/**
 * Query handler for retrieving all serology results
 * Follows CQRS pattern - separate from command operations
 */
@injectable()
export class GetAllSerologyResultsQueryHandler {
  constructor(
    @inject(TOKENS.SerologyResultRepository) private readonly serologyResultRepository: ISerologyResultRepository
  ) {}

  async execute(): Promise<SerologyResult[]> {
    return await this.serologyResultRepository.findAll();
  }
}
