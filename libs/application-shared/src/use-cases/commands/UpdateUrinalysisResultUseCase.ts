import { injectable, inject } from 'tsyringe';
import { TOKENS } from '../../di/tokens';
import { IUrinalysisResultRepository } from '@nx-starter/domain';
import { LaboratoryMapper } from '../../mappers/LaboratoryMapper';
import { UpdateUrinalysisResultCommand } from '../../dto/LaboratoryDto';
import { UrinalysisResult, UrinalysisResultId } from '@nx-starter/domain';

/**
 * Use case for updating an existing urinalysis result record
 * Follows the Single Responsibility Principle and CQRS pattern
 */
@injectable()
export class UpdateUrinalysisResultUseCase {
  constructor(
    @inject(TOKENS.UrinalysisResultRepository) private readonly urinalysisResultRepository: IUrinalysisResultRepository
  ) {}

  async execute(command: UpdateUrinalysisResultCommand): Promise<UrinalysisResult> {
    const urinalysisResultId = new UrinalysisResultId(command.id);
    
    // Find existing urinalysis result
    const existingUrinalysisResult = await this.urinalysisResultRepository.findById(urinalysisResultId);
    if (!existingUrinalysisResult) {
      throw new Error(`Urinalysis result with ID ${command.id} not found`);
    }
    
    // Update the urinalysis result with new data
    const updatedUrinalysisResult = LaboratoryMapper.updateUrinalysisResultFromCommand(existingUrinalysisResult, command);
    
    // Validate updated entity
    updatedUrinalysisResult.validate();
    
    // Persist the updated urinalysis result record and return the saved entity
    const savedUrinalysisResult = await this.urinalysisResultRepository.save(updatedUrinalysisResult);
    
    return savedUrinalysisResult;
  }
}
