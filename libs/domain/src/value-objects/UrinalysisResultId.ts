import { v4 as uuidv4 } from 'uuid';

export class UrinalysisResultId {
  constructor(private readonly _value: string) {
    if (!_value) {
      throw new Error('UrinalysisResultId cannot be empty');
    }
  }

  static generate(): UrinalysisResultId {
    return new UrinalysisResultId(uuidv4());
  }

  get value(): string {
    return this._value;
  }

  equals(other: UrinalysisResultId): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }
}
