import { z } from 'zod';

/**
 * Zod schemas for Prescription validation
 * These schemas define validation rules for both form validation and API commands
 * and generate TypeScript types for the entire prescription system
 */

// Centralized prescription validation error messages
export const PRESCRIPTION_VALIDATION_ERRORS = {
  MISSING_PATIENT: 'Patient selection is required',
  MISSING_DOCTOR: 'Doctor selection is required',
  MISSING_DATE: 'Prescription date is required',
  MISSING_MEDICATIONS: 'At least one medication is required',
  INVALID_DATE_FORMAT: 'Invalid date format. Use YYYY-MM-DD',
  FUTURE_DATE: 'Prescription date cannot be in the future',
  INVALID_MEDICATION_NAME: 'Medication name is required',
  INVALID_DOSAGE: 'Dosage is required',
  INVALID_FREQUENCY: 'Frequency is required',
  INVALID_DURATION: 'Duration is required',
  MEDICATION_NAME_TOO_SHORT: 'Medication name must be at least 2 characters',
  MEDICATION_NAME_TOO_LONG: 'Medication name cannot exceed 200 characters',
  MEDICATION_NAME_INVALID_CHARS: 'Medication name contains invalid characters. Only letters, numbers, spaces, hyphens, and parentheses are allowed',
  DOSAGE_TOO_SHORT: 'Dosage must be at least 2 characters',
  DOSAGE_TOO_LONG: 'Dosage cannot exceed 100 characters',
  DOSAGE_MUST_START_WITH_NUMBER: 'Dosage must start with a number',
  INSTRUCTIONS_TOO_SHORT: 'Instructions must be at least 3 characters when provided',
  INSTRUCTIONS_TOO_LONG: 'Instructions cannot exceed 1000 characters',
  EXPIRY_AFTER_PRESCRIBED: 'Expiry date must be after prescribed date',
  INVALID_UUID: 'Invalid ID format. Must be a valid UUID',
  INVALID_DATETIME: 'Invalid date format. Must be ISO datetime',
  UPDATE_REQUIRES_FIELDS: 'At least one field must be provided for update',
} as const;

// Enhanced medication name validation with specific error messages
const validateMedicationName = (medicationName: string, ctx: z.RefinementCtx) => {
  // Check if medication name is provided (not undefined/null)
  if (medicationName === undefined || medicationName === null) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: PRESCRIPTION_VALIDATION_ERRORS.INVALID_MEDICATION_NAME,
    });
    return;
  }

  // Check if medication name is empty string
  if (medicationName === '') {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: PRESCRIPTION_VALIDATION_ERRORS.INVALID_MEDICATION_NAME,
    });
    return;
  }

  // Check if medication name becomes empty after trimming (whitespace only)
  if (medicationName.trim() === '') {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: PRESCRIPTION_VALIDATION_ERRORS.INVALID_MEDICATION_NAME,
    });
    return;
  }

  // Check minimum length (after trimming)
  if (medicationName.trim().length < 2) {
    ctx.addIssue({
      code: z.ZodIssueCode.too_small,
      message: PRESCRIPTION_VALIDATION_ERRORS.MEDICATION_NAME_TOO_SHORT,
      minimum: 2,
      origin: 'string',
      inclusive: true,
      input: medicationName,
    });
    return;
  }

  // Check maximum length (after trimming)
  if (medicationName.trim().length > 200) {
    ctx.addIssue({
      code: z.ZodIssueCode.too_big,
      message: PRESCRIPTION_VALIDATION_ERRORS.MEDICATION_NAME_TOO_LONG,
      maximum: 200,
      origin: 'string',
      inclusive: true,
      input: medicationName,
    });
    return;
  }

  // Check for valid characters
  const medicationNamePattern = /^[a-zA-Z0-9\s\-()./,]+$/;
  if (!medicationNamePattern.test(medicationName.trim())) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: PRESCRIPTION_VALIDATION_ERRORS.MEDICATION_NAME_INVALID_CHARS,
    });
  }
};

