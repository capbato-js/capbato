import { z } from 'zod';

/**
 * Zod schemas for Appointment validation
 * These schemas define validation rules for both form validation and API commands
 * and generate TypeScript types for the entire appointment system
 */

// Centralized appointment validation error messages
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

// Base Appointment validation schemas
export const AppointmentStatusSchema = z.enum(['scheduled', 'confirmed', 'cancelled', 'completed']);

// Appointment ID validation schema - Dashless UUID format  
export const AppointmentIdSchema = z.string()
  .min(1, 'Appointment ID cannot be empty')
  .regex(/^[0-9a-fA-F]{32}$/, 'Appointment ID must be a valid dashless UUID format (32 hexadecimal characters)');

// Enhanced date validation function
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

// Enhanced time validation function
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

// Enhanced patient name validation function
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

  if (name.length > 255) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Patient name cannot exceed 255 characters',
    });
    return;
  }
};

// Enhanced reason for visit validation function
const validateReasonForVisit = (reason: string, ctx: z.RefinementCtx) => {
  if (!reason || reason.trim() === '') {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: APPOINTMENT_VALIDATION_ERRORS.MISSING_REASON_FOR_VISIT,
    });
    return;
  }

  if (reason.trim().length < 5) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Reason for visit must be at least 5 characters',
    });
    return;
  }

  if (reason.length > 500) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Reason for visit cannot exceed 500 characters',
    });
    return;
  }
};

// Doctor validation function
const validateDoctor = (doctor: string, ctx: z.RefinementCtx) => {
  if (!doctor || doctor.trim() === '') {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: APPOINTMENT_VALIDATION_ERRORS.MISSING_DOCTOR,
    });
    return;
  }
};

// Base validation schemas for forms
export const PatientNameSchema = z.string().superRefine(validatePatientName);
export const ReasonForVisitSchema = z.string().superRefine(validateReasonForVisit);
export const AppointmentDateSchema = z.string().superRefine(validateAppointmentDate);
export const AppointmentTimeSchema = z.string().superRefine(validateAppointmentTime);
export const DoctorSchema = z.string().superRefine(validateDoctor);

// API-specific schemas with different validation
export const ApiAppointmentTimeSchema = z.string()
  .regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Time must be in HH:MM format (24-hour)');

export const ApiAppointmentDateSchema = z.string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format')
  .transform((val) => new Date(val))
  .refine((date) => {
    if (isNaN(date.getTime())) {
      return false;
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const appointmentDate = new Date(date);
    appointmentDate.setHours(0, 0, 0, 0);
    return appointmentDate >= today;
  }, 'Appointment date cannot be in the past');

// Form validation schemas
export const AddAppointmentFormSchema = z.object({
  patientName: PatientNameSchema,
  reasonForVisit: ReasonForVisitSchema,
  date: AppointmentDateSchema,
  time: AppointmentTimeSchema,
  doctor: DoctorSchema,
});

// API Command schemas
export const CreateAppointmentCommandSchema = z.object({
  patientId: z.string().min(1, 'Patient ID is required'),
  reasonForVisit: z.string().superRefine(validateReasonForVisit),
  appointmentDate: ApiAppointmentDateSchema,
  appointmentTime: ApiAppointmentTimeSchema,
  status: AppointmentStatusSchema.default('scheduled'),
  doctorId: z.string().min(1, 'Doctor ID is required'),
});

export const UpdateAppointmentCommandSchema = z.object({
  id: AppointmentIdSchema,
  patientId: z.string().min(1, 'Patient ID is required').optional(),
  reasonForVisit: z.string().superRefine(validateReasonForVisit).optional(),
  appointmentDate: ApiAppointmentDateSchema.optional(),
  appointmentTime: ApiAppointmentTimeSchema.optional(),
  status: AppointmentStatusSchema.optional(),
  doctorId: z.string().min(1, 'Doctor ID is required').optional(),
});

export const DeleteAppointmentCommandSchema = z.object({
  id: AppointmentIdSchema,
});

export const ConfirmAppointmentCommandSchema = z.object({
  id: AppointmentIdSchema,
});

export const CancelAppointmentCommandSchema = z.object({
  id: AppointmentIdSchema,
  reason: z.string().optional(),
});

export const RescheduleAppointmentCommandSchema = z.object({
  id: AppointmentIdSchema,
  appointmentDate: ApiAppointmentDateSchema,
  appointmentTime: ApiAppointmentTimeSchema,
});

// Query schemas
export const GetAppointmentByIdQuerySchema = z.object({
  id: AppointmentIdSchema,
});

export const GetAppointmentsByPatientIdQuerySchema = z.object({
  patientId: z.string().min(1, 'Patient ID is required'),
});

export const GetAppointmentsByDateQuerySchema = z.object({
  date: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format')
    .transform((val) => new Date(val)),
});

export const GetAppointmentsByDateRangeQuerySchema = z.object({
  startDate: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Start date must be in YYYY-MM-DD format')
    .transform((val) => new Date(val)),
  endDate: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'End date must be in YYYY-MM-DD format')
    .transform((val) => new Date(val)),
}).refine((data) => data.endDate >= data.startDate, {
  message: 'End date must be after or equal to start date',
  path: ['endDate'],
});

// TypeScript types generated from schemas
export type AddAppointmentFormData = z.infer<typeof AddAppointmentFormSchema>;
export type CreateAppointmentCommand = z.infer<typeof CreateAppointmentCommandSchema>;
export type UpdateAppointmentCommand = z.infer<typeof UpdateAppointmentCommandSchema>;
export type DeleteAppointmentCommand = z.infer<typeof DeleteAppointmentCommandSchema>;
export type ConfirmAppointmentCommand = z.infer<typeof ConfirmAppointmentCommandSchema>;
export type CancelAppointmentCommand = z.infer<typeof CancelAppointmentCommandSchema>;
export type RescheduleAppointmentCommand = z.infer<typeof RescheduleAppointmentCommandSchema>;
export type GetAppointmentByIdQuery = z.infer<typeof GetAppointmentByIdQuerySchema>;
export type GetAppointmentsByPatientIdQuery = z.infer<typeof GetAppointmentsByPatientIdQuerySchema>;
export type GetAppointmentsByDateQuery = z.infer<typeof GetAppointmentsByDateQuerySchema>;
export type GetAppointmentsByDateRangeQuery = z.infer<typeof GetAppointmentsByDateRangeQuerySchema>;

// Collection of all validation schemas
export const AppointmentValidationSchemas = {
  // Form schemas
  AddAppointmentFormSchema,
  PatientNameSchema,
  ReasonForVisitSchema,
  AppointmentDateSchema,
  AppointmentTimeSchema,
  DoctorSchema,
  
  // Command schemas
  CreateAppointmentCommandSchema,
  UpdateAppointmentCommandSchema,
  DeleteAppointmentCommandSchema,
  ConfirmAppointmentCommandSchema,
  CancelAppointmentCommandSchema,
  RescheduleAppointmentCommandSchema,
  
  // Query schemas
  GetAppointmentByIdQuerySchema,
  GetAppointmentsByPatientIdQuerySchema,
  GetAppointmentsByDateQuerySchema,
  GetAppointmentsByDateRangeQuerySchema,
  
  // Base schemas
  AppointmentStatusSchema,
  AppointmentIdSchema,
  ApiAppointmentTimeSchema,
  ApiAppointmentDateSchema,
} as const;