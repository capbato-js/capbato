import { InvalidMedicationIdException } from '../exceptions/DomainExceptions';

export class MedicationId {
  private readonly _value: string;

  constructor(value: string) {
    if (!value || value.trim().length === 0) {
      throw new InvalidMedicationIdException('cannot be empty');
    }

    this._value = value.trim();
  }

  get value(): string {
    return this._value;
  }

  equals(other: MedicationId): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }
}
