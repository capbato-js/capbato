import { injectable, inject } from 'tsyringe';
import { Prescription, Medication } from '@nx-starter/domain';
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

    // Handle medications update (new approach)
    if (command.medications && command.medications.length > 0) {
      const newMedications = command.medications.map(medicationData => 
        new Medication(
          existingPrescription.stringId || "PENDING", // Use existing prescription ID
          medicationData.medicationName,
          medicationData.dosage,
          medicationData.instructions,
          medicationData.frequency,
          medicationData.duration,
          medicationData.id
        )
      );
      updatedPrescription = updatedPrescription.updateMedications(newMedications);
    }
    // Handle legacy single medication update
    else if (command.medicationName !== undefined || command.dosage !== undefined || 
             command.instructions !== undefined || command.frequency !== undefined || 
             command.duration !== undefined) {
      
      const currentMedications = updatedPrescription.medications;
      if (currentMedications.length > 0) {
        // Update the first medication for backward compatibility
        const firstMedication = currentMedications[0];
        const updatedMedication = new Medication(
          existingPrescription.stringId || "PENDING", // Use existing prescription ID
          command.medicationName !== undefined ? command.medicationName : firstMedication.medicationNameValue,
          command.dosage !== undefined ? command.dosage : firstMedication.dosageValue,
          command.instructions !== undefined ? command.instructions : firstMedication.instructionsValue,
          command.frequency !== undefined ? command.frequency : firstMedication.frequency,
          command.duration !== undefined ? command.duration : firstMedication.duration,
          firstMedication.stringId
        );
        
        const newMedications = [updatedMedication, ...currentMedications.slice(1)];
        updatedPrescription = updatedPrescription.updateMedications(newMedications);
      }
    }

    if (command.expiryDate !== undefined) {
      const expiryDate = command.expiryDate 
        ? (typeof command.expiryDate === 'string' ? new Date(command.expiryDate) : command.expiryDate)
        : undefined;
      updatedPrescription = updatedPrescription.updateExpiryDate(expiryDate);
    }

    if (command.quantity !== undefined) {
      updatedPrescription = updatedPrescription.updateQuantity(command.quantity);
    }

    if (command.additionalNotes !== undefined) {
      updatedPrescription = updatedPrescription.updateAdditionalNotes(command.additionalNotes);
    }

    if (command.status !== undefined) {
      switch (command.status) {
        case 'active':
          updatedPrescription = updatedPrescription.activate();
          break;
        case 'completed':
          updatedPrescription = updatedPrescription.complete();
          break;
        case 'discontinued':
          updatedPrescription = updatedPrescription.discontinue();
          break;
        case 'on-hold':
          updatedPrescription = updatedPrescription.putOnHold();
          break;
      }
    }

    // Validate business invariants
    updatedPrescription.validate();

    // Persist changes using repository
    await this.prescriptionRepository.update(command.id, updatedPrescription);

    return updatedPrescription;
  }
}