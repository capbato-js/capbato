/**
 * Value Object for Schedule Date
 * Handles date validation and ensures business rules for scheduling
 */
export class ScheduleDate {
  private readonly _value: Date;

  constructor(value: string | Date) {
    if (value instanceof Date) {
      this._value = new Date(value);
    } else {
      // Parse ISO date string or date string
      const parsedDate = new Date(value);
      if (isNaN(parsedDate.getTime())) {
        throw new Error('Invalid date format. Use ISO date string or valid date format.');
      }
      this._value = parsedDate;
    }

    this.validateBusinessRules();
  }

  get value(): Date {
    return new Date(this._value);
  }

  get isoString(): string {
    return this._value.toISOString().split('T')[0]; // Returns YYYY-MM-DD format
  }

  get formattedValue(): string {
    return this._value.toLocaleDateString();
  }

  private validateBusinessRules(): void {
    // Ensure the date is not in the past (allowing today)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const scheduleDate = new Date(this._value);
    scheduleDate.setHours(0, 0, 0, 0);

    if (scheduleDate < today) {
      throw new Error('Schedule date cannot be in the past');
    }

    // Ensure the date is not too far in the future (e.g., within next 2 years)
    const maxFutureDate = new Date();
    maxFutureDate.setFullYear(maxFutureDate.getFullYear() + 2);

    if (this._value > maxFutureDate) {
      throw new Error('Schedule date cannot be more than 2 years in the future');
    }
  }

  isToday(): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const scheduleDate = new Date(this._value);
    scheduleDate.setHours(0, 0, 0, 0);

    return scheduleDate.getTime() === today.getTime();
  }

  isFuture(): boolean {
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    return this._value > today;
  }

  daysBetween(other: ScheduleDate): number {
    const diffTime = Math.abs(this._value.getTime() - other._value.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  equals(other: ScheduleDate): boolean {
    return this._value.getTime() === other._value.getTime();
  }

  toString(): string {
    return this.isoString;
  }

  static today(): ScheduleDate {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return new ScheduleDate(today);
  }

  static fromISOString(isoString: string): ScheduleDate {
    return new ScheduleDate(isoString);
  }

  static createUnsafe(date: Date): ScheduleDate {
    const scheduleDate = Object.create(ScheduleDate.prototype);
    scheduleDate._value = new Date(date);
    return scheduleDate;
  }
}