/**
 * Configuration for appointment form options and defaults
 */

export const REASONS_FOR_VISIT_OPTIONS = [
  { value: 'Consultation', label: 'Consultation' },
  { value: 'Laboratory: Blood chemistry', label: 'Laboratory: Blood chemistry' },
  { value: 'Laboratory: Hematology', label: 'Laboratory: Hematology' },
  { value: 'Laboratory: Serology & Immunology', label: 'Laboratory: Serology & Immunology' },
  { value: 'Laboratory: Urinalysis', label: 'Laboratory: Urinalysis' },
  { value: 'Laboratory: Fecalysis', label: 'Laboratory: Fecalysis' },
  { value: 'Prescription', label: 'Prescription' },
  { value: 'Follow-up check-up', label: 'Follow-up check-up' },
  { value: 'Medical Certificate', label: 'Medical Certificate' },
] as const;

/**
 * Time slot configuration
 */
export const TIME_SLOT_CONFIG = {
  START_HOUR: 8,
  END_HOUR: 17,
  INTERVAL_MINUTES: [0, 15, 30, 45],
} as const;

/**
 * Form field labels and messages
 */
export const FORM_LABELS = {
  PATIENT_NAME: 'Patient Name',
  REASON_FOR_VISIT: 'Reason for Visit',
  APPOINTMENT_DATE: 'Appointment Date',
  APPOINTMENT_TIME: 'Appointment Time',
  ASSIGNED_DOCTOR: 'Assigned Doctor',
} as const;

export const FORM_PLACEHOLDERS = {
  PATIENT_NAME: 'Search and select patient',
  REASON_FOR_VISIT: 'Select reason for visit',
  APPOINTMENT_DATE: 'Select appointment date',
  APPOINTMENT_TIME: 'Select available time',
} as const;

export const FORM_MESSAGES = {
  EDIT_MODE: {
    PATIENT_READONLY: 'Patient information cannot be changed when modifying an appointment',
    RESCHEDULE_PATIENT_READONLY: 'Patient information is readonly when rescheduling',
    RESCHEDULE_REASON_READONLY: 'Reason for visit is readonly when rescheduling',
    RESCHEDULE_DATE_READONLY: 'Date is readonly when rescheduling - only time can be changed',
  },
  DOCTOR_ASSIGNMENT: {
    NO_DOCTOR: 'No doctor is scheduled for this day. Please select a different date or contact an administrator.',
    ERROR: 'There was an issue determining doctor availability. Please try selecting the date again or contact support.',
  },
  LOADING: {
    CREATING: 'Creating Appointment...',
    UPDATING: 'Updating Appointment...',
  },
  BUTTONS: {
    CREATE: 'Create Appointment',
    UPDATE: 'Update Appointment',
  }
} as const;

/**
 * Form validation messages
 */
export const VALIDATION_MESSAGES = {
  REQUIRED_FIELD: 'This field is required',
  INVALID_DATE: 'Please select a valid date',
  INVALID_TIME: 'Please select a valid time',
  PAST_DATE: 'Appointment date cannot be in the past',
} as const;