import { v4 as uuidv4 } from 'uuid';

export class SerologyResultId {
  constructor(private readonly _value: string) {
    if (!_value) {
      throw new Error('SerologyResultId cannot be empty');
    }
  }

  static generate(): SerologyResultId {
    return new SerologyResultId(uuidv4());
  }

  get value(): string {
    return this._value;
  }

  equals(other: SerologyResultId): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }
}
