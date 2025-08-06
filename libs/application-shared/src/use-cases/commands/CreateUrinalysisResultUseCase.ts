import { injectable, inject } from 'tsyringe';
import { TOKENS } from '../../di/tokens';
import { IUrinalysisResultRepository } from '@nx-starter/domain';
import { LaboratoryMapper } from '../../mappers/LaboratoryMapper';
import { CreateUrinalysisResultCommand } from '../../dto/LaboratoryDto';
import { UrinalysisResult } from '@nx-starter/domain';

/**
 * Use case for creating a new urinalysis result record
 * Follows the Single Responsibility Principle and CQRS pattern
 */
@injectable()
export class CreateUrinalysisResultUseCase {
  constructor(
    @inject(TOKENS.UrinalysisResultRepository) private readonly urinalysisResultRepository: IUrinalysisResultRepository
  ) {}

  async execute(command: CreateUrinalysisResultCommand): Promise<UrinalysisResult> {
    // Convert command to domain entity
    const urinalysisResult = LaboratoryMapper.fromCreateUrinalysisResultCommand(command);
    
    // Persist the urinalysis result record and return the saved entity
    const savedUrinalysisResult = await this.urinalysisResultRepository.save(urinalysisResult);
    
    return savedUrinalysisResult;
  }
}
