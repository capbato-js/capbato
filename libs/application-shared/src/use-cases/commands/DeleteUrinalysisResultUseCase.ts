import { injectable, inject } from 'tsyringe';
import { TOKENS } from '../../di/tokens';
import { IUrinalysisResultRepository } from '@nx-starter/domain';
import { DeleteUrinalysisResultCommand } from '../../dto/LaboratoryDto';
import { UrinalysisResultId } from '@nx-starter/domain';

/**
 * Use case for deleting an urinalysis result record
 * Follows the Single Responsibility Principle and CQRS pattern
 */
@injectable()
export class DeleteUrinalysisResultUseCase {
  constructor(
    @inject(TOKENS.UrinalysisResultRepository) private readonly urinalysisResultRepository: IUrinalysisResultRepository
  ) {}

  async execute(command: DeleteUrinalysisResultCommand): Promise<void> {
    const urinalysisResultId = new UrinalysisResultId(command.id);
    
    // Check if urinalysis result exists
    const existingUrinalysisResult = await this.urinalysisResultRepository.findById(urinalysisResultId);
    if (!existingUrinalysisResult) {
      throw new Error(`Urinalysis result with ID ${command.id} not found`);
    }
    
    // Delete the urinalysis result record
    await this.urinalysisResultRepository.delete(urinalysisResultId);
  }
}
