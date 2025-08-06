import { injectable, inject } from 'tsyringe';
import { TOKENS } from '../../di/tokens';
import { ISerologyResultRepository } from '@nx-starter/domain';
import { SerologyResult, SerologyResultId } from '@nx-starter/domain';

/**
 * Query handler for retrieving serology result by ID
 * Follows CQRS pattern - separate from command operations
 */
@injectable()
export class GetSerologyResultByIdQueryHandler {
  constructor(
    @inject(TOKENS.SerologyResultRepository) private readonly serologyResultRepository: ISerologyResultRepository
  ) {}

  async execute(id: string): Promise<SerologyResult | null> {
    const serologyResultId = new SerologyResultId(id);
    return await this.serologyResultRepository.findById(serologyResultId);
  }
}
