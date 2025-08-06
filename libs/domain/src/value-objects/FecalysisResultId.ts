import { v4 as uuidv4 } from 'uuid';

export class FecalysisResultId {
  constructor(private readonly _value: string) {
    if (!_value) {
      throw new Error('FecalysisResultId cannot be empty');
    }
  }

  static generate(): FecalysisResultId {
    return new FecalysisResultId(uuidv4());
  }

  get value(): string {
    return this._value;
  }

  equals(other: FecalysisResultId): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }
}
