export class PrescriptionId {
  private readonly _value: string;

  constructor(value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error('Prescription ID cannot be empty');
    }
    this._value = value.trim();
  }

  get value(): string {
    return this._value;
  }

  equals(other: PrescriptionId): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }
}