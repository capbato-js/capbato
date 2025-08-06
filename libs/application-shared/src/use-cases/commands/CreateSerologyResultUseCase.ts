import { injectable, inject } from 'tsyringe';
import { TOKENS } from '../../di/tokens';
import { ISerologyResultRepository } from '@nx-starter/domain';
import { LaboratoryMapper } from '../../mappers/LaboratoryMapper';
import { CreateSerologyResultCommand } from '../../dto/LaboratoryDto';
import { SerologyResult } from '@nx-starter/domain';

/**
 * Use case for creating a new serology result record
 * Follows the Single Responsibility Principle and CQRS pattern
 */
@injectable()
export class CreateSerologyResultUseCase {
  constructor(
    @inject(TOKENS.SerologyResultRepository) private readonly serologyResultRepository: ISerologyResultRepository
  ) {}

  async execute(command: CreateSerologyResultCommand): Promise<SerologyResult> {
    // Convert command to domain entity
    const serologyResult = LaboratoryMapper.fromCreateSerologyResultCommand(command);
    
    // Persist the serology result record and return the saved entity
    const savedSerologyResult = await this.serologyResultRepository.save(serologyResult);
    
    return savedSerologyResult;
  }
}
