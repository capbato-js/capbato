import { injectable, inject } from 'tsyringe';
import { TOKENS } from '../../di/tokens';
import { IHematologyResultRepository } from '@nx-starter/domain';
import { HematologyResult } from '@nx-starter/domain';

/**
 * Query handler for retrieving all hematology results
 * Follows CQRS pattern - separate from command operations
 */
@injectable()
export class GetAllHematologyResultsQueryHandler {
  constructor(
    @inject(TOKENS.HematologyResultRepository) private readonly hematologyResultRepository: IHematologyResultRepository
  ) {}

  async execute(): Promise<HematologyResult[]> {
    return await this.hematologyResultRepository.findAll();
  }
}
