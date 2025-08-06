import { injectable, inject } from 'tsyringe';
import { TOKENS } from '../../di/tokens';
import { IUrinalysisResultRepository } from '@nx-starter/domain';
import { UrinalysisResult } from '@nx-starter/domain';

/**
 * Query handler for retrieving all urinalysis results
 * Follows CQRS pattern - separate from command operations
 */
@injectable()
export class GetAllUrinalysisResultsQueryHandler {
  constructor(
    @inject(TOKENS.UrinalysisResultRepository) private readonly urinalysisResultRepository: IUrinalysisResultRepository
  ) {}

  async execute(): Promise<UrinalysisResult[]> {
    return await this.urinalysisResultRepository.findAll();
  }
}
