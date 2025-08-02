import { DomainException } from '@nx-starter/domain';

/**
 * Domain exceptions for Patient operations
 * These provide specific error types that can be handled appropriately in the presentation layer
 */

export class PatientDomainError extends DomainException {
  constructor(message: string, code: string, statusCode = 400) {
    super(message, code, statusCode);
    this.name = 'PatientDomainError';
  }
}

export class PatientNotFoundError extends PatientDomainError {
  constructor(patientId: string) {
    super(`Patient with ID '${patientId}' not found`, 'PATIENT_NOT_FOUND', 404);
    this.name = 'PatientNotFoundError';
  }
}

export class InvalidPhoneNumberError extends PatientDomainError {
  constructor(phoneNumber: string, fieldName = 'Contact number') {
    super(
      `${fieldName} '${phoneNumber}' is invalid. Must be 11 digits starting with 09 (e.g., 09278479061)`,
      'INVALID_PHONE_NUMBER'
    );
    this.name = 'InvalidPhoneNumberError';
  }
}

export class InvalidDateOfBirthError extends PatientDomainError {
  constructor(dateOfBirth: string) {
    super(`Date of birth '${dateOfBirth}' is invalid`, 'INVALID_DATE_OF_BIRTH');
    this.name = 'InvalidDateOfBirthError';
  }
}

export class DuplicatePatientError extends PatientDomainError {
  constructor(identifier: string, type: 'patientNumber' | 'contactNumber' = 'patientNumber') {
    const message = type === 'patientNumber' 
      ? `Patient with patient number '${identifier}' already exists`
      : `Patient with contact number '${identifier}' already exists`;
    
    super(message, 'DUPLICATE_PATIENT', 409);
    this.name = 'DuplicatePatientError';
  }
}

export class InvalidPatientDataError extends PatientDomainError {
  constructor(message: string, public readonly field?: string) {
    super(message, 'INVALID_PATIENT_DATA', 400);
    this.name = 'InvalidPatientDataError';
  }
}

export class PatientNumberGenerationError extends PatientDomainError {
  constructor(lastName: string) {
    super(`Failed to generate patient number for last name '${lastName}'`, 'PATIENT_NUMBER_GENERATION_ERROR', 500);
    this.name = 'PatientNumberGenerationError';
  }
}

export class GuardianValidationError extends PatientDomainError {
  constructor(message: string) {
    super(`Guardian information validation failed: ${message}`, 'GUARDIAN_VALIDATION_ERROR', 400);
    this.name = 'GuardianValidationError';
  }
}

// Type guard functions for error handling
export const isPatientDomainError = (error: unknown): error is PatientDomainError => {
  return error instanceof PatientDomainError;
};

export const isPatientNotFoundError = (error: unknown): error is PatientNotFoundError => {
  return error instanceof PatientNotFoundError;
};

export const isInvalidPhoneNumberError = (error: unknown): error is InvalidPhoneNumberError => {
  return error instanceof InvalidPhoneNumberError;
};

export const isDuplicatePatientError = (error: unknown): error is DuplicatePatientError => {
  return error instanceof DuplicatePatientError;
};

// Error mapping for HTTP status codes
export const getHttpStatusForPatientError = (error: PatientDomainError): number => {
  switch (error.code) {
    case 'PATIENT_NOT_FOUND':
      return 404;
    case 'DUPLICATE_PATIENT':
      return 409; // Conflict
    case 'INVALID_PHONE_NUMBER':
    case 'INVALID_DATE_OF_BIRTH':
    case 'INVALID_PATIENT_DATA':
    case 'GUARDIAN_VALIDATION_ERROR':
      return 400; // Bad Request
    case 'PATIENT_NUMBER_GENERATION_ERROR':
      return 500; // Internal Server Error
    default:
      return 400; // Default to Bad Request
  }
};