import { PrescriptionId } from '../value-objects/PrescriptionId';
import { Medication } from './Medication';
import { 
  PrescriptionExpiredException,
  InvalidPrescriptionDateException 
} from '../exceptions/DomainExceptions';

interface IPrescription {
  id?: PrescriptionId;
  patientId: string; // Foreign key to Patient entity
  doctorId: string; // Foreign key to Doctor entity
  medications: Medication[];
  prescribedDate: Date;
  expiryDate?: Date;
  quantity?: string;
  additionalNotes?: string;
  status: 'active' | 'completed' | 'discontinued' | 'on-hold';
  createdAt: Date;
}

/**
 * Prescription Entity - Medical Prescription for Patients
 * 
 * This entity represents a medical prescription linking patients, doctors, 
 * and multiple medications with proper business rules.
 * 
 * Responsibilities:
 * - Store prescription details (patient, doctor, date)
 * - Manage multiple medications in a single prescription
 * - Handle prescription validity and expiry
 * - Maintain prescription status and history
 */
export class Prescription implements IPrescription {
  private readonly _id?: PrescriptionId;
  private readonly _patientId: string;
  private readonly _doctorId: string;
  private readonly _medications: Medication[];
  private readonly _prescribedDate: Date;
  private readonly _expiryDate?: Date;
  private readonly _quantity?: string;
  private readonly _additionalNotes?: string;
  private readonly _status: 'active' | 'completed' | 'discontinued' | 'on-hold';
  private readonly _createdAt: Date;

  constructor(
    patientId: string,
    doctorId: string,
    medications: Medication[] = [],
    prescribedDate: Date = new Date(),
    id?: string | PrescriptionId,
    expiryDate?: Date,
    quantity?: string,
    additionalNotes?: string,
    status: 'active' | 'completed' | 'discontinued' | 'on-hold' = 'active',
    createdAt = new Date()
  ) {
    this.validateRequiredFields(patientId, doctorId);
    this.validateDates(prescribedDate, expiryDate);
    
    this._patientId = patientId.trim();
    this._doctorId = doctorId.trim();
    this._medications = medications;
    this._prescribedDate = prescribedDate;
    this._expiryDate = expiryDate;
    this._quantity = quantity?.trim();
    this._additionalNotes = additionalNotes?.trim();
    this._status = status;
    this._createdAt = createdAt;
    this._id = id instanceof PrescriptionId ? id : id ? new PrescriptionId(id) : undefined;
  }

  // Getters
  get id(): PrescriptionId | undefined {
    return this._id;
  }

  get patientId(): string {
    return this._patientId;
  }

  get doctorId(): string {
    return this._doctorId;
  }

  get medications(): Medication[] {
    return this._medications;
  }

  get prescribedDate(): Date {
    return this._prescribedDate;
  }

  get expiryDate(): Date | undefined {
    return this._expiryDate;
  }

  get quantity(): string | undefined {
    return this._quantity;
  }

  get additionalNotes(): string | undefined {
    return this._additionalNotes;
  }

  get status(): 'active' | 'completed' | 'discontinued' | 'on-hold' {
    return this._status;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  // For backwards compatibility with existing code that expects string ID
  get stringId(): string | undefined {
    return this._id?.value;
  }

  // Compatibility methods for legacy single-medication prescriptions
  get medicationNameValue(): string {
    return this._medications.length > 0 ? this._medications[0].medicationNameValue : '';
  }

  get dosageValue(): string {
    return this._medications.length > 0 ? this._medications[0].dosageValue : '';
  }

  get instructionsValue(): string {
    return this._medications.length > 0 ? this._medications[0].instructionsValue : '';
  }

  get frequency(): string {
    return this._medications.length > 0 ? this._medications[0].frequency : '';
  }

  get duration(): string {
    return this._medications.length > 0 ? this._medications[0].duration : '';
  }

  // Domain business logic methods
  addMedication(medication: Medication): Prescription {
    const newMedications = [...this._medications, medication];
    return this.createCopy({ medications: newMedications });
  }

  removeMedication(medicationId: string): Prescription {
    const newMedications = this._medications.filter(med => med.stringId !== medicationId);
    return this.createCopy({ medications: newMedications });
  }

  updateMedications(medications: Medication[]): Prescription {
    return this.createCopy({ medications });
  }

  updateExpiryDate(expiryDate?: Date): Prescription {
    this.validateDates(this._prescribedDate, expiryDate);
    return this.createCopy({ expiryDate });
  }

  updateQuantity(quantity?: string): Prescription {
    return this.createCopy({ quantity });
  }

  updateAdditionalNotes(additionalNotes?: string): Prescription {
    return this.createCopy({ additionalNotes });
  }

  activate(): Prescription {
    return this.createCopy({ status: 'active' });
  }

  complete(): Prescription {
    return this.createCopy({ status: 'completed' });
  }

  discontinue(): Prescription {
    return this.createCopy({ status: 'discontinued' });
  }

  putOnHold(): Prescription {
    return this.createCopy({ status: 'on-hold' });
  }

  /**
   * Creates a copy of this prescription with modified properties
   * Immutable entity pattern - all changes create new instances
   */
  private createCopy(updates: {
    medications?: Medication[];
    expiryDate?: Date;
    quantity?: string;
    additionalNotes?: string;
    status?: 'active' | 'completed' | 'discontinued' | 'on-hold';
  }): Prescription {
    return new Prescription(
      this._patientId,
      this._doctorId,
      updates.medications || this._medications,
      this._prescribedDate,
      this._id,
      updates.expiryDate !== undefined ? updates.expiryDate : this._expiryDate,
      updates.quantity !== undefined ? updates.quantity : this._quantity,
      updates.additionalNotes !== undefined ? updates.additionalNotes : this._additionalNotes,
      updates.status || this._status,
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
    return this._status === 'active' && !this.isExpired();
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
