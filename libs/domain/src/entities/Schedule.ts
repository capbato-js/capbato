import { ScheduleId } from '../value-objects/ScheduleId';
import { ScheduleDate } from '../value-objects/ScheduleDate';
import { ScheduleTime } from '../value-objects/ScheduleTime';
import { DoctorId } from '../value-objects/DoctorId';

interface ISchedule {
  id?: ScheduleId;
  doctorId: DoctorId;
  date: ScheduleDate;
  time: ScheduleTime;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Schedule Entity - Doctor Schedule Management
 * 
 * This entity represents a doctor's scheduled appointment slot.
 * It maintains the relationship between doctors and their available time slots.
 * 
 * Responsibilities:
 * - Store doctor scheduling information (doctorId, date, time)
 * - Validate business rules for scheduling (no past dates, reasonable hours, etc.)
 * - Provide methods for schedule manipulation and queries
 * - Ensure data consistency and business invariants
 */
export class Schedule implements ISchedule {
  private readonly _id?: ScheduleId;
  private readonly _doctorId: DoctorId;
  private readonly _date: ScheduleDate;
  private readonly _time: ScheduleTime;
  private readonly _createdAt: Date;
  private readonly _updatedAt?: Date;

  constructor(
    doctorId: string | DoctorId,
    date: string | Date | ScheduleDate,
    time: string | ScheduleTime,
    id?: string | ScheduleId,
    createdAt?: Date,
    updatedAt?: Date
  ) {
    // Validate required fields
    if (!doctorId) {
      throw new Error('Doctor ID is required for Schedule entity');
    }

    this._doctorId = doctorId instanceof DoctorId ? doctorId : new DoctorId(doctorId);
    this._date = date instanceof ScheduleDate ? date : new ScheduleDate(date);
    this._time = time instanceof ScheduleTime ? time : new ScheduleTime(time);
    this._id = id instanceof ScheduleId ? id : id ? new ScheduleId(id) : undefined;
    this._createdAt = createdAt || new Date();
    this._updatedAt = updatedAt;

    // Validate business rules
    this.validate();
  }

  get id(): ScheduleId | undefined {
    return this._id;
  }

  get doctorId(): DoctorId {
    return this._doctorId;
  }

  get date(): ScheduleDate {
    return this._date;
  }

  get time(): ScheduleTime {
    return this._time;
  }

  get createdAt(): Date {
    return new Date(this._createdAt);
  }

  get updatedAt(): Date | undefined {
    return this._updatedAt ? new Date(this._updatedAt) : undefined;
  }

  // For backwards compatibility with existing code that expects string ID
  get stringId(): string | undefined {
    return this._id?.value;
  }

  get doctorIdString(): string {
    return this._doctorId.value;
  }

  get dateString(): string {
    return this._date.isoString;
  }

  get timeString(): string {
    return this._time.value;
  }

  get formattedDate(): string {
    return this._date.formattedValue;
  }

  get formattedTime(): string {
    return this._time.formattedValue;
  }

  // Domain business logic methods

  /**
   * Update doctor ID for this schedule
   */
  updateDoctorId(newDoctorId: string | DoctorId): Schedule {
    if (!newDoctorId) {
      throw new Error('Doctor ID cannot be empty');
    }

    const doctorId = newDoctorId instanceof DoctorId ? newDoctorId : new DoctorId(newDoctorId);
    return this.createCopy({ doctorId });
  }

  /**
   * Reschedule to a new date
   */
  rescheduleDate(newDate: string | Date | ScheduleDate): Schedule {
    const scheduleDate = newDate instanceof ScheduleDate ? newDate : new ScheduleDate(newDate);
    return this.createCopy({ date: scheduleDate });
  }

  /**
   * Change the scheduled time
   */
  changeTime(newTime: string | ScheduleTime): Schedule {
    const scheduleTime = newTime instanceof ScheduleTime ? newTime : new ScheduleTime(newTime);
    return this.createCopy({ time: scheduleTime });
  }

