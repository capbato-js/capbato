import { NameFormattingService } from '../services/NameFormattingService';

export class DoctorName {
  private readonly _value: string;

  constructor(value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error('Doctor name cannot be empty');
    }
    
    const trimmedValue = value.trim();
    
    if (trimmedValue.length < 2) {
      throw new Error('Doctor name must be at least 2 characters long');
    }
    
    if (trimmedValue.length > 50) {
      throw new Error('Doctor name cannot exceed 50 characters');
    }
    
    // Basic name validation - only letters, spaces, hyphens, apostrophes, and periods
    const namePattern = /^[a-zA-Z\s\-'.]+$/;
    if (!namePattern.test(trimmedValue)) {
      throw new Error('Doctor name can only contain letters, spaces, hyphens, apostrophes, and periods');
    }
    
    // Format the name to proper case using the domain service
    this._value = NameFormattingService.formatToProperCase(trimmedValue);
  }

  get value(): string {
    return this._value;
  }

  equals(other: DoctorName): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }
}
