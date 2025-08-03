export interface LabRequestPatientData {
  patientId: string;
  patientName: string;
  ageGender: string;
  // Optional extended patient information
  patientNumber?: string;
  firstName?: string;
  lastName?: string;
}

export class LabRequestPatientInfo {
  private readonly _patientId: string;
  private readonly _patientName: string;
  private readonly _ageGender: string;
  private readonly _patientNumber?: string;
  private readonly _firstName?: string;
  private readonly _lastName?: string;

  constructor(data: LabRequestPatientData) {
    this._patientId = data.patientId;
    this._patientName = data.patientName;
    this._ageGender = data.ageGender;
    this._patientNumber = data.patientNumber;
    this._firstName = data.firstName;
    this._lastName = data.lastName;
    this.validate();
  }

  static create(data: LabRequestPatientData): LabRequestPatientInfo {
    return new LabRequestPatientInfo(data);
  }

  get patientId(): string {
    return this._patientId;
  }

  get patientName(): string {
    return this._patientName;
  }

  get ageGender(): string {
    return this._ageGender;
  }

  get patientNumber(): string | undefined {
    return this._patientNumber;
  }

  get firstName(): string | undefined {
    return this._firstName;
  }

  get lastName(): string | undefined {
    return this._lastName;
  }

  validate(): void {
    if (!this._patientId || this._patientId.trim() === '') {
      throw new Error('Patient ID is required');
    }
    
    if (!this._patientName || this._patientName.trim() === '') {
      throw new Error('Patient name is required');
    }
    
    if (this._patientName.length > 255) {
      throw new Error('Patient name cannot exceed 255 characters');
    }
    
    if (!this._ageGender || this._ageGender.trim() === '') {
      throw new Error('Age and gender information is required');
    }
  }

  equals(other: LabRequestPatientInfo): boolean {
    return (
      this._patientId === other._patientId &&
      this._patientName === other._patientName &&
      this._ageGender === other._ageGender
    );
  }
}
