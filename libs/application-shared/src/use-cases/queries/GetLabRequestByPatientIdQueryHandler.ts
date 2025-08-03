import { injectable, inject } from 'tsyringe';
import { TOKENS } from '../../di/tokens';
import { ILabRequestRepository } from '@nx-starter/domain';
import { LabRequest } from '@nx-starter/domain';
import { LabRequestNotFoundException } from '@nx-starter/domain';

/**
 * Query handler for retrieving a lab request by patient ID
 * Follows CQRS pattern - separate from command operations
 */
@injectable()
export class GetLabRequestByPatientIdQueryHandler {
  constructor(
    @inject(TOKENS.LabRequestRepository) private readonly labRequestRepository: ILabRequestRepository
  ) {}

  async execute(patientId: string): Promise<LabRequest> {
    const labRequests = await this.labRequestRepository.findByPatientId(patientId);
    
    if (!labRequests || labRequests.length === 0) {
      throw new LabRequestNotFoundException(patientId);
    }
    
    // Return the most recent lab request (assuming they're ordered by creation date)
    return labRequests[0];
  }
}
