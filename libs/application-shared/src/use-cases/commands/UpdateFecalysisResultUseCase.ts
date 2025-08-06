import { injectable, inject } from 'tsyringe';
import { TOKENS } from '../../di/tokens';
import { IFecalysisResultRepository } from '@nx-starter/domain';
import { LaboratoryMapper } from '../../mappers/LaboratoryMapper';
import { UpdateFecalysisResultCommand } from '../../dto/LaboratoryDto';
import { FecalysisResult, FecalysisResultId } from '@nx-starter/domain';

/**
 * Use case for updating an existing fecalysis result record
 * Follows the Single Responsibility Principle and CQRS pattern
 */
@injectable()
export class UpdateFecalysisResultUseCase {
  constructor(
    @inject(TOKENS.FecalysisResultRepository) private readonly fecalysisResultRepository: IFecalysisResultRepository
  ) {}

  async execute(command: UpdateFecalysisResultCommand): Promise<FecalysisResult> {
    const fecalysisResultId = new FecalysisResultId(command.id);
    
    // Find existing fecalysis result
    const existingFecalysisResult = await this.fecalysisResultRepository.findById(fecalysisResultId);
    if (!existingFecalysisResult) {
      throw new Error(`Fecalysis result with ID ${command.id} not found`);
    }
    
    // Update the fecalysis result with new data
    const updatedFecalysisResult = LaboratoryMapper.updateFecalysisResultFromCommand(existingFecalysisResult, command);
    
    // Persist the updated fecalysis result record and return the saved entity
    const savedFecalysisResult = await this.fecalysisResultRepository.save(updatedFecalysisResult);
    
    return savedFecalysisResult;
  }
}
