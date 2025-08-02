import { DomainException } from './DomainExceptions';

/**
 * Exception thrown when an appointment ID is invalid
 */
export class InvalidAppointmentIdException extends DomainException {
  constructor(message: string = 'Invalid appointment ID') {
    super(message, 'INVALID_APPOINTMENT_ID', 400);
  }
}

/**
 * Exception thrown when an appointment is not found
 */
export class AppointmentNotFoundException extends DomainException {
  constructor(message: string = 'Appointment not found') {
    super(message, 'APPOINTMENT_NOT_FOUND', 404);
  }
}

/**
 * Exception thrown when trying to confirm an already confirmed appointment
 */
export class AppointmentAlreadyConfirmedException extends DomainException {
  constructor(message: string = 'Appointment is already confirmed') {
    super(message, 'APPOINTMENT_ALREADY_CONFIRMED', 400);
  }
}

/**
 * Exception thrown when trying to cancel an already cancelled appointment
 */
export class AppointmentAlreadyCancelledException extends DomainException {
  constructor(message: string = 'Appointment is already cancelled') {
    super(message, 'APPOINTMENT_ALREADY_CANCELLED', 400);
  }
}

/**
 * Exception thrown when trying to create appointment with past date
 */
export class PastAppointmentDateException extends DomainException {
  constructor(message: string = 'Cannot create appointment for past date') {
    super(message, 'PAST_APPOINTMENT_DATE', 400);
  }
}

/**
 * Exception thrown when appointment time format is invalid
 */
export class InvalidAppointmentTimeException extends DomainException {
  constructor(message: string = 'Invalid appointment time format') {
    super(message, 'INVALID_APPOINTMENT_TIME', 400);
  }
}

/**
 * Exception thrown when appointment status is invalid
 */
export class InvalidAppointmentStatusException extends DomainException {
  constructor(message: string = 'Invalid appointment status') {
    super(message, 'INVALID_APPOINTMENT_STATUS', 400);
  }
}

/**
 * Exception thrown when time slot is already booked
 */
export class TimeSlotUnavailableException extends DomainException {
  constructor(message: string = 'Time slot is already booked') {
    super(message, 'TIME_SLOT_UNAVAILABLE', 409);
  }
}

/**
 * Exception thrown when patient already has appointment on the same date
 */
export class DuplicateAppointmentException extends DomainException {
  constructor(message: string = 'Patient already has an appointment on this date') {
    super(message, 'DUPLICATE_APPOINTMENT', 409);
  }
}

/**
 * Exception thrown when patient does not exist
 */
export class PatientNotExistsException extends DomainException {
  constructor(message: string = 'Patient does not exist in the database') {
    super(message, 'PATIENT_NOT_EXISTS', 400);
  }
}
