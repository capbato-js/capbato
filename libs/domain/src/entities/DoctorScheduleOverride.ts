import { v4 as uuidv4 } from 'uuid';
import { OverrideDate } from '../value-objects/OverrideDate';
import { DoctorId } from '../value-objects/DoctorId';
import { OverrideReason } from '../value-objects/OverrideReason';

/**
 * DoctorScheduleOverride Entity
 * Represents a manual override of a doctor's default schedule pattern for a specific date
 */
export class DoctorScheduleOverride {
  private readonly _id: string;
  private readonly _date: OverrideDate;
  private readonly _originalDoctorId: DoctorId | null;
  private readonly _assignedDoctorId: DoctorId;
  private readonly _reason: OverrideReason;
  private readonly _createdAt: Date;
  private readonly _updatedAt: Date;

  constructor(
    id: string,
    date: OverrideDate,
    assignedDoctorId: DoctorId,
    reason: OverrideReason,
    originalDoctorId?: DoctorId | null,
    createdAt?: Date,
    updatedAt?: Date
  ) {
    this._id = id;
    this._date = date;
    this._originalDoctorId = originalDoctorId || null;
    this._assignedDoctorId = assignedDoctorId;
    this._reason = reason;
    this._createdAt = createdAt || new Date();
    this._updatedAt = updatedAt || new Date();
  }

  // Static factory method for creating new overrides
  static create(
    date: string,
    assignedDoctorId: string,
    reason: string,
    originalDoctorId?: string
  ): DoctorScheduleOverride {
    const id = uuidv4().replace(/-/g, ''); // Generate dashless UUID
    const now = new Date();

    return new DoctorScheduleOverride(
      id,
      new OverrideDate(date),
      new DoctorId(assignedDoctorId),
      new OverrideReason(reason),
      originalDoctorId ? new DoctorId(originalDoctorId) : null,
      now,
      now
    );
  }

  // Getters
  get id(): string {
    return this._id;
  }

  get date(): OverrideDate {
    return this._date;
  }

  get originalDoctorId(): DoctorId | null {
    return this._originalDoctorId;
  }

  get assignedDoctorId(): DoctorId {
    return this._assignedDoctorId;
  }

  get reason(): OverrideReason {
    return this._reason;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  // Business methods
  updateReason(newReason: string): DoctorScheduleOverride {
    return new DoctorScheduleOverride(
      this._id,
      this._date,
      this._assignedDoctorId,
      new OverrideReason(newReason),
      this._originalDoctorId,
      this._createdAt,
      new Date()
    );
  }

  updateAssignedDoctor(newDoctorId: string): DoctorScheduleOverride {
    return new DoctorScheduleOverride(
      this._id,
      this._date,
      new DoctorId(newDoctorId),
      this._reason,
      this._originalDoctorId,
      this._createdAt,
      new Date()
    );
  }

  // Validation methods
  validate(): void {
    // Additional business rule validations can be added here
    if (this._assignedDoctorId.equals(this._originalDoctorId)) {
      throw new Error('Cannot override with the same doctor');
    }
  }

  // Helper methods
  isForDate(date: string): boolean {
    return this._date.equals(new OverrideDate(date));
  }

  isForDoctor(doctorId: string): boolean {
    return this._assignedDoctorId.equals(new DoctorId(doctorId));
  }

  // Equality
  equals(other: DoctorScheduleOverride): boolean {
    return this._id === other._id;
  }

  // For debugging
  toString(): string {
    return `DoctorScheduleOverride(${this._id}, ${this._date.value}, ${this._assignedDoctorId.value})`;
  }
}
