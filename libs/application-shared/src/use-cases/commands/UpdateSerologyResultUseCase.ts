import { injectable, inject } from 'tsyringe';
import { TOKENS } from '../../di/tokens';
import { ISerologyResultRepository } from '@nx-starter/domain';
import { LaboratoryMapper } from '../../mappers/LaboratoryMapper';
import { UpdateSerologyResultCommand } from '../../dto/LaboratoryDto';
import { SerologyResult, SerologyResultId } from '@nx-starter/domain';

/**
 * Use case for updating an existing serology result record
 * Follows the Single Responsibility Principle and CQRS pattern
 */
@injectable()
export class UpdateSerologyResultUseCase {
  constructor(
    @inject(TOKENS.SerologyResultRepository) private readonly serologyResultRepository: ISerologyResultRepository
  ) {}

  async execute(command: UpdateSerologyResultCommand): Promise<SerologyResult> {
    const serologyResultId = new SerologyResultId(command.id);
    
    // Find existing serology result
    const existingSerologyResult = await this.serologyResultRepository.findById(serologyResultId);
    if (!existingSerologyResult) {
      throw new Error(`Serology result with ID ${command.id} not found`);
    }
    
    // Update the serology result with new data
    const updatedSerologyResult = LaboratoryMapper.updateSerologyResultFromCommand(existingSerologyResult, command);
    
    // Persist the updated serology result record and return the saved entity
    const savedSerologyResult = await this.serologyResultRepository.save(updatedSerologyResult);
    
    return savedSerologyResult;
  }
}
