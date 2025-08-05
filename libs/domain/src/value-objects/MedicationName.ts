import { InvalidMedicationNameException } from '../exceptions/DomainExceptions';

/**
 * Value Object for Medication Name
 * Encapsulates business rules for medication names
 */
export class MedicationName {
  private readonly _value: string;

  constructor(value: string) {
    this.validateMedicationName(value);
    this._value = value.trim();
  }

  get value(): string {
    return this._value;
  }

  private validateMedicationName(name: string): void {
    if (!name || !name.trim()) {
      throw new InvalidMedicationNameException('cannot be empty');
    }

    if (name.trim().length > 200) {
      throw new InvalidMedicationNameException('cannot exceed 200 characters');
    }

    if (name.trim().length < 2) {
      throw new InvalidMedicationNameException('must be at least 2 characters long');
    }

    // Basic pattern validation for medication names (letters, numbers, spaces, hyphens, parentheses)
    const medicationNamePattern = /^[a-zA-Z0-9\s\-()./,]+$/;
    if (!medicationNamePattern.test(name.trim())) {
      throw new InvalidMedicationNameException('contains invalid characters. Only letters, numbers, spaces, hyphens, and parentheses are allowed');
    }
  }

  equals(other: MedicationName): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }
}