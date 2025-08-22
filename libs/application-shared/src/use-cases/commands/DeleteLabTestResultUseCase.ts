import { injectable, inject } from 'tsyringe';
import { TOKENS } from '../../di/tokens';
import { ILabTestResultRepository, LabTestResultNotFoundException } from '@nx-starter/domain';
import { DeleteLabTestResultCommand } from '../../dto/LaboratoryDto';

/**
 * Use case for deleting a lab test result record
 * Follows the Single Responsibility Principle and CQRS pattern
 */
@injectable()
export class DeleteLabTestResultUseCase {
  constructor(
    @inject(TOKENS.LabTestResultRepository) private readonly labTestResultRepository: ILabTestResultRepository
  ) {}

  async execute(command: DeleteLabTestResultCommand): Promise<void> {
    // Check if lab test result exists
    const existingLabTestResult = await this.labTestResultRepository.getById(command.id);
    if (!existingLabTestResult) {
      throw new LabTestResultNotFoundException(command.id);
    }
    
    // Delete the lab test result record
    await this.labTestResultRepository.delete(command.id);
  }
}
