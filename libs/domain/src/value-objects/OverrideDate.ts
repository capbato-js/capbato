/**
 * OverrideDate Value Object
 * Ensures date is valid and properly formatted for schedule overrides
 */
export class OverrideDate {
  private readonly _value: string;

  constructor(date: string) {
    this.validate(date);
    this._value = date;
  }

  private validate(date: string): void {
    if (!date) {
      throw new Error('Override date cannot be empty');
    }

    // Validate date format (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      throw new Error('Override date must be in YYYY-MM-DD format');
    }

    // Validate that it's a valid date
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      throw new Error('Invalid override date');
    }

    // Validate that date is not in the past (optional business rule)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (parsedDate < today) {
      throw new Error('Cannot create override for past dates');
    }
  }

  get value(): string {
    return this._value;
  }

  toDate(): Date {
    return new Date(this._value);
  }

  equals(other: OverrideDate): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }
}
