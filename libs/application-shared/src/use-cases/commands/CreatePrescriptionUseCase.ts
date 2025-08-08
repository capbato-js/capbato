import { injectable, inject } from 'tsyringe';
import { Prescription, Medication } from '@nx-starter/domain';
import type { IPrescriptionRepository } from '@nx-starter/domain';
import type { CreatePrescriptionCommand } from '../../dto/PrescriptionCommands';
import { TOKENS } from '../../di/tokens';

/**
 * Use case for creating a new prescription
 * Handles all business logic and validation for prescription creation
 */
@injectable()
export class CreatePrescriptionUseCase {
  constructor(
    @inject(TOKENS.PrescriptionRepository) private prescriptionRepository: IPrescriptionRepository
  ) {}

  async execute(command: CreatePrescriptionCommand): Promise<Prescription> {
    // Handle both new medications array and legacy single medication fields
    let medications: Medication[] = [];

    if (command.medications && command.medications.length > 0) {
      // New multiple medications approach
      medications = command.medications.map(medicationData => 
        new Medication(
          "PENDING", // Temporary prescriptionId - will be set during persistence
          medicationData.medicationName,
          medicationData.dosage,
          medicationData.instructions || "",
          medicationData.frequency,
          medicationData.duration
        )
      );
    } else if (command.medicationName && command.dosage && command.instructions && command.frequency && command.duration) {
      // Legacy single medication approach
      medications = [new Medication(
        "PENDING", // Temporary prescriptionId - will be set during persistence
        command.medicationName,
        command.dosage,
        command.instructions,
        command.frequency,
        command.duration
      )];
    } else {
      throw new Error('Either medications array or legacy medication fields must be provided');
    }

    // Create prescription entity with domain logic
    const prescribedDate = command.prescribedDate 
      ? (typeof command.prescribedDate === 'string' ? new Date(command.prescribedDate) : command.prescribedDate)
      : new Date();
    
    const expiryDate = command.expiryDate 
      ? (typeof command.expiryDate === 'string' ? new Date(command.expiryDate) : command.expiryDate)
      : undefined;

    const prescription = new Prescription(
      command.patientId,
      command.doctorId,
      medications,
      prescribedDate,
      undefined, // no ID yet
      expiryDate,
      command.quantity,
      command.additionalNotes,
      command.status || 'active',
      new Date() // createdAt
    );

    // Validate business invariants
    prescription.validate();

    // Persist using repository
    const id = await this.prescriptionRepository.create(prescription);

    // Return the created prescription with ID
    return new Prescription(
      prescription.patientId,
      prescription.doctorId,
      medications,
      prescription.prescribedDate,
      id,
      prescription.expiryDate,
      prescription.quantity,
      prescription.additionalNotes,
      prescription.status,
      prescription.createdAt
    );
  }
}