// Enhanced dosage validation
const validateDosage = (dosage: string, ctx: z.RefinementCtx) => {
  if (dosage === undefined || dosage === null || dosage.trim() === '') {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: PRESCRIPTION_VALIDATION_ERRORS.INVALID_DOSAGE,
    });
    return;
  }

  if (dosage.trim().length < 2) {
    ctx.addIssue({
      code: z.ZodIssueCode.too_small,
      message: PRESCRIPTION_VALIDATION_ERRORS.DOSAGE_TOO_SHORT,
      minimum: 2,
      origin: 'string',
      inclusive: true,
      input: dosage,
    });
    return;
  }

  if (dosage.trim().length > 100) {
    ctx.addIssue({
      code: z.ZodIssueCode.too_big,
      message: PRESCRIPTION_VALIDATION_ERRORS.DOSAGE_TOO_LONG,
      maximum: 100,
      origin: 'string',
      inclusive: true,
      input: dosage,
    });
    return;
  }

  // Must start with a number
  const flexibleDosagePattern = /^[0-9].*$/;
  if (!flexibleDosagePattern.test(dosage.trim())) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: PRESCRIPTION_VALIDATION_ERRORS.DOSAGE_MUST_START_WITH_NUMBER,
    });
  }
};

// Enhanced instructions validation (optional field)
const validateInstructions = (instructions: string, ctx: z.RefinementCtx) => {
  // Instructions are now optional - skip validation if empty
  if (instructions === undefined || instructions === null || instructions.trim() === '') {
    return; // Allow empty instructions
  }

  if (instructions.trim().length < 3) {
    ctx.addIssue({
      code: z.ZodIssueCode.too_small,
      message: PRESCRIPTION_VALIDATION_ERRORS.INSTRUCTIONS_TOO_SHORT,
      minimum: 3,
      origin: 'string',
      inclusive: true,
      input: instructions,
    });
    return;
  }

  if (instructions.trim().length > 1000) {
    ctx.addIssue({
      code: z.ZodIssueCode.too_big,
      message: PRESCRIPTION_VALIDATION_ERRORS.INSTRUCTIONS_TOO_LONG,
      maximum: 1000,
      origin: 'string',
      inclusive: true,
      input: instructions,
    });
  }
};

// Enhanced date validation function
const validatePrescriptionDate = (date: string, ctx: z.RefinementCtx) => {
  // Check if date is provided
  if (!date || date.trim() === '') {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: PRESCRIPTION_VALIDATION_ERRORS.MISSING_DATE,
    });
    return;
  }

  // Check if it's a valid date format
  const parsedDate = new Date(date);
  if (isNaN(parsedDate.getTime())) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: PRESCRIPTION_VALIDATION_ERRORS.INVALID_DATE_FORMAT,
    });
    return;
  }

  // Check if date is not in the future
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const prescriptionDate = new Date(date);
  prescriptionDate.setHours(0, 0, 0, 0);

  if (prescriptionDate > today) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: PRESCRIPTION_VALIDATION_ERRORS.FUTURE_DATE,
    });
  }
};

// Flexible ID validation schema that supports both UUID and dashless UUID formats
export const PrescriptionIdSchema = z.string()
  .min(1, 'Prescription ID cannot be empty')
  .refine((id) => {
    // Support both UUID format (with dashes) and dashless UUID format
    const uuidPattern = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
    const dashlessUuidPattern = /^[0-9a-fA-F]{32}$/;
    return uuidPattern.test(id) || dashlessUuidPattern.test(id);
  }, {
    message: PRESCRIPTION_VALIDATION_ERRORS.INVALID_UUID,
  });

// Generic ID schema for patientId and doctorId that supports both formats
export const FlexibleIdSchema = z.string()
  .min(1, 'ID is required')
  .refine((id) => {
    // Support both UUID format (with dashes) and dashless UUID format
    const uuidPattern = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
    const dashlessUuidPattern = /^[0-9a-fA-F]{32}$/;
    return uuidPattern.test(id) || dashlessUuidPattern.test(id);
  }, {
    message: PRESCRIPTION_VALIDATION_ERRORS.INVALID_UUID,
  });

