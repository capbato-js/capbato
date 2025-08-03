import { injectable, inject } from 'tsyringe';
import { TOKENS } from '../../di/tokens';
import { ILabRequestRepository } from '@nx-starter/domain';
import { LaboratoryMapper } from '../../mappers/LaboratoryMapper';
import { CreateLabRequestCommand } from '../../dto/LaboratoryDto';
import { LabRequest } from '@nx-starter/domain';

/**
 * Use case for creating a new lab request
 * Follows the Single Responsibility Principle and CQRS pattern
 */
@injectable()
export class CreateLabRequestUseCase {
  constructor(
    @inject(TOKENS.LabRequestRepository) private readonly labRequestRepository: ILabRequestRepository
  ) {}

  async execute(command: CreateLabRequestCommand): Promise<LabRequest> {
    // Convert command to domain entity
    const labRequest = LaboratoryMapper.fromCreateLabRequestCommand(command);
    
    // Validate domain entity
    labRequest.validate();
    
    // Persist the lab request and return the saved entity
    const savedLabRequest = await this.labRequestRepository.save(labRequest);
    
    return savedLabRequest;
  }
}