  /**
   * Reschedule both date and time
   */
  reschedule(newDate: string | Date | ScheduleDate, newTime: string | ScheduleTime): Schedule {
    const scheduleDate = newDate instanceof ScheduleDate ? newDate : new ScheduleDate(newDate);
    const scheduleTime = newTime instanceof ScheduleTime ? newTime : new ScheduleTime(newTime);
    
    return this.createCopy({ 
      date: scheduleDate, 
      time: scheduleTime 
    });
  }

  /**
   * Check if this schedule is for today
   */
  isToday(): boolean {
    return this._date.isToday();
  }

  /**
   * Check if this schedule is in the future
   */
  isFuture(): boolean {
    if (this._date.isFuture()) {
      return true;
    }

    // If it's today, check if the time hasn't passed yet
    if (this._date.isToday()) {
      const now = new Date();
      const currentTime = new ScheduleTime(`${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`);
      return this._time.isAfter(currentTime);
    }

    return false;
  }

  /**
   * Check if this schedule conflicts with another schedule for the same doctor
   */
  conflictsWith(other: Schedule): boolean {
    // Different doctors can't conflict
    if (!this._doctorId.equals(other._doctorId)) {
      return false;
    }

    // Different dates can't conflict
    if (!this._date.equals(other._date)) {
      return false;
    }

    // Same time is a direct conflict
    if (this._time.equals(other._time)) {
      return true;
    }

    // Check if times are too close (e.g., within 30 minutes)
    const minGapMinutes = 30;
    return this._time.minutesBetween(other._time) < minGapMinutes;
  }

  /**
   * Get a summary string for this schedule
   */
  getSummary(): string {
    return `Doctor ${this._doctorId.value} scheduled for ${this.formattedDate} at ${this.formattedTime}`;
  }

  /**
   * Creates a copy of this schedule with modified properties
   * Immutable entity pattern - all changes create new instances
   */
  private createCopy(updates: {
    doctorId?: DoctorId;
    date?: ScheduleDate;
    time?: ScheduleTime;
  }): Schedule {
    return new Schedule(
      updates.doctorId || this._doctorId,
      updates.date || this._date,
      updates.time || this._time,
      this._id,
      this._createdAt,
      new Date() // Update the updatedAt timestamp
    );
  }

  /**
   * Domain equality comparison based on business identity
   */
  equals(other: Schedule): boolean {
    if (!this._id || !other._id) {
      return false;
    }
    return this._id.equals(other._id);
  }

  /**
   * Validates business invariants
   */
  validate(): void {
    if (!this._doctorId || !this._doctorId.value.trim()) {
      throw new Error('Schedule must have a valid doctor ID');
    }

    if (!this._date) {
      throw new Error('Schedule must have a valid date');
    }

    if (!this._time) {
      throw new Error('Schedule must have a valid time');
    }

    // Additional business rule: ensure the schedule is not in the past
    if (!this.isFuture() && !this.isToday()) {
      throw new Error('Cannot create schedule for past dates/times');
    }
  }

  /**
   * Create a schedule for testing purposes that bypasses validation
   */
  static createUnsafe(
    doctorId: string | DoctorId,
    date: string | Date | ScheduleDate,
    time: string | ScheduleTime,
    id?: string | ScheduleId,
    createdAt?: Date,
    updatedAt?: Date
  ): Schedule {
    const schedule = Object.create(Schedule.prototype);
    schedule._doctorId = doctorId instanceof DoctorId ? doctorId : new DoctorId(doctorId);
    schedule._date = date instanceof ScheduleDate ? date : ScheduleDate.createUnsafe(new Date(date));
    schedule._time = time instanceof ScheduleTime ? time : new ScheduleTime(time);
    schedule._id = id instanceof ScheduleId ? id : id ? new ScheduleId(id) : undefined;
    schedule._createdAt = createdAt || new Date();
    schedule._updatedAt = updatedAt;
    return schedule;
  }
}

export type { ISchedule };