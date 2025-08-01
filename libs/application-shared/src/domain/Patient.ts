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
  
  // Address Information
  houseNumber?: string;
  streetName?: string;
  province?: string;
  cityMunicipality?: string;
  barangay?: string;
  
  // Guardian Information
  guardianName?: string;
  guardianGender?: 'Male' | 'Female';
  guardianRelationship?: string;
  guardianContactNumber?: string;
  
  // Guardian Address Information
  guardianHouseNumber?: string;
  guardianStreetName?: string;
  guardianProvince?: string;
  guardianCityMunicipality?: string;
  guardianBarangay?: string;
  
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
  
  // Address Information
  private readonly _houseNumber?: string;
  private readonly _streetName?: string;
  private readonly _province?: string;
  private readonly _cityMunicipality?: string;
  private readonly _barangay?: string;
  
  // Guardian Information
  private readonly _guardianName?: string;
  private readonly _guardianGender?: 'Male' | 'Female';
  private readonly _guardianRelationship?: string;
  private readonly _guardianContactNumber?: string;
  
  // Guardian Address Information
  private readonly _guardianHouseNumber?: string;
  private readonly _guardianStreetName?: string;
  private readonly _guardianProvince?: string;
  private readonly _guardianCityMunicipality?: string;
  private readonly _guardianBarangay?: string;
  
  private readonly _createdAt: Date;
  private readonly _updatedAt: Date;

  constructor(
    patientNumber: string,
    firstName: string,
    lastName: string,
    dateOfBirth: Date | string,
    gender: 'Male' | 'Female',
    contactNumber: string,
    addressInfo: {
      houseNumber?: string;
      streetName?: string;
      province?: string;
      cityMunicipality?: string;
      barangay?: string;
    },
    options: {
      id?: string;
      middleName?: string;
      guardianName?: string;
      guardianGender?: 'Male' | 'Female';
      guardianRelationship?: string;
      guardianContactNumber?: string;
      guardianAddressInfo?: {
        houseNumber?: string;
        streetName?: string;
        province?: string;
        cityMunicipality?: string;
        barangay?: string;
      };
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
    
    // Address Information
    this._houseNumber = addressInfo.houseNumber;
    this._streetName = addressInfo.streetName;
    this._province = addressInfo.province;
    this._cityMunicipality = addressInfo.cityMunicipality;
    this._barangay = addressInfo.barangay;
    
    // Guardian Information
    this._guardianName = options.guardianName;
    this._guardianGender = options.guardianGender;
    this._guardianRelationship = options.guardianRelationship;
    this._guardianContactNumber = options.guardianContactNumber;
    
    // Guardian Address Information
    const guardianAddr = options.guardianAddressInfo;
    this._guardianHouseNumber = guardianAddr?.houseNumber;
    this._guardianStreetName = guardianAddr?.streetName;
    this._guardianProvince = guardianAddr?.province;
    this._guardianCityMunicipality = guardianAddr?.cityMunicipality;
    this._guardianBarangay = guardianAddr?.barangay;
    
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

  // Address getters
  get houseNumber(): string | undefined {
    return this._houseNumber;
  }

  get streetName(): string | undefined {
    return this._streetName;
  }

  get province(): string | undefined {
    return this._province;
  }

  get cityMunicipality(): string | undefined {
    return this._cityMunicipality;
  }

  get barangay(): string | undefined {
    return this._barangay;
  }

  // Guardian Information getters
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

  // Guardian Address getters
  get guardianHouseNumber(): string | undefined {
    return this._guardianHouseNumber;
  }

  get guardianStreetName(): string | undefined {
    return this._guardianStreetName;
  }

  get guardianProvince(): string | undefined {
    return this._guardianProvince;
  }

  get guardianCityMunicipality(): string | undefined {
    return this._guardianCityMunicipality;
  }

  get guardianBarangay(): string | undefined {
    return this._guardianBarangay;
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

  // Computed address properties for backward compatibility
  get address(): string {
    const addressParts = [
      this._houseNumber,
      this._streetName,
      this._barangay,
      this._cityMunicipality,
      this._province
    ].filter(Boolean);
    return addressParts.join(', ');
  }

  get guardianAddress(): string | undefined {
    if (!this.hasGuardianAddressInfo) return undefined;
    
    const addressParts = [
      this._guardianHouseNumber,
      this._guardianStreetName,
      this._guardianBarangay,
      this._guardianCityMunicipality,
      this._guardianProvince
    ].filter(Boolean);
    return addressParts.length > 0 ? addressParts.join(', ') : undefined;
  }

  get hasGuardianInfo(): boolean {
    return !!(this._guardianName || this._guardianGender || this._guardianRelationship || this._guardianContactNumber);
  }

  get hasGuardianAddressInfo(): boolean {
    return !!(this._guardianHouseNumber || this._guardianStreetName || this._guardianProvince || this._guardianCityMunicipality || this._guardianBarangay);
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

    // Address validation - at least one address field should be provided
    if (!this._houseNumber?.trim() && !this._streetName?.trim() && !this._province?.trim() && 
        !this._cityMunicipality?.trim() && !this._barangay?.trim()) {
      throw new InvalidPatientDataError('At least one address field is required', 'address');
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
      {
        houseNumber: this._houseNumber,
        streetName: this._streetName,
        province: this._province,
        cityMunicipality: this._cityMunicipality,
        barangay: this._barangay,
      },
      {
        id: this._id,
        middleName: this._middleName,
        guardianName: this._guardianName,
        guardianGender: this._guardianGender,
        guardianRelationship: this._guardianRelationship,
        guardianContactNumber: this._guardianContactNumber,
        guardianAddressInfo: {
          houseNumber: this._guardianHouseNumber,
          streetName: this._guardianStreetName,
          province: this._guardianProvince,
          cityMunicipality: this._guardianCityMunicipality,
          barangay: this._guardianBarangay,
        },
        createdAt: this._createdAt,
        updatedAt: new Date(),
      }
    );
  }
}

