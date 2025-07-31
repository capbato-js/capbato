import { PatientNotFoundError, InvalidPatientDataError, InvalidPhoneNumberError } from './PatientExceptions';
import { AgeCalculationService } from './AgeCalculationService';
import { PhoneNumberService } from './PhoneNumberService';

export interface IPatient {
  id?: string;
  patientNumber: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  dateOfBirth: Date;
  gender: 'Male' | 'Female';
  contactNumber: string;
  address: string;
  
  // Guardian Information
  guardianName?: string;
  guardianGender?: 'Male' | 'Female';
  guardianRelationship?: string;
  guardianContactNumber?: string;
  guardianAddress?: string;
  
  createdAt: Date;
  updatedAt: Date;
}

export class Patient implements IPatient {
  private readonly _id?: string;
  private readonly _patientNumber: string;
  private readonly _firstName: string;
  private readonly _lastName: string;
  private readonly _middleName?: string;
  private readonly _dateOfBirth: Date;
  private readonly _gender: 'Male' | 'Female';
  private readonly _contactNumber: string;
  private readonly _address: string;
  
  // Guardian Information
  private readonly _guardianName?: string;
  private readonly _guardianGender?: 'Male' | 'Female';
  private readonly _guardianRelationship?: string;
  private readonly _guardianContactNumber?: string;
  private readonly _guardianAddress?: string;
  
  private readonly _createdAt: Date;
  private readonly _updatedAt: Date;

  constructor(
    patientNumber: string,
    firstName: string,
    lastName: string,
    dateOfBirth: Date | string,
    gender: 'Male' | 'Female',
    contactNumber: string,
    address: string,
    options: {
      id?: string;
      middleName?: string;
      guardianName?: string;
      guardianGender?: 'Male' | 'Female';
      guardianRelationship?: string;
      guardianContactNumber?: string;
      guardianAddress?: string;
      createdAt?: Date;
      updatedAt?: Date;
    } = {}
  ) {
    this._id = options.id;
    this._patientNumber = patientNumber;
    this._firstName = firstName;
    this._lastName = lastName;
    this._middleName = options.middleName;
    this._dateOfBirth = typeof dateOfBirth === 'string' ? new Date(dateOfBirth) : dateOfBirth;
    this._gender = gender;
    this._contactNumber = contactNumber;
    this._address = address;
    
    // Guardian Information
    this._guardianName = options.guardianName;
    this._guardianGender = options.guardianGender;
    this._guardianRelationship = options.guardianRelationship;
    this._guardianContactNumber = options.guardianContactNumber;
    this._guardianAddress = options.guardianAddress;
    
    this._createdAt = options.createdAt || new Date();
    this._updatedAt = options.updatedAt || new Date();

    this.validate();
  }

  // Getters
  get id(): string | undefined {
    return this._id;
  }

  get patientNumber(): string {
    return this._patientNumber;
  }

  get firstName(): string {
    return this._firstName;
  }

  get lastName(): string {
    return this._lastName;
  }

  get middleName(): string | undefined {
    return this._middleName;
  }

  get dateOfBirth(): Date {
    return this._dateOfBirth;
  }

  get gender(): 'Male' | 'Female' {
    return this._gender;
  }

  get contactNumber(): string {
    return this._contactNumber;
  }

  get address(): string {
    return this._address;
  }

  get guardianName(): string | undefined {
    return this._guardianName;
  }

  get guardianGender(): 'Male' | 'Female' | undefined {
    return this._guardianGender;
  }

  get guardianRelationship(): string | undefined {
    return this._guardianRelationship;
  }

  get guardianContactNumber(): string | undefined {
    return this._guardianContactNumber;
  }

