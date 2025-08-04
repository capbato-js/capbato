import { AppointmentId } from '../value-objects/AppointmentId';
import { AppointmentStatus, type AppointmentStatusType } from '../value-objects/AppointmentStatus';
import { AppointmentTime } from '../value-objects/AppointmentTime';
import { 
  AppointmentAlreadyCancelledException,
  AppointmentAlreadyConfirmedException,
  AppointmentAlreadyCompletedException,
  PastAppointmentDateException
} from '../exceptions/DomainExceptions';

interface IAppointment {
  id?: AppointmentId;
  patientId: string;
  reasonForVisit: string;
  appointmentDate: Date;
  appointmentTime: AppointmentTime;
  status: AppointmentStatus;
  doctorId: string;
  createdAt: Date;
  updatedAt?: Date;
}

export class Appointment implements IAppointment {
  private readonly _id?: AppointmentId;
  private readonly _patientId: string;
  private readonly _reasonForVisit: string;
  private readonly _appointmentDate: Date;
  private readonly _appointmentTime: AppointmentTime;
  private readonly _status: AppointmentStatus;
  private readonly _doctorId: string;
  private readonly _createdAt: Date;
  private readonly _updatedAt?: Date;

  constructor(
    patientId: string,
    reasonForVisit: string,
    appointmentDate: Date,
    appointmentTime: string | AppointmentTime,
    doctorId: string,
    status: AppointmentStatusType = 'confirmed',
    id?: string | AppointmentId,
    createdAt = new Date(),
    updatedAt?: Date
  ) {
    // Validate appointment date is not in the past
    if (appointmentDate < new Date(new Date().toDateString())) {
      throw new PastAppointmentDateException('Cannot create appointment for past date');
    }

    this._id = id instanceof AppointmentId ? id : id ? new AppointmentId(id) : undefined;
    this._patientId = patientId;
    this._reasonForVisit = reasonForVisit;
    this._appointmentDate = appointmentDate;
    this._appointmentTime = appointmentTime instanceof AppointmentTime 
      ? appointmentTime 
      : new AppointmentTime(appointmentTime);
    this._status = new AppointmentStatus(status);
    this._doctorId = doctorId;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
  }

  // Getters
  get id(): AppointmentId | undefined {
    return this._id;
  }

  get patientId(): string {
    return this._patientId;
  }

  get reasonForVisit(): string {
    return this._reasonForVisit;
  }

  get appointmentDate(): Date {
    return this._appointmentDate;
  }

  get appointmentTime(): AppointmentTime {
    return this._appointmentTime;
  }

  get status(): AppointmentStatus {
    return this._status;
  }

