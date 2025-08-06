import { injectable, inject } from 'tsyringe';
import { TOKENS } from '../../di/tokens';
import { IUrinalysisResultRepository } from '@nx-starter/domain';
import { UrinalysisResult, UrinalysisResultId } from '@nx-starter/domain';

/**
 * Query handler for retrieving urinalysis result by ID
 * Follows CQRS pattern - separate from command operations
 */
@injectable()
export class GetUrinalysisResultByIdQueryHandler {
  constructor(
    @inject(TOKENS.UrinalysisResultRepository) private readonly urinalysisResultRepository: IUrinalysisResultRepository
  ) {}

  async execute(id: string): Promise<UrinalysisResult | null> {
    const urinalysisResultId = new UrinalysisResultId(id);
    return await this.urinalysisResultRepository.findById(urinalysisResultId);
  }
}
