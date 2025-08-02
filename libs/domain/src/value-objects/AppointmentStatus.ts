import { InvalidAppointmentStatusException } from '../exceptions/DomainExceptions';

export type AppointmentStatusType = 'scheduled' | 'confirmed' | 'cancelled' | 'completed';

export class AppointmentStatus {
  private static readonly VALID_STATUSES: AppointmentStatusType[] = [
    'scheduled',
    'confirmed', 
    'cancelled',
    'completed'
  ];

  constructor(private readonly _value: AppointmentStatusType) {
    this.validate(_value);
  }

  get value(): AppointmentStatusType {
    return this._value;
  }

  private validate(value: AppointmentStatusType): void {
    if (!AppointmentStatus.VALID_STATUSES.includes(value)) {
      throw new InvalidAppointmentStatusException(
        `Invalid appointment status: ${value}. Valid statuses are: ${AppointmentStatus.VALID_STATUSES.join(', ')}`
      );
    }
  }

  isScheduled(): boolean {
    return this._value === 'scheduled';
  }

  isConfirmed(): boolean {
    return this._value === 'confirmed';
  }

  isCancelled(): boolean {
    return this._value === 'cancelled';
  }

  isCompleted(): boolean {
    return this._value === 'completed';
  }

  equals(other: AppointmentStatus): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }
}