// Medication validation schema for forms (with frequency and duration)
export const MedicationSchema = z.object({
  id: z.string().optional(),
  name: z.string()
    .min(1, PRESCRIPTION_VALIDATION_ERRORS.INVALID_MEDICATION_NAME)
    .max(100, 'Medication name must be 100 characters or less'),
  dosage: z.string()
    .min(1, PRESCRIPTION_VALIDATION_ERRORS.INVALID_DOSAGE)
    .max(50, 'Dosage must be 50 characters or less'),
  frequency: z.string()
    .min(1, PRESCRIPTION_VALIDATION_ERRORS.INVALID_FREQUENCY)
    .max(50, 'Frequency must be 50 characters or less'),
  duration: z.string()
    .min(1, PRESCRIPTION_VALIDATION_ERRORS.INVALID_DURATION)
    .max(50, 'Duration must be 50 characters or less'),
  instructions: z.string()
    .max(500, 'Instructions must be 500 characters or less')
    .optional(),
});

// Add Prescription Form Schema (Frontend UI)
export const AddPrescriptionFormSchema = z.object({
  patientId: z.string()
    .min(1, PRESCRIPTION_VALIDATION_ERRORS.MISSING_PATIENT),
  doctorId: z.string()
    .min(1, PRESCRIPTION_VALIDATION_ERRORS.MISSING_DOCTOR),
  datePrescribed: z.string()
    .min(1, PRESCRIPTION_VALIDATION_ERRORS.MISSING_DATE)
    .superRefine(validatePrescriptionDate),
  medications: z.array(MedicationSchema)
    .min(1, PRESCRIPTION_VALIDATION_ERRORS.MISSING_MEDICATIONS),
  notes: z.string()
    .max(1000, 'Notes must be 1000 characters or less')
    .optional(),
});

// Update Prescription Form Schema (Frontend UI)
export const UpdatePrescriptionFormSchema = AddPrescriptionFormSchema.extend({
  id: PrescriptionIdSchema,
});

// Create Prescription Command Schema (Backend API)
export const CreatePrescriptionCommandSchema = z
  .object({
    patientId: FlexibleIdSchema,
    doctorId: FlexibleIdSchema,
    medications: z.array(z.object({
      medicationName: z.string().superRefine(validateMedicationName),
      dosage: z.string().superRefine(validateDosage),
      instructions: z.string().optional().superRefine((val, ctx) => {
        if (val !== undefined) {
          validateInstructions(val, ctx);
        }
      }),
      frequency: z.string().min(1, PRESCRIPTION_VALIDATION_ERRORS.INVALID_FREQUENCY).max(100, 'Frequency must be 100 characters or less'),
      duration: z.string().min(1, PRESCRIPTION_VALIDATION_ERRORS.INVALID_DURATION).max(100, 'Duration must be 100 characters or less'),
    })).min(1, PRESCRIPTION_VALIDATION_ERRORS.MISSING_MEDICATIONS),
    prescribedDate: z
      .string()
      .datetime({ message: PRESCRIPTION_VALIDATION_ERRORS.INVALID_DATETIME })
      .optional()
      .or(z.date().optional()),
    expiryDate: z
      .string()
      .datetime({ message: PRESCRIPTION_VALIDATION_ERRORS.INVALID_DATETIME })
      .optional()
      .or(z.date().optional()),
    quantity: z.string().max(50, 'Quantity must be 50 characters or less').optional(),
    additionalNotes: z.string().max(1000, 'Additional notes must be 1000 characters or less').optional(),
    status: z.enum(['active', 'completed', 'discontinued', 'on-hold']).optional().default('active'),
    // Legacy single medication fields for backward compatibility
    medicationName: z.string().superRefine(validateMedicationName).optional(),
    dosage: z.string().superRefine(validateDosage).optional(),
    instructions: z.string().optional().superRefine((val, ctx) => {
      if (val !== undefined) {
        validateInstructions(val, ctx);
      }
    }),
    frequency: z.string().min(1, PRESCRIPTION_VALIDATION_ERRORS.INVALID_FREQUENCY).max(100, 'Frequency must be 100 characters or less').optional(),
    duration: z.string().min(1, PRESCRIPTION_VALIDATION_ERRORS.INVALID_DURATION).max(100, 'Duration must be 100 characters or less').optional(),
  })
  .superRefine((data, ctx) => {
    // Ensure either medications array or legacy fields are provided
    const hasMedicationsArray = data.medications && data.medications.length > 0;
    const hasLegacyFields = data.medicationName && data.dosage && data.instructions && data.frequency && data.duration;
    
    if (!hasMedicationsArray && !hasLegacyFields) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Either medications array or legacy medication fields must be provided',
        path: ['medications'],
      });
    }

    // Custom validation: expiry date must be after prescribed date
    if (data.expiryDate && data.prescribedDate) {
      const prescribedDate = new Date(data.prescribedDate);
      const expiryDate = new Date(data.expiryDate);
      
      if (expiryDate <= prescribedDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: PRESCRIPTION_VALIDATION_ERRORS.EXPIRY_AFTER_PRESCRIBED,
          path: ['expiryDate'],
        });
      }
    }
  });

