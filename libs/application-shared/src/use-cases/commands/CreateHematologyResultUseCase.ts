import { injectable, inject } from 'tsyringe';
import { TOKENS } from '../../di/tokens';
import { IHematologyResultRepository } from '@nx-starter/domain';
import { LaboratoryMapper } from '../../mappers/LaboratoryMapper';
import { CreateHematologyResultCommand } from '../../dto/LaboratoryDto';
import { HematologyResult } from '@nx-starter/domain';

/**
 * Use case for creating a new hematology result record
 * Follows the Single Responsibility Principle and CQRS pattern
 */
@injectable()
export class CreateHematologyResultUseCase {
  constructor(
    @inject(TOKENS.HematologyResultRepository) private readonly hematologyResultRepository: IHematologyResultRepository
  ) {}

  async execute(command: CreateHematologyResultCommand): Promise<HematologyResult> {
    // Convert command to domain entity
    const hematologyResult = LaboratoryMapper.fromCreateHematologyResultCommand(command);
    
    // Persist the hematology result record and return the saved entity
    const savedHematologyResult = await this.hematologyResultRepository.save(hematologyResult);
    
    return savedHematologyResult;
  }
}
