export class BloodChemistryId {
  private readonly _value: string;

  constructor(value: string) {
    if (!value || value.trim() === '') {
      throw new Error('BloodChemistry ID cannot be empty');
    }
    this._value = value.trim();
  }

  get value(): string {
    return this._value;
  }

  equals(other: BloodChemistryId): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }
}
