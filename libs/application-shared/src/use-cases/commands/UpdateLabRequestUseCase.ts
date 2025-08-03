import { injectable, inject } from 'tsyringe';
import { TOKENS } from '../../di/tokens';
import { ILabRequestRepository } from '@nx-starter/domain';
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
    
    // Update the lab request
    await this.labRequestRepository.update(command.id, command);
  }
}