// Update Prescription Command Schema (Backend API)
export const UpdatePrescriptionCommandSchema = z
  .object({
    id: PrescriptionIdSchema,
    medications: z.array(z.object({
      id: z.string().optional(),
      medicationName: z.string().superRefine(validateMedicationName),
      dosage: z.string().superRefine(validateDosage),
      instructions: z.string().optional().superRefine((val, ctx) => {
        if (val !== undefined) {
          validateInstructions(val, ctx);
        }
      }),
      frequency: z.string().min(1, PRESCRIPTION_VALIDATION_ERRORS.INVALID_FREQUENCY).max(100, 'Frequency must be 100 characters or less'),
      duration: z.string().min(1, PRESCRIPTION_VALIDATION_ERRORS.INVALID_DURATION).max(100, 'Duration must be 100 characters or less'),
    })).optional(),
    expiryDate: z
      .string()
      .datetime({ message: PRESCRIPTION_VALIDATION_ERRORS.INVALID_DATETIME })
      .optional()
      .or(z.date().optional()),
    quantity: z.string().max(50, 'Quantity must be 50 characters or less').optional(),
    additionalNotes: z.string().max(1000, 'Additional notes must be 1000 characters or less').optional(),
    status: z.enum(['active', 'completed', 'discontinued', 'on-hold']).optional(),
    // Legacy single medication fields for backward compatibility
    medicationName: z.string().superRefine(validateMedicationName).optional(),
    dosage: z.string().superRefine(validateDosage).optional(),
    instructions: z.string().optional().superRefine((val, ctx) => {
      if (val !== undefined) {
        validateInstructions(val, ctx);
      }
    }),
    frequency: z.string().min(1, PRESCRIPTION_VALIDATION_ERRORS.INVALID_FREQUENCY).max(100, 'Frequency must be 100 characters or less').optional(),
    duration: z.string().min(1, PRESCRIPTION_VALIDATION_ERRORS.INVALID_DURATION).max(100, 'Duration must be 100 characters or less').optional(),
  })
  .refine((data) => {
    // At least one field must be provided for update
    return Object.keys(data).length > 1; // More than just 'id'
  }, {
    message: PRESCRIPTION_VALIDATION_ERRORS.UPDATE_REQUIRES_FIELDS,
  });

// Delete Prescription Command Schema (Backend API)
export const DeletePrescriptionCommandSchema = z.object({
  id: PrescriptionIdSchema,
});

// Frontend Form Types
export type AddPrescriptionFormData = z.infer<typeof AddPrescriptionFormSchema>;
export type UpdatePrescriptionFormData = z.infer<typeof UpdatePrescriptionFormSchema>;
export type MedicationData = z.infer<typeof MedicationSchema>;

// Backend Command Types
export type CreatePrescriptionCommand = z.infer<typeof CreatePrescriptionCommandSchema>;
export type UpdatePrescriptionCommand = z.infer<typeof UpdatePrescriptionCommandSchema>;
export type DeletePrescriptionCommand = z.infer<typeof DeletePrescriptionCommandSchema>;

// Error Types
export type PrescriptionValidationErrors = typeof PRESCRIPTION_VALIDATION_ERRORS;

// Consolidated schemas export
export const PrescriptionValidationSchemas = {
  // Form schemas (Frontend)
  AddPrescriptionFormSchema,
  UpdatePrescriptionFormSchema,
  MedicationSchema,
  // Command schemas (Backend API)  
  CreatePrescriptionCommandSchema,
  UpdatePrescriptionCommandSchema,
  DeletePrescriptionCommandSchema,
  // Common schemas
  PrescriptionIdSchema,
  FlexibleIdSchema,
} as const;
