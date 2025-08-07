import { z } from 'zod';
import { VALIDATION_MESSAGES } from './constants/ValidationMessages';

/**
 * Zod schemas for Patient command validation
 * These schemas define the validation rules and generate TypeScript types
 */

// Philippine mobile number validation (09XXXXXXXXX format)
const validatePhilippineMobile = (phone: string, ctx: z.RefinementCtx) => {
  if (!phone) return; // Allow empty for optional fields
  
  const phoneStr = String(phone).trim();
  const phoneRegex = /^09\d{9}$/;
  
  if (!phoneRegex.test(phoneStr)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: VALIDATION_MESSAGES.PHONE.INVALID_PHILIPPINE_MOBILE,
    });
  }
};

// Date of birth validation
const validateDateOfBirth = (dob: string, ctx: z.RefinementCtx) => {
  const date = new Date(dob);
  const now = new Date();
  
  // Check if valid date
  if (isNaN(date.getTime())) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Invalid date format. Use YYYY-MM-DD',
    });
    return;
  }
  
  // Check if date is not in future
  if (date > now) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Date of birth cannot be in the future',
    });
    return;
  }
  
  // Check if date is reasonable (not too old, e.g., 150 years)
  const minDate = new Date();
  minDate.setFullYear(now.getFullYear() - 150);
  if (date < minDate) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Date of birth cannot be more than 150 years ago',
    });
  }
};

// Gender validation
export const GenderSchema = z.enum(['Male', 'Female'], {
  message: 'Gender must be either Male or Female'
});

// Name validation helper
const validateName = (fieldName: string) => (name: string, ctx: z.RefinementCtx) => {
  if (!name?.trim()) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: `${fieldName} is required`,
    });
    return;
  }
  
  if (name.trim().length < 2) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: `${fieldName} must be at least 2 characters`,
    });
    return;
  }
  
  if (name.length > 50) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: `${fieldName} cannot exceed 50 characters`,
    });
    return;
  }
  
  // Check if name contains only letters, spaces, hyphens, and apostrophes
  const nameRegex = /^[a-zA-Z\s\-'.]+$/;
  if (!nameRegex.test(name)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: `${fieldName} can only contain letters, spaces, hyphens, apostrophes, and periods`,
    });
  }
};

// Guardian validation - if any guardian field is provided, required fields must be present
const validateGuardianInfo = (data: Record<string, unknown>, ctx: z.RefinementCtx) => {
  const { guardianName, guardianGender, guardianRelationship, guardianContactNumber } = data;
  const hasAnyGuardianInfo = guardianName || guardianGender || guardianRelationship || guardianContactNumber;
  
  if (hasAnyGuardianInfo) {
    if (!guardianName || (typeof guardianName === 'string' && !guardianName.trim())) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Guardian name is required when guardian information is provided',
        path: ['guardianName'],
      });
    }
    
    if (!guardianRelationship || (typeof guardianRelationship === 'string' && !guardianRelationship.trim())) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Guardian relationship is required when guardian information is provided',
        path: ['guardianRelationship'],
      });
    }
    
    if (!guardianContactNumber || (typeof guardianContactNumber === 'string' && !guardianContactNumber.trim())) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Guardian contact number is required when guardian information is provided',
        path: ['guardianContactNumber'],
      });
    }
  }
};

export const CreatePatientCommandSchema = z.object({
  firstName: z.string().superRefine(validateName('First name')),
  lastName: z.string().superRefine(validateName('Last name')),
  middleName: z.string().optional(),
  dateOfBirth: z.string().superRefine(validateDateOfBirth),
  gender: GenderSchema,
  contactNumber: z.string().superRefine(validatePhilippineMobile),
  
  // Address Information
  houseNumber: z.string().max(20, 'House number cannot exceed 20 characters').optional(),
  streetName: z.string().max(100, 'Street name cannot exceed 100 characters').optional(),
  province: z.string().max(50, 'Province cannot exceed 50 characters').optional(),
  cityMunicipality: z.string().max(50, 'City/Municipality cannot exceed 50 characters').optional(),
  barangay: z.string().max(50, 'Barangay cannot exceed 50 characters').optional(),
  
  // Guardian Information (optional but complete when provided)
  guardianName: z.string().optional().superRefine((val, ctx) => {
    // Only validate if value is present and not just whitespace
    if (val && val.trim()) {
      validateName('Guardian name')(val, ctx);
    }
  }),
  guardianGender: GenderSchema.optional(),
  guardianRelationship: z.string().optional(),
  guardianContactNumber: z.string().optional().superRefine((val, ctx) => {
    // Only validate if value is present and not just whitespace
    if (val && val.trim()) {
      validatePhilippineMobile(val, ctx);
    }
  }),
  
  // Guardian Address Information
  guardianHouseNumber: z.string().max(20, 'Guardian house number cannot exceed 20 characters').optional(),
  guardianStreetName: z.string().max(100, 'Guardian street name cannot exceed 100 characters').optional(),
  guardianProvince: z.string().max(50, 'Guardian province cannot exceed 50 characters').optional(),
  guardianCityMunicipality: z.string().max(50, 'Guardian city/municipality cannot exceed 50 characters').optional(),
  guardianBarangay: z.string().max(50, 'Guardian barangay cannot exceed 50 characters').optional(),
}).superRefine(validateGuardianInfo)
.superRefine((data, ctx) => {
  // Validate that at least one address field is provided
  const hasAddress = data.houseNumber || data.streetName || data.province || data.cityMunicipality || data.barangay;
  if (!hasAddress) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'At least one address field is required',
      path: ['address'],
    });
  }
})
.transform((data) => ({
  ...data,
  // Sanitize phone numbers
  contactNumber: data.contactNumber.replace(/\D/g, ''),
  guardianContactNumber: data.guardianContactNumber ? data.guardianContactNumber.replace(/\D/g, '') : undefined,
}));

