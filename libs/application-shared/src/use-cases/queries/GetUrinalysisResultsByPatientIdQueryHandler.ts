import { injectable, inject } from 'tsyringe';
import { TOKENS } from '../../di/tokens';
import { IUrinalysisResultRepository } from '@nx-starter/domain';
import { UrinalysisResult } from '@nx-starter/domain';

/**
 * Query handler for retrieving urinalysis results by patient ID
 * Follows CQRS pattern - separate from command operations
 */
@injectable()
export class GetUrinalysisResultsByPatientIdQueryHandler {
  constructor(
    @inject(TOKENS.UrinalysisResultRepository) private readonly urinalysisResultRepository: IUrinalysisResultRepository
  ) {}

  async execute(patientId: string): Promise<UrinalysisResult[]> {
    return await this.urinalysisResultRepository.findByPatientId(patientId);
  }
}
