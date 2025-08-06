import { MedicationId } from '../value-objects/MedicationId';
import { MedicationName } from '../value-objects/MedicationName';
import { Dosage } from '../value-objects/Dosage';
import { Instructions } from '../value-objects/Instructions';

interface IMedication {
  id?: MedicationId;
  prescriptionId: string;
  medicationName: MedicationName;
  dosage: Dosage;
  instructions: Instructions;
  frequency: string;
  duration: string;
  createdAt: Date;
}

/**
 * Medication Entity - Individual medication within a prescription
 * 
 * This entity represents a single medication that is part of a prescription.
 * Multiple medications can be associated with a single prescription.
 * 
 * Responsibilities:
 * - Store individual medication details (name, dosage, instructions)
 * - Link to parent Prescription entity
 * - Maintain medication-specific validation rules
 */
export class Medication implements IMedication {
  private readonly _id?: MedicationId;
  private readonly _prescriptionId: string;
  private readonly _medicationName: MedicationName;
  private readonly _dosage: Dosage;
  private readonly _instructions: Instructions;
  private readonly _frequency: string;
  private readonly _duration: string;
  private readonly _createdAt: Date;

  constructor(
    prescriptionId: string,
    medicationName: string | MedicationName,
    dosage: string | Dosage,
    instructions: string | Instructions,
    frequency: string,
    duration: string,
    id?: string | MedicationId,
    createdAt = new Date()
  ) {
    this.validateRequiredFields(prescriptionId, frequency, duration);
    
    this._prescriptionId = prescriptionId.trim();
    this._medicationName = medicationName instanceof MedicationName ? medicationName : new MedicationName(medicationName);
    this._dosage = dosage instanceof Dosage ? dosage : new Dosage(dosage);
    this._instructions = instructions instanceof Instructions ? instructions : new Instructions(instructions);
    this._frequency = frequency.trim();
    this._duration = duration.trim();
    this._createdAt = createdAt;
    this._id = id instanceof MedicationId ? id : id ? new MedicationId(id) : undefined;
  }

  // Getters
  get id(): MedicationId | undefined {
    return this._id;
  }

  get prescriptionId(): string {
    return this._prescriptionId;
  }

  get medicationName(): MedicationName {
    return this._medicationName;
  }

  get dosage(): Dosage {
    return this._dosage;
  }

  get instructions(): Instructions {
    return this._instructions;
  }

  get frequency(): string {
    return this._frequency;
  }

  get duration(): string {
    return this._duration;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  // For backwards compatibility with existing code that expects string ID
  get stringId(): string | undefined {
    return this._id?.value;
  }

  get medicationNameValue(): string {
    return this._medicationName.value;
  }

  get dosageValue(): string {
    return this._dosage.value;
  }

  get instructionsValue(): string {
    return this._instructions.value;
  }

  // Domain business logic methods
  updateMedication(medicationName: string | MedicationName): Medication {
    const medication = medicationName instanceof MedicationName ? medicationName : new MedicationName(medicationName);
    return this.createCopy({ medicationName: medication });
  }

  updateDosage(dosage: string | Dosage): Medication {
    const newDosage = dosage instanceof Dosage ? dosage : new Dosage(dosage);
    return this.createCopy({ dosage: newDosage });
  }

  updateInstructions(instructions: string | Instructions): Medication {
    const newInstructions = instructions instanceof Instructions ? instructions : new Instructions(instructions);
    return this.createCopy({ instructions: newInstructions });
  }

  /**
   * Creates a copy of this medication with modified properties
   * Immutable entity pattern - all changes create new instances
   */
  private createCopy(updates: {
    medicationName?: MedicationName;
    dosage?: Dosage;
    instructions?: Instructions;
    frequency?: string;
    duration?: string;
  }): Medication {
    return new Medication(
      this._prescriptionId,
      updates.medicationName || this._medicationName,
      updates.dosage || this._dosage,
      updates.instructions || this._instructions,
      updates.frequency || this._frequency,
      updates.duration || this._duration,
      this._id,
      this._createdAt
    );
  }

  /**
   * Domain equality comparison based on business identity
   */
  equals(other: Medication): boolean {
    if (!this._id || !other._id) {
      return false;
    }
    return this._id.equals(other._id);
  }

  /**
   * Validates business invariants
   */
  validate(): void {
    if (!this._prescriptionId || this._prescriptionId.trim().length === 0) {
      throw new Error('Medication must be linked to a valid prescription');
    }
  }

  private validateRequiredFields(prescriptionId: string, frequency: string, duration: string): void {
    if (!prescriptionId || prescriptionId.trim().length === 0) {
      throw new Error('Prescription ID is required for Medication entity');
    }

    if (!frequency || frequency.trim().length === 0) {
      throw new Error('Frequency is required for Medication entity');
    }

    if (!duration || duration.trim().length === 0) {
      throw new Error('Duration is required for Medication entity');
    }
  }
}

export type { IMedication };
