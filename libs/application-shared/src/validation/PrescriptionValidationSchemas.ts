import { z } from 'zod';

/**
 * Zod schemas for Prescription command validation
 * These schemas define the validation rules and generate TypeScript types
 */

// Enhanced medication name validation with specific error messages
const validateMedicationName = (medicationName: string, ctx: z.RefinementCtx) => {
  // Check if medication name is provided (not undefined/null)
  if (medicationName === undefined || medicationName === null) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Medication name is required',
    });
    return;
  }

  // Check if medication name is empty string
  if (medicationName === '') {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Medication name is required',
    });
    return;
  }

  // Check if medication name becomes empty after trimming (whitespace only)
  if (medicationName.trim() === '') {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Medication name cannot be empty',
    });
    return;
  }

  // Check minimum length (after trimming)
  if (medicationName.trim().length < 2) {
    ctx.addIssue({
      code: z.ZodIssueCode.too_small,
      message: 'Medication name must be at least 2 characters',
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
      message: 'Medication name cannot exceed 200 characters',
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
      message: 'Medication name contains invalid characters. Only letters, numbers, spaces, hyphens, and parentheses are allowed',
    });
  }
};

// Enhanced dosage validation
const validateDosage = (dosage: string, ctx: z.RefinementCtx) => {
  if (dosage === undefined || dosage === null || dosage.trim() === '') {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Dosage is required',
    });
    return;
  }

  if (dosage.trim().length < 2) {
    ctx.addIssue({
      code: z.ZodIssueCode.too_small,
      message: 'Dosage must be at least 2 characters',
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
      message: 'Dosage cannot exceed 100 characters',
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
      message: 'Dosage must start with a number',
    });
  }
};

// Enhanced instructions validation
const validateInstructions = (instructions: string, ctx: z.RefinementCtx) => {
  if (instructions === undefined || instructions === null || instructions.trim() === '') {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Instructions are required',
    });
    return;
  }

  if (instructions.trim().length < 3) {
    ctx.addIssue({
      code: z.ZodIssueCode.too_small,
      message: 'Instructions must be at least 3 characters',
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
      message: 'Instructions cannot exceed 1000 characters',
      maximum: 1000,
      origin: 'string',
      inclusive: true,
      input: instructions,
    });
  }
};

// ID validation schema
export const PrescriptionIdSchema = z.string().uuid({
  message: 'Invalid prescription ID format. Must be a valid UUID.',
});

// Create Prescription Command Schema
export const CreatePrescriptionCommandSchema = z
  .object({
    patientId: z.string().uuid({
      message: 'Invalid patient ID format. Must be a valid UUID.',
    }),
    doctorId: z.string().uuid({
      message: 'Invalid doctor ID format. Must be a valid UUID.',
    }),
    medicationName: z.string().superRefine(validateMedicationName),
    dosage: z.string().superRefine(validateDosage),
    instructions: z.string().superRefine(validateInstructions),
    prescribedDate: z
      .string()
      .datetime({ message: 'Invalid prescribed date format. Must be ISO datetime.' })
      .optional()
      .or(z.date().optional()),
    expiryDate: z
      .string()
      .datetime({ message: 'Invalid expiry date format. Must be ISO datetime.' })
      .optional()
      .or(z.date().optional()),
    isActive: z.boolean().optional().default(true),
  })
  .superRefine((data, ctx) => {
    // Custom validation: expiry date must be after prescribed date
    if (data.expiryDate && data.prescribedDate) {
      const prescribedDate = new Date(data.prescribedDate);
      const expiryDate = new Date(data.expiryDate);
      
      if (expiryDate <= prescribedDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Expiry date must be after prescribed date',
          path: ['expiryDate'],
        });
      }
    }
  });

// Update Prescription Command Schema
export const UpdatePrescriptionCommandSchema = z
  .object({
    id: PrescriptionIdSchema,
    medicationName: z.string().superRefine(validateMedicationName).optional(),
    dosage: z.string().superRefine(validateDosage).optional(),
    instructions: z.string().superRefine(validateInstructions).optional(),
    expiryDate: z
      .string()
      .datetime({ message: 'Invalid expiry date format. Must be ISO datetime.' })
      .optional()
      .or(z.date().optional()),
    isActive: z.boolean().optional(),
  })
  .refine((data) => {
    // At least one field must be provided for update
    return Object.keys(data).length > 1; // More than just 'id'
  }, {
    message: 'At least one field must be provided for update',
  });

// Delete Prescription Command Schema
export const DeletePrescriptionCommandSchema = z.object({
  id: PrescriptionIdSchema,
});

// Type exports
export type CreatePrescriptionCommand = z.infer<typeof CreatePrescriptionCommandSchema>;
export type UpdatePrescriptionCommand = z.infer<typeof UpdatePrescriptionCommandSchema>;
export type DeletePrescriptionCommand = z.infer<typeof DeletePrescriptionCommandSchema>;

// Consolidated schemas export
export const PrescriptionValidationSchemas = {
  CreatePrescriptionCommandSchema,
  UpdatePrescriptionCommandSchema,
  DeletePrescriptionCommandSchema,
  PrescriptionIdSchema,
} as const;