import { DoctorId } from '../value-objects/DoctorId';
import { Specialization } from '../value-objects/Specialization';

interface IDoctor {
  id?: DoctorId;
  userId: string; // Foreign key to User entity
  specialization: Specialization;
  licenseNumber?: string;
  yearsOfExperience?: number;
  isActive: boolean;
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

  constructor(
    userId: string,
    specialization: string | Specialization,
    id?: string | DoctorId,
    licenseNumber?: string,
    yearsOfExperience?: number,
    isActive = true
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

  // For backwards compatibility with existing code that expects string ID
  get stringId(): string | undefined {
    return this._id?.value;
  }

  get specializationValue(): string {
    return this._specialization.value;
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
   * Creates a copy of this doctor with modified properties
   * Immutable entity pattern - all changes create new instances
   */
  private createCopy(updates: {
    specialization?: Specialization;
    licenseNumber?: string;
    yearsOfExperience?: number;
    isActive?: boolean;
  }): Doctor {
    return new Doctor(
      this._userId,
      updates.specialization || this._specialization,
      this._id,
      updates.licenseNumber !== undefined ? updates.licenseNumber : this._licenseNumber,
      updates.yearsOfExperience !== undefined ? updates.yearsOfExperience : this._yearsOfExperience,
      updates.isActive !== undefined ? updates.isActive : this._isActive
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
