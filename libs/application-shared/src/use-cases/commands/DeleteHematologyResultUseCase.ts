import { injectable, inject } from 'tsyringe';
import { TOKENS } from '../../di/tokens';
import { IHematologyResultRepository } from '@nx-starter/domain';
import { DeleteHematologyResultCommand } from '../../dto/LaboratoryDto';
import { HematologyResultId } from '@nx-starter/domain';

/**
 * Use case for deleting a hematology result record
 * Follows the Single Responsibility Principle and CQRS pattern
 */
@injectable()
export class DeleteHematologyResultUseCase {
  constructor(
    @inject(TOKENS.HematologyResultRepository) private readonly hematologyResultRepository: IHematologyResultRepository
  ) {}

  async execute(command: DeleteHematologyResultCommand): Promise<void> {
    const hematologyResultId = new HematologyResultId(command.id);
    
    // Check if hematology result exists
    const existingHematologyResult = await this.hematologyResultRepository.findById(hematologyResultId);
    if (!existingHematologyResult) {
      throw new Error(`Hematology result with ID ${command.id} not found`);
    }
    
    // Delete the hematology result record
    await this.hematologyResultRepository.delete(hematologyResultId);
  }
}
