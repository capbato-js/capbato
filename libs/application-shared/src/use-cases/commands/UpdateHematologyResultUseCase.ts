import { injectable, inject } from 'tsyringe';
import { TOKENS } from '../../di/tokens';
import { IHematologyResultRepository } from '@nx-starter/domain';
import { LaboratoryMapper } from '../../mappers/LaboratoryMapper';
import { UpdateHematologyResultCommand } from '../../dto/LaboratoryDto';
import { HematologyResult, HematologyResultId } from '@nx-starter/domain';

/**
 * Use case for updating an existing hematology result record
 * Follows the Single Responsibility Principle and CQRS pattern
 */
@injectable()
export class UpdateHematologyResultUseCase {
  constructor(
    @inject(TOKENS.HematologyResultRepository) private readonly hematologyResultRepository: IHematologyResultRepository
  ) {}

  async execute(command: UpdateHematologyResultCommand): Promise<HematologyResult> {
    const hematologyResultId = new HematologyResultId(command.id);
    
    // Find existing hematology result
    const existingHematologyResult = await this.hematologyResultRepository.findById(hematologyResultId);
    if (!existingHematologyResult) {
      throw new Error(`Hematology result with ID ${command.id} not found`);
    }
    
    // Update the hematology result with new data
    const updatedHematologyResult = LaboratoryMapper.updateHematologyResultFromCommand(existingHematologyResult, command);
    
    // Persist the updated hematology result record and return the saved entity
    const savedHematologyResult = await this.hematologyResultRepository.save(updatedHematologyResult);
    
    return savedHematologyResult;
  }
}
