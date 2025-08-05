import { PrescriptionId } from '../value-objects/PrescriptionId';
import { MedicationName } from '../value-objects/MedicationName';
import { Dosage } from '../value-objects/Dosage';
import { Instructions } from '../value-objects/Instructions';
import { 
  PrescriptionExpiredException,
  InvalidPrescriptionDateException 
} from '../exceptions/DomainExceptions';

interface IPrescription {
  id?: PrescriptionId;
  patientId: string; // Foreign key to Patient entity
  doctorId: string; // Foreign key to Doctor entity
  medicationName: MedicationName;
  dosage: Dosage;
  instructions: Instructions;
  prescribedDate: Date;
  expiryDate?: Date;
  isActive: boolean;
  createdAt: Date;
}

/**
 * Prescription Entity - Medical Prescription for Patients
 * 
 * This entity represents a medical prescription linking patients, doctors, 
 * and medication information with proper business rules.
 * 
 * Responsibilities:
 * - Store prescription details (medication, dosage, instructions)
 * - Link to Patient and Doctor entities
 * - Handle prescription validity and expiry
 * - Maintain prescription status and history
 */
export class Prescription implements IPrescription {
  private readonly _id?: PrescriptionId;
  private readonly _patientId: string;
  private readonly _doctorId: string;
  private readonly _medicationName: MedicationName;
  private readonly _dosage: Dosage;
  private readonly _instructions: Instructions;
  private readonly _prescribedDate: Date;
  private readonly _expiryDate?: Date;
  private readonly _isActive: boolean;
  private readonly _createdAt: Date;

  constructor(
    patientId: string,
    doctorId: string,
    medicationName: string | MedicationName,
    dosage: string | Dosage,
    instructions: string | Instructions,
    prescribedDate: Date = new Date(),
    id?: string | PrescriptionId,
    expiryDate?: Date,
    isActive = true,
    createdAt = new Date()
  ) {
    this.validateRequiredFields(patientId, doctorId);
    this.validateDates(prescribedDate, expiryDate);
    
    this._patientId = patientId.trim();
    this._doctorId = doctorId.trim();
    this._medicationName = medicationName instanceof MedicationName ? medicationName : new MedicationName(medicationName);
    this._dosage = dosage instanceof Dosage ? dosage : new Dosage(dosage);
    this._instructions = instructions instanceof Instructions ? instructions : new Instructions(instructions);
    this._prescribedDate = prescribedDate;
    this._expiryDate = expiryDate;
    this._isActive = isActive;
    this._createdAt = createdAt;
    this._id = id instanceof PrescriptionId ? id : id ? new PrescriptionId(id) : undefined;
  }

  get id(): PrescriptionId | undefined {
    return this._id;
  }

  get patientId(): string {
    return this._patientId;
  }

  get doctorId(): string {
    return this._doctorId;
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

  get prescribedDate(): Date {
    return this._prescribedDate;
  }

  get expiryDate(): Date | undefined {
    return this._expiryDate;
  }

  get isActive(): boolean {
    return this._isActive;
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
  updateMedication(medicationName: string | MedicationName): Prescription {
    const medication = medicationName instanceof MedicationName ? medicationName : new MedicationName(medicationName);
    return this.createCopy({ medicationName: medication });
  }

  updateDosage(dosage: string | Dosage): Prescription {
    const newDosage = dosage instanceof Dosage ? dosage : new Dosage(dosage);
    return this.createCopy({ dosage: newDosage });
  }

  updateInstructions(instructions: string | Instructions): Prescription {
    const newInstructions = instructions instanceof Instructions ? instructions : new Instructions(instructions);
    return this.createCopy({ instructions: newInstructions });
  }

  updateExpiryDate(expiryDate?: Date): Prescription {
    this.validateDates(this._prescribedDate, expiryDate);
    return this.createCopy({ expiryDate });
  }

  activate(): Prescription {
    return this.createCopy({ isActive: true });
  }

  deactivate(): Prescription {
    return this.createCopy({ isActive: false });
  }

  /**
   * Creates a copy of this prescription with modified properties
   * Immutable entity pattern - all changes create new instances
   */
  private createCopy(updates: {
    medicationName?: MedicationName;
    dosage?: Dosage;
    instructions?: Instructions;
    expiryDate?: Date;
    isActive?: boolean;
  }): Prescription {
    return new Prescription(
      this._patientId,
      this._doctorId,
      updates.medicationName || this._medicationName,
      updates.dosage || this._dosage,
      updates.instructions || this._instructions,
      this._prescribedDate,
      this._id,
      updates.expiryDate !== undefined ? updates.expiryDate : this._expiryDate,
      updates.isActive !== undefined ? updates.isActive : this._isActive,
      this._createdAt
    );
  }

  /**
   * Checks if the prescription is expired
   */
  isExpired(): boolean {
    if (!this._expiryDate) {
      return false; // No expiry date means it doesn't expire
    }
    return new Date() > this._expiryDate;
  }

  /**
   * Checks if the prescription is currently valid
   */
  isValid(): boolean {
    return this._isActive && !this.isExpired();
  }

  /**
   * Validates business rules before operations
   */
  canBeModified(): boolean {
    if (this.isExpired()) {
      throw new PrescriptionExpiredException();
    }
    return true;
  }

  /**
   * Domain equality comparison based on business identity
   */
  equals(other: Prescription): boolean {
    if (!this._id || !other._id) {
      return false;
    }
    return this._id.equals(other._id);
  }

  /**
   * Validates business invariants
   */
  validate(): void {
    if (!this._patientId || this._patientId.trim().length === 0) {
      throw new Error('Prescription must be linked to a valid patient');
    }

    if (!this._doctorId || this._doctorId.trim().length === 0) {
      throw new Error('Prescription must be linked to a valid doctor');
    }

    this.validateDates(this._prescribedDate, this._expiryDate);
  }

  private validateRequiredFields(patientId: string, doctorId: string): void {
    if (!patientId || patientId.trim().length === 0) {
      throw new Error('Patient ID is required for Prescription entity');
    }

    if (!doctorId || doctorId.trim().length === 0) {
      throw new Error('Doctor ID is required for Prescription entity');
    }
  }

  private validateDates(prescribedDate: Date, expiryDate?: Date): void {
    if (!prescribedDate) {
      throw new InvalidPrescriptionDateException('prescribed date is required');
    }

    if (expiryDate && expiryDate <= prescribedDate) {
      throw new InvalidPrescriptionDateException('expiry date must be after prescribed date');
    }
  }
}

export type { IPrescription };