import { v4 as uuidv4 } from 'uuid';

export class HematologyResultId {
  constructor(private readonly _value: string) {
    if (!_value) {
      throw new Error('HematologyResultId cannot be empty');
    }
  }

  static generate(): HematologyResultId {
    return new HematologyResultId(uuidv4());
  }

  get value(): string {
    return this._value;
  }

  equals(other: HematologyResultId): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }
}
