import { injectable, inject } from 'tsyringe';
import { TOKENS } from '../../di/tokens';
import { IFecalysisResultRepository } from '@nx-starter/domain';
import { LaboratoryMapper } from '../../mappers/LaboratoryMapper';
import { CreateFecalysisResultCommand } from '../../dto/LaboratoryDto';
import { FecalysisResult } from '@nx-starter/domain';

/**
 * Use case for creating a new fecalysis result record
 * Follows the Single Responsibility Principle and CQRS pattern
 */
@injectable()
export class CreateFecalysisResultUseCase {
  constructor(
    @inject(TOKENS.FecalysisResultRepository) private readonly fecalysisResultRepository: IFecalysisResultRepository
  ) {}

  async execute(command: CreateFecalysisResultCommand): Promise<FecalysisResult> {
    // Convert command to domain entity
    const fecalysisResult = LaboratoryMapper.fromCreateFecalysisResultCommand(command);
    
    // Persist the fecalysis result record and return the saved entity
    const savedFecalysisResult = await this.fecalysisResultRepository.save(fecalysisResult);
    
    return savedFecalysisResult;
  }
}
