import { injectable, inject } from 'tsyringe';
import { TOKENS } from '../../di/tokens';
import { IFecalysisResultRepository } from '@nx-starter/domain';
import { FecalysisResult, FecalysisResultId } from '@nx-starter/domain';

/**
 * Query handler for retrieving fecalysis result by ID
 * Follows CQRS pattern - separate from command operations
 */
@injectable()
export class GetFecalysisResultByIdQueryHandler {
  constructor(
    @inject(TOKENS.FecalysisResultRepository) private readonly fecalysisResultRepository: IFecalysisResultRepository
  ) {}

  async execute(id: string): Promise<FecalysisResult | null> {
    const fecalysisResultId = new FecalysisResultId(id);
    return await this.fecalysisResultRepository.findById(fecalysisResultId);
  }
}
