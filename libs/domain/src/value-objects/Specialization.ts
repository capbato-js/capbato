export class Specialization {
  private readonly _value: string;
  
  // Common medical specializations
  private static readonly VALID_SPECIALIZATIONS = [
    'General Practice',
    'Internal Medicine',
    'Pediatrics',
    'Surgery',
    'Cardiology',
    'Dermatology',
    'Neurology',
    'Orthopedics',
    'Psychiatry',
    'Radiology',
    'Anesthesiology',
    'Emergency Medicine',
    'Family Medicine',
    'Obstetrics and Gynecology',
    'Ophthalmology',
    'Pathology',
    'Urology',
    'Endocrinology',
    'Gastroenterology',
    'Pulmonology',
    'Oncology',
    'Rheumatology',
    'Nephrology',
    'Infectious Disease',
    'Hematology',
    'Allergy and Immunology',
    'Physical Medicine and Rehabilitation',
    'Plastic Surgery',
    'Other'
  ];

  constructor(value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error('Specialization cannot be empty');
    }
    
    const trimmedValue = value.trim();
    
    if (trimmedValue.length > 100) {
      throw new Error('Specialization cannot exceed 100 characters');
    }
    
    this._value = trimmedValue;
  }

  get value(): string {
    return this._value;
  }

  get isValidSpecialization(): boolean {
    return Specialization.VALID_SPECIALIZATIONS.includes(this._value);
  }

  static get validSpecializations(): readonly string[] {
    return Specialization.VALID_SPECIALIZATIONS;
  }

  equals(other: Specialization): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }
}
