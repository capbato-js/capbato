import { injectable, inject } from 'tsyringe';
import { TOKENS } from '../../di/tokens';
import { IFecalysisResultRepository } from '@nx-starter/domain';
import { DeleteFecalysisResultCommand } from '../../dto/LaboratoryDto';
import { FecalysisResultId } from '@nx-starter/domain';

/**
 * Use case for deleting a fecalysis result record
 * Follows the Single Responsibility Principle and CQRS pattern
 */
@injectable()
export class DeleteFecalysisResultUseCase {
  constructor(
    @inject(TOKENS.FecalysisResultRepository) private readonly fecalysisResultRepository: IFecalysisResultRepository
  ) {}

  async execute(command: DeleteFecalysisResultCommand): Promise<void> {
    const fecalysisResultId = new FecalysisResultId(command.id);
    
    // Check if fecalysis result exists
    const existingFecalysisResult = await this.fecalysisResultRepository.findById(fecalysisResultId);
    if (!existingFecalysisResult) {
      throw new Error(`Fecalysis result with ID ${command.id} not found`);
    }
    
    // Delete the fecalysis result record
    await this.fecalysisResultRepository.delete(fecalysisResultId);
  }
}
