import { injectable, inject } from 'tsyringe';
import { TOKENS } from '../../di/tokens';
import { ISerologyResultRepository } from '@nx-starter/domain';
import { DeleteSerologyResultCommand } from '../../dto/LaboratoryDto';
import { SerologyResultId } from '@nx-starter/domain';

/**
 * Use case for deleting a serology result record
 * Follows the Single Responsibility Principle and CQRS pattern
 */
@injectable()
export class DeleteSerologyResultUseCase {
  constructor(
    @inject(TOKENS.SerologyResultRepository) private readonly serologyResultRepository: ISerologyResultRepository
  ) {}

  async execute(command: DeleteSerologyResultCommand): Promise<void> {
    const serologyResultId = new SerologyResultId(command.id);
    
    // Check if serology result exists
    const existingSerologyResult = await this.serologyResultRepository.findById(serologyResultId);
    if (!existingSerologyResult) {
      throw new Error(`Serology result with ID ${command.id} not found`);
    }
    
    // Delete the serology result record
    await this.serologyResultRepository.delete(serologyResultId);
  }
}
