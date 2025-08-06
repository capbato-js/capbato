import { injectable, inject } from 'tsyringe';
import { IPrescriptionCommandService } from '../interfaces/IPrescriptionService';
import { Prescription } from '@nx-starter/domain';
import { CreatePrescriptionCommand, UpdatePrescriptionCommand } from '../validation/PrescriptionValidationSchemas';
import { CreatePrescriptionUseCase } from '../use-cases/commands/CreatePrescriptionUseCase';
import { UpdatePrescriptionUseCase } from '../use-cases/commands/UpdatePrescriptionUseCase';
import { DeletePrescriptionUseCase } from '../use-cases/commands/DeletePrescriptionUseCase';
import { TOKENS } from '../di/tokens';

/**
 * Prescription Command Service implementation following CQRS pattern
 * Orchestrates write operations through use cases
 */
@injectable()
export class PrescriptionCommandService implements IPrescriptionCommandService {
  constructor(
    @inject(TOKENS.CreatePrescriptionUseCase)
    private readonly createPrescriptionUseCase: CreatePrescriptionUseCase,
    @inject(TOKENS.UpdatePrescriptionUseCase)
    private readonly updatePrescriptionUseCase: UpdatePrescriptionUseCase,
    @inject(TOKENS.DeletePrescriptionUseCase)
    private readonly deletePrescriptionUseCase: DeletePrescriptionUseCase
  ) {}

  async createPrescription(command: CreatePrescriptionCommand): Promise<Prescription> {
    return await this.createPrescriptionUseCase.execute(command);
  }

  async updatePrescription(id: string, command: UpdatePrescriptionCommand): Promise<Prescription> {
    const updateCommand = { ...command, id };
    return await this.updatePrescriptionUseCase.execute(updateCommand);
  }

  async deletePrescription(id: string): Promise<void> {
    await this.deletePrescriptionUseCase.execute({ id });
  }
}