import { InvalidAppointmentIdException } from '../exceptions/DomainExceptions';

export class AppointmentId {
  constructor(private readonly _value: string) {
    this.validate(_value);
  }

  get value(): string {
    return this._value;
  }

  private validate(value: string): void {
    if (!value || typeof value !== 'string') {
      throw new InvalidAppointmentIdException('Appointment ID must be a non-empty string');
    }

    if (value.trim().length === 0) {
      throw new InvalidAppointmentIdException('Appointment ID cannot be empty');
    }

    // Additional validation can be added here (format, length, etc.)
  }

  equals(other: AppointmentId): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }
}
