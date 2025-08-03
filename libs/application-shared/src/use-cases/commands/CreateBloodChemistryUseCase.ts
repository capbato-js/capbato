import { injectable, inject } from 'tsyringe';
import { TOKENS } from '../../di/tokens';
import { IBloodChemistryRepository } from '@nx-starter/domain';
import { LaboratoryMapper } from '../../mappers/LaboratoryMapper';
import { CreateBloodChemistryCommand } from '../../dto/LaboratoryDto';
import { BloodChemistry } from '@nx-starter/domain';

/**
 * Use case for creating a new blood chemistry record
 * Follows the Single Responsibility Principle and CQRS pattern
 */
@injectable()
export class CreateBloodChemistryUseCase {
  constructor(
    @inject(TOKENS.BloodChemistryRepository) private readonly bloodChemistryRepository: IBloodChemistryRepository
  ) {}

  async execute(command: CreateBloodChemistryCommand): Promise<BloodChemistry> {
    // Convert command to domain entity
    const bloodChemistry = LaboratoryMapper.fromCreateBloodChemistryCommand(command);
    
    // Validate domain entity
    bloodChemistry.validate();
    
    // Persist the blood chemistry record and return the saved entity
    const savedBloodChemistry = await this.bloodChemistryRepository.save(bloodChemistry);
    
    return savedBloodChemistry;
  }
}