  get doctorId(): string {
    return this._doctorId;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date | undefined {
    return this._updatedAt;
  }

  // For backwards compatibility with existing code that expects string ID
  get stringId(): string | undefined {
    return this._id?.value;
  }

  get statusValue(): AppointmentStatusType {
    return this._status.value;
  }

  get timeValue(): string {
    return this._appointmentTime.value;
  }

  // Domain business logic methods
  confirm(): Appointment {
    if (this._status.value === 'confirmed') {
      throw new AppointmentAlreadyConfirmedException('Appointment is already confirmed');
    }

    // Allow confirming cancelled appointments (for reconfirm functionality)
    // Only prevent confirming completed appointments as they should stay completed
    if (this._status.value === 'completed') {
      throw new AppointmentAlreadyCompletedException('Cannot confirm a completed appointment');
    }

    return this.createCopy({ status: new AppointmentStatus('confirmed') });
  }

  cancel(): Appointment {
    if (this._status.value === 'cancelled') {
      throw new AppointmentAlreadyCancelledException('Appointment is already cancelled');
    }

    return this.createCopy({ status: new AppointmentStatus('cancelled') });
  }

  complete(): Appointment {
    if (this._status.value === 'completed') {
      throw new AppointmentAlreadyCompletedException('Appointment is already completed');
    }

    if (this._status.value === 'cancelled') {
      throw new AppointmentAlreadyCancelledException('Cannot complete a cancelled appointment');
    }

    return this.createCopy({ 
      status: new AppointmentStatus('completed'),
      updatedAt: new Date()
    });
  }

  reschedule(newDate: Date, newTime: string | AppointmentTime): Appointment {
    // Validate new appointment date is not in the past
    if (newDate < new Date(new Date().toDateString())) {
      throw new PastAppointmentDateException('Cannot reschedule appointment to past date');
    }

    const appointmentTime = newTime instanceof AppointmentTime 
      ? newTime 
      : new AppointmentTime(newTime);

    return this.createCopy({
      appointmentDate: newDate,
      appointmentTime,
      status: new AppointmentStatus('confirmed'),
      updatedAt: new Date()
    });
  }

  updateDetails(
    reasonForVisit?: string,
    doctorId?: string
  ): Appointment {
    return this.createCopy({
      reasonForVisit: reasonForVisit ?? this._reasonForVisit,
      doctorId: doctorId ?? this._doctorId,
      updatedAt: new Date()
    });
  }

  /**
   * Validates business rules for the appointment
   */
  validate(): void {
    // Additional business validations can be added here
    if (!this._reasonForVisit.trim()) {
      throw new Error('Reason for visit is required');
    }

    if (!this._patientId || this._patientId.trim().length === 0) {
      throw new Error('Valid patient ID is required');
    }

    if (!this._doctorId || this._doctorId.trim().length === 0) {
      throw new Error('Valid doctor ID is required');
    }
  }

  /**
   * Checks if appointment is on the specified date
   */
  isOnDate(date: Date): boolean {
    return this._appointmentDate.toDateString() === date.toDateString();
  }

  /**
   * Checks if appointment is today
   */
  isToday(): boolean {
    return this.isOnDate(new Date());
  }

  /**
   * Checks if appointment is confirmed
   */
  isConfirmed(): boolean {
    return this._status.value === 'confirmed';
  }

  /**
   * Checks if appointment is cancelled
   */
  isCancelled(): boolean {
    return this._status.value === 'cancelled';
  }

  /**
   * Checks if appointment is completed
   */
  isCompleted(): boolean {
    return this._status.value === 'completed';
  }

  /**
   * Checks if appointment is scheduled (not confirmed or cancelled)
   */
  isScheduled(): boolean {
    return this._status.value === 'confirmed';
  }

  /**
   * Creates a copy of the appointment with updated properties
   */
  private createCopy(updates: {
    id?: AppointmentId;
    patientId?: string;
    reasonForVisit?: string;
    appointmentDate?: Date;
    appointmentTime?: AppointmentTime;
    status?: AppointmentStatus;
    doctorId?: string;
    createdAt?: Date;
    updatedAt?: Date;
  }): Appointment {
    return new Appointment(
      updates.patientId ?? this._patientId,
      updates.reasonForVisit ?? this._reasonForVisit,
      updates.appointmentDate ?? this._appointmentDate,
      updates.appointmentTime ?? this._appointmentTime,
      updates.doctorId ?? this._doctorId,
      updates.status?.value ?? this._status.value,
      updates.id ?? this._id,
      updates.createdAt ?? this._createdAt,
      updates.updatedAt ?? this._updatedAt
    );
  }

  /**
   * Converts the appointment to a plain object
   */
  toPlainObject(): Record<string, any> {
    return {
      id: this.stringId,
      patientId: this._patientId,
      reasonForVisit: this._reasonForVisit,
      appointmentDate: this._appointmentDate,
      appointmentTime: this._appointmentTime.value,
      status: this._status.value,
      doctorId: this._doctorId,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt
    };
  }

  /**
   * Creates an appointment from a plain object
   */
  static fromPlainObject(data: Record<string, any>): Appointment {
    return new Appointment(
      data['patientId'],
      data['reasonForVisit'],
      data['appointmentDate'],
      data['appointmentTime'],
      data['doctorId'],
      data['status'],
      data['id'],
      data['createdAt'],
      data['updatedAt']
    );
  }

  /**
   * Compares two appointments for equality
   */
  equals(other: Appointment): boolean {
    return this.stringId === other.stringId;
  }
}
