/**
 * OverrideReason Value Object
 * Ensures override reason is valid and properly formatted
 */
export class OverrideReason {
  private readonly _value: string;

  constructor(reason: string) {
    this.validate(reason);
    this._value = reason.trim();
  }

  private validate(reason: string): void {
    if (!reason) {
      throw new Error('Override reason cannot be empty');
    }

    if (typeof reason !== 'string') {
      throw new Error('Override reason must be a string');
    }

    const trimmedReason = reason.trim();
    if (trimmedReason.length === 0) {
      throw new Error('Override reason cannot be empty');
    }

    if (trimmedReason.length > 500) {
      throw new Error('Override reason cannot exceed 500 characters');
    }

    if (trimmedReason.length < 3) {
      throw new Error('Override reason must be at least 3 characters long');
    }
  }

  get value(): string {
    return this._value;
  }

  equals(other: OverrideReason): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }
}
