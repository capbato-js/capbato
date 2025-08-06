import { injectable, inject } from 'tsyringe';
import { TOKENS } from '../../di/tokens';
import { IHematologyResultRepository } from '@nx-starter/domain';
import { HematologyResult, HematologyResultId } from '@nx-starter/domain';

/**
 * Query handler for retrieving hematology result by ID
 * Follows CQRS pattern - separate from command operations
 */
@injectable()
export class GetHematologyResultByIdQueryHandler {
  constructor(
    @inject(TOKENS.HematologyResultRepository) private readonly hematologyResultRepository: IHematologyResultRepository
  ) {}

  async execute(id: string): Promise<HematologyResult | null> {
    const hematologyResultId = new HematologyResultId(id);
    return await this.hematologyResultRepository.findById(hematologyResultId);
  }
}
