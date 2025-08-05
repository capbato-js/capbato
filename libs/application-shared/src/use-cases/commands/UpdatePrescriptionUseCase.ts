import { injectable, inject } from 'tsyringe';
import { Prescription, MedicationName, Dosage, Instructions } from '@nx-starter/domain';
import type { IPrescriptionRepository } from '@nx-starter/domain';
import type { UpdatePrescriptionCommand } from '../../dto/PrescriptionCommands';
import { TOKENS } from '../../di/tokens';

/**
 * Use case for updating an existing prescription
 * Handles all business logic and validation for prescription updates
 */
@injectable()
export class UpdatePrescriptionUseCase {
  constructor(
    @inject(TOKENS.PrescriptionRepository) private prescriptionRepository: IPrescriptionRepository
  ) {}

  async execute(command: UpdatePrescriptionCommand): Promise<Prescription> {
    // Get existing prescription
    const existingPrescription = await this.prescriptionRepository.getById(command.id);
    if (!existingPrescription) {
      throw new Error(`Prescription with ID ${command.id} not found`);
    }

    // Check if prescription can be modified
    existingPrescription.canBeModified();

    // Create updated prescription with new values
    let updatedPrescription = existingPrescription;

    if (command.medicationName !== undefined) {
      updatedPrescription = updatedPrescription.updateMedication(command.medicationName);
    }

    if (command.dosage !== undefined) {
      updatedPrescription = updatedPrescription.updateDosage(command.dosage);
    }

    if (command.instructions !== undefined) {
      updatedPrescription = updatedPrescription.updateInstructions(command.instructions);
    }

    if (command.expiryDate !== undefined) {
      const expiryDate = command.expiryDate 
        ? (typeof command.expiryDate === 'string' ? new Date(command.expiryDate) : command.expiryDate)
        : undefined;
      updatedPrescription = updatedPrescription.updateExpiryDate(expiryDate);
    }

    if (command.isActive !== undefined) {
      updatedPrescription = command.isActive ? updatedPrescription.activate() : updatedPrescription.deactivate();
    }

    // Validate business invariants
    updatedPrescription.validate();

    // Persist changes using repository
    await this.prescriptionRepository.update(command.id, updatedPrescription);

    return updatedPrescription;
  }
}