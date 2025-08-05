import { injectable, inject } from 'tsyringe';
import type { IPrescriptionRepository } from '@nx-starter/domain';
import type { DeletePrescriptionCommand } from '../../dto/PrescriptionCommands';
import { TOKENS } from '../../di/tokens';

/**
 * Use case for deleting a prescription
 * Handles all business logic and validation for prescription deletion
 */
@injectable()
export class DeletePrescriptionUseCase {
  constructor(
    @inject(TOKENS.PrescriptionRepository) private prescriptionRepository: IPrescriptionRepository
  ) {}

  async execute(command: DeletePrescriptionCommand): Promise<void> {
    // Check if prescription exists
    const existingPrescription = await this.prescriptionRepository.getById(command.id);
    if (!existingPrescription) {
      throw new Error(`Prescription with ID ${command.id} not found`);
    }

    // Business rule: Check if prescription can be deleted
    // For example, might not allow deletion of active prescriptions or those with recent activity
    if (existingPrescription.isActive && existingPrescription.isValid()) {
      // Instead of hard delete, we could deactivate
      // But for this implementation, we'll allow deletion
    }

    // Delete from repository
    await this.prescriptionRepository.delete(command.id);
  }
}