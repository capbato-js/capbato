import { injectable, inject } from 'tsyringe';
import { TOKENS } from '../../di/tokens';
import { IFecalysisResultRepository } from '@nx-starter/domain';
import { FecalysisResult } from '@nx-starter/domain';

/**
 * Query handler for retrieving fecalysis results by patient ID
 * Follows CQRS pattern - separate from command operations
 */
@injectable()
export class GetFecalysisResultsByPatientIdQueryHandler {
  constructor(
    @inject(TOKENS.FecalysisResultRepository) private readonly fecalysisResultRepository: IFecalysisResultRepository
  ) {}

  async execute(patientId: string): Promise<FecalysisResult[]> {
    return await this.fecalysisResultRepository.findByPatientId(patientId);
  }
}
