import { InvalidInstructionsException } from '../exceptions/DomainExceptions';

/**
 * Value Object for Prescription Instructions
 * Encapsulates business rules for prescription instructions
 */
export class Instructions {
  private readonly _value: string;

  constructor(value: string) {
    this.validateInstructions(value);
    this._value = value ? value.trim() : '';
  }

  get value(): string {
    return this._value;
  }

  private validateInstructions(instructions: string): void {
    // Allow empty instructions
    if (!instructions) {
      return;
    }

    const trimmed = instructions.trim();
    
    if (trimmed.length > 1000) {
      throw new InvalidInstructionsException('cannot exceed 1000 characters');
    }

    if (trimmed.length > 0 && trimmed.length < 3) {
      throw new InvalidInstructionsException('must be at least 3 characters long');
    }
  }

  equals(other: Instructions): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }
}