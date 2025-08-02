import { InvalidAppointmentTimeException } from '../exceptions/DomainExceptions';

export class AppointmentTime {
  private static readonly TIME_PATTERN = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;

  constructor(private readonly _value: string) {
    this.validate(_value);
  }

  get value(): string {
    return this._value;
  }

  private validate(value: string): void {
    if (!value || typeof value !== 'string') {
      throw new InvalidAppointmentTimeException('Appointment time must be a non-empty string');
    }

    if (!AppointmentTime.TIME_PATTERN.test(value)) {
      throw new InvalidAppointmentTimeException(
        'Appointment time must be in HH:MM format (24-hour)'
      );
    }
  }

  /**
   * Converts time string to minutes since midnight for comparison
   */
  toMinutes(): number {
    const [hours, minutes] = this._value.split(':').map(Number);
    return hours * 60 + minutes;
  }

  /**
   * Compares this time with another time
   */
  isBefore(other: AppointmentTime): boolean {
    return this.toMinutes() < other.toMinutes();
  }

  /**
   * Compares this time with another time
   */
  isAfter(other: AppointmentTime): boolean {
    return this.toMinutes() > other.toMinutes();
  }

  equals(other: AppointmentTime): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }

  /**
   * Formats the time in 12-hour format with AM/PM
   */
  to12HourFormat(): string {
    const [hours, minutes] = this._value.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
  }
}
