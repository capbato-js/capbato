export interface BloodChemistryPatientData {
  patientId?: string;
  patientName: string;
  age: number;
  sex: string;
}

export class BloodChemistryPatientInfo {
  private readonly _patientId?: string;
  private readonly _patientName: string;
  private readonly _age: number;
  private readonly _sex: string;

  constructor(data: BloodChemistryPatientData) {
    this._patientId = data.patientId;
    this._patientName = data.patientName;
    this._age = data.age;
    this._sex = data.sex;
    this.validate();
  }

  get patientId(): string | undefined {
    return this._patientId;
  }

  get patientName(): string {
    return this._patientName;
  }

  get age(): number {
    return this._age;
  }

  get sex(): string {
    return this._sex;
  }

  validate(): void {
    if (!this._patientName || this._patientName.trim() === '') {
      throw new Error('Patient name is required');
    }
    
    if (this._patientName.length > 255) {
      throw new Error('Patient name cannot exceed 255 characters');
    }
    
    if (!this._age || this._age < 0 || this._age > 200) {
      throw new Error('Age must be between 0 and 200');
    }
    
    if (!this._sex || this._sex.trim() === '') {
      throw new Error('Sex is required');
    }
    
    const validSexValues = ['M', 'F', 'Male', 'Female', 'male', 'female'];
    if (!validSexValues.includes(this._sex)) {
      throw new Error('Sex must be M, F, Male, or Female');
    }
  }

  equals(other: BloodChemistryPatientInfo): boolean {
    return (
      this._patientName === other._patientName &&
      this._age === other._age &&
      this._sex === other._sex
    );
  }
}
