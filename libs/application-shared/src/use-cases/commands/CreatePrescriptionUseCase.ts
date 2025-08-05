import { injectable, inject } from 'tsyringe';
import { Prescription, MedicationName, Dosage, Instructions } from '@nx-starter/domain';
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
    // Validate command using value objects (domain validation)
    const medicationName = new MedicationName(command.medicationName);
    const dosage = new Dosage(command.dosage);
    const instructions = new Instructions(command.instructions);

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
      medicationName,
      dosage,
      instructions,
      prescribedDate,
      undefined, // no ID yet
      expiryDate,
      command.isActive !== undefined ? command.isActive : true,
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
      medicationName,
      dosage,
      instructions,
      prescription.prescribedDate,
      id,
      prescription.expiryDate,
      prescription.isActive,
      prescription.createdAt
    );
  }
}