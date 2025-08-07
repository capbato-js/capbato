import { injectable, inject } from 'tsyringe';
import { TOKENS } from '../../di/tokens';
import { ILabRequestRepository, LabRequestId } from '@nx-starter/domain';
import { LabRequestNotFoundException } from '@nx-starter/domain';

export interface UpdateLabRequestStatusByIdCommand {
  labRequestId: string;
  status: 'complete' | 'cancelled';
  dateTaken?: Date;
}

/**
 * Use case for updating lab request status by ID
 * Follows the Single Responsibility Principle and CQRS pattern
 */
@injectable()
export class UpdateLabRequestStatusByIdUseCase {
  constructor(
    @inject(TOKENS.LabRequestRepository) private readonly labRequestRepository: ILabRequestRepository
  ) {}

  async execute(command: UpdateLabRequestStatusByIdCommand): Promise<void> {
    // Find lab request by ID
    const labRequestId = new LabRequestId(command.labRequestId);
    const existingLabRequest = await this.labRequestRepository.findById(labRequestId);
    
    if (!existingLabRequest) {
      throw new LabRequestNotFoundException(command.labRequestId);
    }

    // Update the lab request using domain methods
    let updatedLabRequest = existingLabRequest;

    // Update status
    if (command.status === 'complete') {
      updatedLabRequest = updatedLabRequest.complete(command.dateTaken || new Date());
    } else if (command.status === 'cancelled') {
      updatedLabRequest = updatedLabRequest.cancel();
    }

    // Save the updated lab request
    await this.labRequestRepository.update(updatedLabRequest);
  }
}
