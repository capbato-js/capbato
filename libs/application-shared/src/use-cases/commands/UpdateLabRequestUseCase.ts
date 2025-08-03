import { injectable, inject } from 'tsyringe';
import { TOKENS } from '../../di/tokens';
import { ILabRequestRepository, LabRequest } from '@nx-starter/domain';
import { LabRequestNotFoundException } from '@nx-starter/domain';
import { UpdateLabRequestCommand } from '../../dto/LaboratoryDto';

/**
 * Use case for updating an existing lab request
 * Follows the Single Responsibility Principle and CQRS pattern
 */
@injectable()
export class UpdateLabRequestUseCase {
  constructor(
    @inject(TOKENS.LabRequestRepository) private readonly labRequestRepository: ILabRequestRepository
  ) {}

  async execute(command: UpdateLabRequestCommand): Promise<void> {
    // Check if lab request exists
    const existingLabRequest = await this.labRequestRepository.getById(command.id);
    
    if (!existingLabRequest) {
      throw new LabRequestNotFoundException(command.id);
    }
    
    // Create updated lab request with new values
    const updatedLabRequest = new LabRequest(
      existingLabRequest.patientInfo,
      command.request_date || existingLabRequest.requestDate,
      existingLabRequest.tests,
      existingLabRequest.status,
      existingLabRequest.id,
      command.date_taken || existingLabRequest.dateTaken,
      command.others || existingLabRequest.others,
      existingLabRequest.createdAt,
      new Date()
    );
    
    // Update the lab request
    await this.labRequestRepository.update(updatedLabRequest);
  }
}
