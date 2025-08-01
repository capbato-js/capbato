/**
 * Value Object for Schedule Time
 * Handles time validation and ensures business rules for doctor schedule times
 */
export class ScheduleTime {
  private readonly _value: string;
  private readonly _hours: number;
  private readonly _minutes: number;

  constructor(value: string) {
    this.validateFormat(value);
    this._value = this.normalizeTime(value);
    
    const [hours, minutes] = this._value.split(':').map(Number);
    this._hours = hours;
    this._minutes = minutes;

    this.validateBusinessRules();
  }

  get value(): string {
    return this._value;
  }

  get hours(): number {
    return this._hours;
  }

  get minutes(): number {
    return this._minutes;
  }

  get formattedValue(): string {
    const hours12 = this._hours === 0 ? 12 : this._hours > 12 ? this._hours - 12 : this._hours;
    const ampm = this._hours < 12 ? 'AM' : 'PM';
    const minutesStr = this._minutes.toString().padStart(2, '0');
    return `${hours12}:${minutesStr} ${ampm}`;
  }

  private validateFormat(time: string): void {
    if (typeof time !== 'string' || time.trim().length === 0) {
      throw new Error('Schedule time must be a non-empty string');
    }

    // Support HH:MM, H:MM, HH:MM:SS, HH:MM AM/PM, H:MM AM/PM formats
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):([0-5][0-9])(:([0-5][0-9]))?(\s?(AM|PM|am|pm))?$/;
    
    if (!timeRegex.test(time.trim())) {
      throw new Error('Invalid time format. Use HH:MM (24-hour) or HH:MM AM/PM format');
    }
  }

  private normalizeTime(time: string): string {
    const cleanTime = time.trim();
    
    // Handle AM/PM format
    if (cleanTime.toLowerCase().includes('am') || cleanTime.toLowerCase().includes('pm')) {
      const [timePart, period] = cleanTime.split(/\s+/);
      const timeParts = timePart.split(':');
      const hours = parseInt(timeParts[0], 10);
      const minutes = parseInt(timeParts[1], 10);
      // Ignore seconds if present
      
      let normalizedHours = hours;
      if (period.toLowerCase() === 'pm' && hours !== 12) {
        normalizedHours += 12;
      } else if (period.toLowerCase() === 'am' && hours === 12) {
        normalizedHours = 0;
      }
      
      return `${normalizedHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    }
    
    // Handle 24-hour format (with or without seconds)
    const timeParts = cleanTime.split(':');
    const hours = parseInt(timeParts[0], 10);
    const minutes = parseInt(timeParts[1], 10);
    // Ignore seconds if present (timeParts[2])
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  }

  private validateBusinessRules(): void {
    // Ensure time is within reasonable working hours (6 AM to 10 PM)
    if (this._hours < 6 || this._hours > 22) {
      throw new Error('Schedule time must be between 6:00 AM and 10:00 PM');
    }

    // Ensure time is on valid intervals (e.g., 15-minute intervals)
    if (this._minutes % 15 !== 0) {
      throw new Error('Schedule time must be on 15-minute intervals (00, 15, 30, 45)');
    }
  }

  isBefore(other: ScheduleTime): boolean {
    const thisMinutes = this._hours * 60 + this._minutes;
    const otherMinutes = other._hours * 60 + other._minutes;
    return thisMinutes < otherMinutes;
  }

  isAfter(other: ScheduleTime): boolean {
    const thisMinutes = this._hours * 60 + this._minutes;
    const otherMinutes = other._hours * 60 + other._minutes;
    return thisMinutes > otherMinutes;
  }

  minutesBetween(other: ScheduleTime): number {
    const thisMinutes = this._hours * 60 + this._minutes;
    const otherMinutes = other._hours * 60 + other._minutes;
    return Math.abs(thisMinutes - otherMinutes);
  }

  addMinutes(minutes: number): ScheduleTime {
    const totalMinutes = this._hours * 60 + this._minutes + minutes;
    const newHours = Math.floor(totalMinutes / 60) % 24;
    const newMinutes = totalMinutes % 60;
    
    return new ScheduleTime(`${newHours.toString().padStart(2, '0')}:${newMinutes.toString().padStart(2, '0')}`);
  }

  equals(other: ScheduleTime): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }

  static fromString(value: string): ScheduleTime {
    return new ScheduleTime(value);
  }

  static from24Hour(hours: number, minutes: number): ScheduleTime {
    return new ScheduleTime(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`);
  }

  static from12Hour(hours: number, minutes: number, ampm: 'AM' | 'PM'): ScheduleTime {
    return new ScheduleTime(`${hours}:${minutes.toString().padStart(2, '0')} ${ampm}`);
  }
}