import { injectable, inject } from 'tsyringe';
import { TOKENS } from '../../di/tokens';
import { ISerologyResultRepository } from '@nx-starter/domain';
import { SerologyResult } from '@nx-starter/domain';

/**
 * Query handler for retrieving serology results by patient ID
 * Follows CQRS pattern - separate from command operations
 */
@injectable()
export class GetSerologyResultsByPatientIdQueryHandler {
  constructor(
    @inject(TOKENS.SerologyResultRepository) private readonly serologyResultRepository: ISerologyResultRepository
  ) {}

  async execute(patientId: string): Promise<SerologyResult[]> {
    return await this.serologyResultRepository.findByPatientId(patientId);
  }
}
