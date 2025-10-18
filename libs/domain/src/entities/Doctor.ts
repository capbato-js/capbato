import { DoctorId } from '../value-objects/DoctorId';
import { Specialization } from '../value-objects/Specialization';
import { DoctorSchedulePattern } from '../value-objects/DoctorSchedulePattern';

interface IDoctor {
  id?: DoctorId;
  userId: string; // Foreign key to User entity
  specialization: Specialization;
  licenseNumber?: string;
  yearsOfExperience?: number;
  isActive: boolean;
  schedulePattern?: DoctorSchedulePattern;
}

/**
 * Doctor Entity - Medical Profile linked to User Account
 * 
 * This entity represents the medical profile information for users with 'doctor' role.
 * It maintains a relationship with the User entity to avoid data duplication.
 * 
 * Responsibilities:
 * - Store medical-specific information (specialization, license, experience)
 * - Link to User entity for authentication and contact info
 */
export class Doctor implements IDoctor {
  private readonly _id?: DoctorId;
  private readonly _userId: string;
  private readonly _specialization: Specialization;
  private readonly _licenseNumber?: string;
  private readonly _yearsOfExperience?: number;
  private readonly _isActive: boolean;
  private readonly _schedulePattern?: DoctorSchedulePattern;

  constructor(
    userId: string,
    specialization: string | Specialization,
    id?: string | DoctorId,
    licenseNumber?: string,
    yearsOfExperience?: number,
    isActive = true,
    schedulePattern?: DoctorSchedulePattern | string
  ) {
    if (!userId || userId.trim().length === 0) {
      throw new Error('User ID is required for Doctor entity');
    }
    
    this._userId = userId.trim();
    this._specialization = specialization instanceof Specialization ? specialization : new Specialization(specialization);
    this._id = id instanceof DoctorId ? id : id ? new DoctorId(id) : undefined;
    this._licenseNumber = licenseNumber?.trim();
    this._yearsOfExperience = yearsOfExperience;
    this._isActive = isActive;
    
    // Handle schedule pattern
    if (schedulePattern) {
      if (typeof schedulePattern === 'string') {
        this._schedulePattern = DoctorSchedulePattern.fromString(schedulePattern);
      } else {
        this._schedulePattern = schedulePattern;
      }
    }
  }

  get id(): DoctorId | undefined {
    return this._id;
  }

  get userId(): string {
    return this._userId;
  }

  get specialization(): Specialization {
    return this._specialization;
  }


  get licenseNumber(): string | undefined {
    return this._licenseNumber;
  }

  get yearsOfExperience(): number | undefined {
    return this._yearsOfExperience;
  }

  get isActive(): boolean {
    return this._isActive;
  }

  get schedulePattern(): DoctorSchedulePattern | undefined {
    return this._schedulePattern;
  }

  // For backwards compatibility with existing code that expects string ID
  get stringId(): string | undefined {
    return this._id?.value;
  }

  get specializationValue(): string {
    return this._specialization.value;
  }

  get schedulePatternString(): string | undefined {
    return this._schedulePattern?.toString();
  }

  get schedulePatternDescription(): string {
    return this._schedulePattern?.getDescription() || 'No schedule assigned';
  }



  // Domain business logic methods
  updateSpecialization(newSpecialization: string | Specialization): Doctor {
    const specialization = newSpecialization instanceof Specialization ? newSpecialization : new Specialization(newSpecialization);
    return this.createCopy({ specialization });
  }


  updateLicenseNumber(newLicenseNumber?: string): Doctor {
    return this.createCopy({ licenseNumber: newLicenseNumber?.trim() });
  }

  updateExperience(years: number): Doctor {
    if (years < 0) {
      throw new Error('Years of experience cannot be negative');
    }
    return this.createCopy({ yearsOfExperience: years });
  }

  activate(): Doctor {
    return this.createCopy({ isActive: true });
  }

  deactivate(): Doctor {
    return this.createCopy({ isActive: false });
  }

  /**
   * Update the doctor's schedule pattern
   */
  updateSchedulePattern(newSchedulePattern: DoctorSchedulePattern | string): Doctor {
    const schedulePattern = typeof newSchedulePattern === 'string' 
      ? DoctorSchedulePattern.fromString(newSchedulePattern)
      : newSchedulePattern;
    return this.createCopy({ schedulePattern });
  }

  /**
   * Remove the doctor's schedule pattern
   */
  removeSchedulePattern(): Doctor {
    return this.createCopy({ schedulePattern: undefined });
  }

  /**
   * Check if doctor is available on a specific day
   */
  isAvailableOnDay(day: string): boolean {
    if (!this._schedulePattern) {
      return false; // No schedule pattern means not available
    }
    
    // Convert day string to DayOfWeek format
    const dayMap: Record<string, string> = {
      'monday': 'MONDAY',
      'tuesday': 'TUESDAY', 
      'wednesday': 'WEDNESDAY',
      'thursday': 'THURSDAY',
      'friday': 'FRIDAY',
      'saturday': 'SATURDAY',
      'sunday': 'SUNDAY',
      'mon': 'MONDAY',
      'tue': 'TUESDAY',
      'wed': 'WEDNESDAY',
      'thu': 'THURSDAY',
      'fri': 'FRIDAY',
      'sat': 'SATURDAY',
      'sun': 'SUNDAY'
    };
    
    const normalizedDay = dayMap[day.toLowerCase()];
    if (!normalizedDay) {
      return false;
    }
    
    return this._schedulePattern.includesDay(normalizedDay as any);
  }

  /**
   * Check if doctor is available on a specific date
   */
  isAvailableOnDate(date: Date): boolean {
    if (!this._schedulePattern) {
      return false; // No schedule pattern means not available
    }
    
    return this._schedulePattern.includesDate(date);
  }

  /**
   * Creates a copy of this doctor with modified properties
   * Immutable entity pattern - all changes create new instances
   */
  private createCopy(updates: {
    specialization?: Specialization;
    licenseNumber?: string;
    yearsOfExperience?: number;
    isActive?: boolean;
    schedulePattern?: DoctorSchedulePattern;
  }): Doctor {
    return new Doctor(
      this._userId,
      updates.specialization || this._specialization,
      this._id,
      'licenseNumber' in updates ? updates.licenseNumber : this._licenseNumber,
      'yearsOfExperience' in updates ? updates.yearsOfExperience : this._yearsOfExperience,
      'isActive' in updates ? updates.isActive : this._isActive,
      'schedulePattern' in updates ? updates.schedulePattern : this._schedulePattern
    );
  }

  /**
   * Domain equality comparison based on business identity
   */
  equals(other: Doctor): boolean {
    if (!this._id || !other._id) {
      return false;
    }
    return this._id.equals(other._id);
  }

  /**
   * Validates business invariants
   */
  validate(): void {
    if (!this._userId || this._userId.trim().length === 0) {
      throw new Error('Doctor must be linked to a valid user');
    }

    if (!this._specialization || this._specialization.value.trim().length === 0) {
      throw new Error('Doctor must have a valid specialization');
    }


    if (this._yearsOfExperience !== undefined && this._yearsOfExperience < 0) {
      throw new Error('Years of experience cannot be negative');
    }
  }
}

export type { IDoctor };
