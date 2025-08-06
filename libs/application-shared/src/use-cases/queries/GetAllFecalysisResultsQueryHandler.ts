import { injectable, inject } from 'tsyringe';
import { TOKENS } from '../../di/tokens';
import { IFecalysisResultRepository } from '@nx-starter/domain';
import { FecalysisResult } from '@nx-starter/domain';

/**
 * Query handler for retrieving all fecalysis results
 * Follows CQRS pattern - separate from command operations
 */
@injectable()
export class GetAllFecalysisResultsQueryHandler {
  constructor(
    @inject(TOKENS.FecalysisResultRepository) private readonly fecalysisResultRepository: IFecalysisResultRepository
  ) {}

  async execute(): Promise<FecalysisResult[]> {
    return await this.fecalysisResultRepository.findAll();
  }
}