  get guardianAddress(): string | undefined {
    return this._guardianAddress;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  // Computed properties
  get fullName(): string {
    const parts = [this._firstName, this._middleName, this._lastName].filter(Boolean);
    return parts.join(' ');
  }

  get age(): number {
    const ageService = new AgeCalculationService();
    return ageService.calculateAge(this._dateOfBirth);
  }

  get ageCategory(): 'child' | 'adult' | 'senior' {
    const ageService = new AgeCalculationService();
    return ageService.getAgeCategory(this.age);
  }

  get hasGuardianInfo(): boolean {
    return !!(this._guardianName || this._guardianGender || this._guardianRelationship || this._guardianContactNumber);
  }

  // Domain methods
  getFormattedContactNumber(): string {
    const phoneService = new PhoneNumberService();
    return phoneService.formatForDisplay(this._contactNumber);
  }

  getFormattedGuardianContactNumber(): string | undefined {
    if (!this._guardianContactNumber) return undefined;
    
    const phoneService = new PhoneNumberService();
    return phoneService.formatForDisplay(this._guardianContactNumber);
  }

  isMinor(): boolean {
    return this.age < 18;
  }

  isSenior(): boolean {
    return this.age >= 60;
  }

  requiresGuardian(): boolean {
    return this.isMinor();
  }

  /**
   * Domain equality comparison based on business identity
   */
  equals(other: Patient): boolean {
    if (!this._id || !other._id) {
      return false;
    }
    return this._id === other._id;
  }

  /**
   * Validates business invariants
   */
  validate(): void {
    // Required fields validation
    if (!this._patientNumber?.trim()) {
      throw new InvalidPatientDataError('Patient number is required');
    }

    if (!this._firstName?.trim()) {
      throw new InvalidPatientDataError('First name is required', 'firstName');
    }

    if (!this._lastName?.trim()) {
      throw new InvalidPatientDataError('Last name is required', 'lastName');
    }

    if (!this._dateOfBirth || isNaN(this._dateOfBirth.getTime())) {
      throw new InvalidPatientDataError('Valid date of birth is required', 'dateOfBirth');
    }

    if (!['Male', 'Female'].includes(this._gender)) {
      throw new InvalidPatientDataError('Gender must be Male or Female', 'gender');
    }

    if (!this._contactNumber?.trim()) {
      throw new InvalidPatientDataError('Contact number is required', 'contactNumber');
    }

    if (!this._address?.trim()) {
      throw new InvalidPatientDataError('Address is required', 'address');
    }

    // Phone number validation
    const phoneService = new PhoneNumberService();
    if (!phoneService.isValidPhilippineMobile(this._contactNumber)) {
      throw new InvalidPhoneNumberError(this._contactNumber, 'Contact number');
    }

    if (this._guardianContactNumber && !phoneService.isValidPhilippineMobile(this._guardianContactNumber)) {
      throw new InvalidPhoneNumberError(this._guardianContactNumber, 'Guardian contact number');
    }

    // Date validation
    const now = new Date();
    if (this._dateOfBirth > now) {
      throw new InvalidPatientDataError('Date of birth cannot be in the future', 'dateOfBirth');
    }

    // Age validation (reasonable range)
    const ageService = new AgeCalculationService();
    if (!ageService.isValidDateOfBirth(this._dateOfBirth)) {
      throw new InvalidPatientDataError('Date of birth is not within a reasonable range', 'dateOfBirth');
    }

    // Guardian information validation
    if (this.hasGuardianInfo) {
      if (!this._guardianName?.trim()) {
        throw new InvalidPatientDataError('Guardian name is required when guardian information is provided', 'guardianName');
      }

      if (!this._guardianRelationship?.trim()) {
        throw new InvalidPatientDataError('Guardian relationship is required when guardian information is provided', 'guardianRelationship');
      }

      if (!this._guardianContactNumber?.trim()) {
        throw new InvalidPatientDataError('Guardian contact number is required when guardian information is provided', 'guardianContactNumber');
      }
    }

    // Business rule: Minors should have guardian information
    if (this.requiresGuardian() && !this.hasGuardianInfo) {
      // This is a warning, not an error, as it might be acceptable in some cases
      console.warn(`Patient ${this._patientNumber} is a minor (${this.age} years old) but has no guardian information`);
    }
  }

  /**
   * Creates a copy of this patient with updated timestamps
   */
  touch(): Patient {
    return new Patient(
      this._patientNumber,
      this._firstName,
      this._lastName,
      this._dateOfBirth,
      this._gender,
      this._contactNumber,
      this._address,
      {
        id: this._id,
        middleName: this._middleName,
        guardianName: this._guardianName,
        guardianGender: this._guardianGender,
        guardianRelationship: this._guardianRelationship,
        guardianContactNumber: this._guardianContactNumber,
        guardianAddress: this._guardianAddress,
        createdAt: this._createdAt,
        updatedAt: new Date(),
      }
    );
  }
}

