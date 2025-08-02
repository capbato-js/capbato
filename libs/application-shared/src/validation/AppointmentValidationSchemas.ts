import { z } from 'zod';

/**
 * Zod schemas for Appointment form validation
 * These schemas define the validation rules and generate TypeScript types
 */

// Appointment validation error messages
export const APPOINTMENT_VALIDATION_ERRORS = {
  MISSING_PATIENT_NAME: 'Patient name is required',
  MISSING_REASON_FOR_VISIT: 'Reason for visit is required',
  MISSING_DATE: 'Appointment date is required',
  MISSING_TIME: 'Appointment time is required',
  MISSING_DOCTOR: 'Doctor selection is required',
  INVALID_DATE_FORMAT: 'Invalid date format. Use YYYY-MM-DD',
  PAST_DATE: 'Appointment date cannot be in the past',
  FUTURE_DATE_LIMIT: 'Appointment date cannot be more than 6 months in the future',
  INVALID_TIME_FORMAT: 'Invalid time format. Use HH:MM AM/PM',
  PAST_TIME: 'Appointment time cannot be in the past for today',
} as const;

// Enhanced date validation
const validateAppointmentDate = (date: string, ctx: z.RefinementCtx) => {
  // Check if date is provided
  if (!date || date.trim() === '') {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: APPOINTMENT_VALIDATION_ERRORS.MISSING_DATE,
    });
    return;
  }

  // Check if it's a valid date format
  const parsedDate = new Date(date);
  if (isNaN(parsedDate.getTime())) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: APPOINTMENT_VALIDATION_ERRORS.INVALID_DATE_FORMAT,
    });
    return;
  }

  // Check if date is not in the past
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const appointmentDate = new Date(date);
  appointmentDate.setHours(0, 0, 0, 0);

  if (appointmentDate < today) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: APPOINTMENT_VALIDATION_ERRORS.PAST_DATE,
    });
    return;
  }

  // Check if date is not too far in the future (6 months)
  const maxFutureDate = new Date();
  maxFutureDate.setMonth(maxFutureDate.getMonth() + 6);

  if (parsedDate > maxFutureDate) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: APPOINTMENT_VALIDATION_ERRORS.FUTURE_DATE_LIMIT,
    });
    return;
  }
};

// Enhanced time validation
const validateAppointmentTime = (time: string, ctx: z.RefinementCtx) => {
  // Check if time is provided
  if (!time || time.trim() === '') {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: APPOINTMENT_VALIDATION_ERRORS.MISSING_TIME,
    });
    return;
  }

  // Check time format (HH:MM)
  const timeRegex = /^([0-1]?[0-9]|2[0-3]):([0-5][0-9])$/;
  if (!timeRegex.test(time.trim())) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: APPOINTMENT_VALIDATION_ERRORS.INVALID_TIME_FORMAT,
    });
    return;
  }
};

// Patient name validation
const validatePatientName = (name: string, ctx: z.RefinementCtx) => {
  if (!name || name.trim() === '') {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: APPOINTMENT_VALIDATION_ERRORS.MISSING_PATIENT_NAME,
    });
    return;
  }

  if (name.trim().length < 2) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Patient name must be at least 2 characters',
    });
    return;
  }

  if (name.length > 100) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Patient name cannot exceed 100 characters',
    });
    return;
  }
};

// Reason for visit validation
const validateReasonForVisit = (reason: string, ctx: z.RefinementCtx) => {
  if (!reason || reason.trim() === '') {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: APPOINTMENT_VALIDATION_ERRORS.MISSING_REASON_FOR_VISIT,
    });
    return;
  }

  if (reason.trim().length < 3) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Reason for visit must be at least 3 characters',
    });
    return;
  }

  if (reason.length > 200) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Reason for visit cannot exceed 200 characters',
    });
    return;
  }
};

// Doctor validation
const validateDoctor = (doctor: string, ctx: z.RefinementCtx) => {
  if (!doctor || doctor.trim() === '') {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: APPOINTMENT_VALIDATION_ERRORS.MISSING_DOCTOR,
    });
    return;
  }
};

// Base validation schemas
export const PatientNameSchema = z.string().superRefine(validatePatientName);
export const ReasonForVisitSchema = z.string().superRefine(validateReasonForVisit);
export const AppointmentDateSchema = z.string().superRefine(validateAppointmentDate);
export const AppointmentTimeSchema = z.string().superRefine(validateAppointmentTime);
export const DoctorSchema = z.string().superRefine(validateDoctor);

// Add Appointment form validation schema
export const AddAppointmentFormSchema = z.object({
  patientName: PatientNameSchema,
  reasonForVisit: ReasonForVisitSchema,
  date: AppointmentDateSchema,
  time: AppointmentTimeSchema,
  doctor: DoctorSchema,
});

// Inferred TypeScript types from Zod schemas
export type AddAppointmentFormData = z.infer<typeof AddAppointmentFormSchema>;

// Export all schemas as a collection for easier importing
export const AppointmentValidationSchemas = {
  AddAppointmentFormSchema,
  PatientNameSchema,
  ReasonForVisitSchema,
  AppointmentDateSchema,
  AppointmentTimeSchema,
  DoctorSchema,
} as const;
