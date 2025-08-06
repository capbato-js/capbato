import { injectable, inject } from 'tsyringe';
import { TOKENS } from '../../di/tokens';
import { IHematologyResultRepository } from '@nx-starter/domain';
import { HematologyResult } from '@nx-starter/domain';

/**
 * Query handler for retrieving hematology results by patient ID
 * Follows CQRS pattern - separate from command operations
 */
@injectable()
export class GetHematologyResultsByPatientIdQueryHandler {
  constructor(
    @inject(TOKENS.HematologyResultRepository) private readonly hematologyResultRepository: IHematologyResultRepository
  ) {}

  async execute(patientId: string): Promise<HematologyResult[]> {
    return await this.hematologyResultRepository.findByPatientId(patientId);
  }
}