export const GetPatientByIdCommandSchema = z.object({
  id: z.string().min(1, 'Patient ID cannot be empty'),
});

export const UpdatePatientCommandSchema = z.object({
  id: z.string().min(1, 'Patient ID cannot be empty'),
  firstName: z.string().optional().superRefine((val, ctx) => {
    if (val !== undefined) validateName('First name')(val, ctx);
  }),
  lastName: z.string().optional().superRefine((val, ctx) => {
    if (val !== undefined) validateName('Last name')(val, ctx);
  }),
  middleName: z.string().optional(),
  dateOfBirth: z.string().optional().superRefine((val, ctx) => {
    if (val !== undefined) validateDateOfBirth(val, ctx);
  }),
  gender: GenderSchema.optional(),
  contactNumber: z.string().optional().superRefine((val, ctx) => {
    if (val !== undefined) validatePhilippineMobile(val, ctx);
  }),
  
  // Address Information
  houseNumber: z.string().max(20, 'House number cannot exceed 20 characters').optional(),
  streetName: z.string().max(100, 'Street name cannot exceed 100 characters').optional(),
  province: z.string().max(50, 'Province cannot exceed 50 characters').optional(),
  cityMunicipality: z.string().max(50, 'City/Municipality cannot exceed 50 characters').optional(),
  barangay: z.string().max(50, 'Barangay cannot exceed 50 characters').optional(),
  
  // Guardian Information (optional but complete when provided)
  guardianName: z.string().optional().superRefine((val, ctx) => {
    if (val && val.trim()) {
      validateName('Guardian name')(val, ctx);
    }
  }),
  guardianGender: GenderSchema.optional(),
  guardianRelationship: z.string().optional(),
  guardianContactNumber: z.string().optional().superRefine((val, ctx) => {
    if (val && val.trim()) {
      validatePhilippineMobile(val, ctx);
    }
  }),
  
  // Guardian Address Information
  guardianHouseNumber: z.string().max(20, 'Guardian house number cannot exceed 20 characters').optional(),
  guardianStreetName: z.string().max(100, 'Guardian street name cannot exceed 100 characters').optional(),
  guardianProvince: z.string().max(50, 'Guardian province cannot exceed 50 characters').optional(),
  guardianCityMunicipality: z.string().max(50, 'Guardian city/municipality cannot exceed 50 characters').optional(),
  guardianBarangay: z.string().max(50, 'Guardian barangay cannot exceed 50 characters').optional(),
}).transform((data) => ({
  ...data,
  // Sanitize phone numbers if provided
  contactNumber: data.contactNumber ? data.contactNumber.replace(/\D/g, '') : undefined,
  guardianContactNumber: data.guardianContactNumber ? data.guardianContactNumber.replace(/\D/g, '') : undefined,
}));

// Patient ID validation schema - Dashless UUID format
export const PatientIdSchema = z.string()
  .min(1, 'Patient ID cannot be empty')
  .regex(/^[0-9a-fA-F]{32}$/, 'Patient ID must be a valid dashless UUID format (32 hexadecimal characters)');

// Inferred TypeScript types from Zod schemas
export type CreatePatientCommand = z.infer<typeof CreatePatientCommandSchema>;
export type UpdatePatientCommand = z.infer<typeof UpdatePatientCommandSchema>;
export type GetPatientByIdCommand = z.infer<typeof GetPatientByIdCommandSchema>;

// Export all schemas as a collection for easier importing
export const PatientValidationSchemas = {
  CreatePatientCommandSchema,
  UpdatePatientCommandSchema,
  GetPatientByIdCommandSchema,
  PatientIdSchema,
} as const;