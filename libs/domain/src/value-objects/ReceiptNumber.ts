export class ReceiptNumber {
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
      throw new Error('Receipt number cannot be empty');
    }

    // Receipt number format: R-YYYY-NNN (e.g., R-2025-001)
    const receiptNumberPattern = /^R-\d{4}-\d{3,}$/;
    if (!receiptNumberPattern.test(value)) {
      throw new Error('Receipt number must follow format R-YYYY-NNN (e.g., R-2025-001)');
    }
  }

  equals(other: ReceiptNumber): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }

  static generate(year: number, sequenceNumber: number): ReceiptNumber {
    const paddedSequence = sequenceNumber.toString().padStart(3, '0');
    return new ReceiptNumber(`R-${year}-${paddedSequence}`);
  }
}