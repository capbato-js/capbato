export class ReceiptId {
  private readonly _value: string;

  constructor(value: string) {
    this.validate(value);
    this._value = value;
  }

  get value(): string {
    return this._value;
  }

  private validate(value: string): void {
    if (!value || value.trim().length === 0) {
      throw new Error('Receipt ID cannot be empty');
    }
  }

  equals(other: ReceiptId): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }
}