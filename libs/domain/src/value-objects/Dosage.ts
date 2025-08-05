import { InvalidDosageException } from '../exceptions/DomainExceptions';

/**
 * Value Object for Dosage
 * Encapsulates business rules for medication dosage
 */
export class Dosage {
  private readonly _value: string;

  constructor(value: string) {
    this.validateDosage(value);
    this._value = value.trim();
  }

  get value(): string {
    return this._value;
  }

  private validateDosage(dosage: string): void {
    if (!dosage || !dosage.trim()) {
      throw new InvalidDosageException('cannot be empty');
    }

    if (dosage.trim().length > 100) {
      throw new InvalidDosageException('cannot exceed 100 characters');
    }

    if (dosage.trim().length < 2) {
      throw new InvalidDosageException('must be at least 2 characters long');
    }

    // Pattern validation for dosage (numbers, units, spaces, forward slash for fractions)
    const dosagePattern = /^[0-9]+(\.[0-9]+)?\s*(mg|g|ml|tablet|tablets|capsule|capsules|drops|units|mcg|IU|%|times|time)(\s*(daily|twice daily|three times daily|four times daily|once daily|every 8 hours|every 12 hours|every 6 hours|as needed|as directed|per day|\/day|BID|TID|QID|PRN|QD))?.*$/i;
    
    // Allow more flexible dosage patterns including common medical abbreviations
    const flexibleDosagePattern = /^[0-9].*$/;
    
    if (!flexibleDosagePattern.test(dosage.trim())) {
      throw new InvalidDosageException('must start with a number');
    }
  }

  equals(other: Dosage): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }
}