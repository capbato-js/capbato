import { z } from 'zod';
import { VALIDATION_MESSAGES } from './constants/ValidationMessages';

/**
 * Zod schemas for Doctor validation
 * These schemas define the validation rules and generate TypeScript types
 * 
 * Note: These schemas are for Doctor profile management, which links to User entities.
 */

// Doctor validation error messages
export const DOCTOR_VALIDATION_ERRORS = {
  MISSING_DOCTOR_ID: 'Doctor profile ID is required',
  INVALID_DOCTOR_ID: 'Doctor profile ID must be a valid dashless UUID format (32 hexadecimal characters)',
  MISSING_USER_ID: 'User ID is required',
  INVALID_USER_ID: 'User ID can only contain letters, numbers, hyphens and underscores',
  MISSING_SPECIALIZATION: 'Specialization is required',
  INVALID_SPECIALIZATION_LENGTH: 'Specialization cannot exceed 100 characters',
  MISSING_MEDICAL_CONTACT: 'Medical contact number is required',
  INVALID_MEDICAL_CONTACT_FORMAT: 'Medical contact number can only contain digits, spaces, hyphens, parentheses, and plus signs',
  INVALID_MEDICAL_CONTACT: VALIDATION_MESSAGES.PHONE.INVALID_MEDICAL_CONTACT,
  INVALID_LICENSE_LENGTH: 'License number cannot exceed 50 characters',
  INVALID_YEARS_EXPERIENCE: 'Years of experience must be between 0 and 50 years',
} as const;

// Doctor ID validation schema - Dashless UUID format
export const DoctorIdSchema = z.string()
  .min(1, DOCTOR_VALIDATION_ERRORS.MISSING_DOCTOR_ID)
  .regex(/^[0-9a-fA-F]{32}$/, DOCTOR_VALIDATION_ERRORS.INVALID_DOCTOR_ID);

// User ID validation schema (for linking to User entity)
export const UserIdSchema = z.string()
  .min(1, DOCTOR_VALIDATION_ERRORS.MISSING_USER_ID)
  .regex(/^[a-zA-Z0-9_-]+$/, DOCTOR_VALIDATION_ERRORS.INVALID_USER_ID);

// Specialization validation schema
export const SpecializationSchema = z.string()
  .min(1, DOCTOR_VALIDATION_ERRORS.MISSING_SPECIALIZATION)
  .max(100, DOCTOR_VALIDATION_ERRORS.INVALID_SPECIALIZATION_LENGTH)
  .transform(str => str.trim());


// License number validation schema
export const LicenseNumberSchema = z.string()
  .min(1, 'License number cannot be empty')
  .max(50, DOCTOR_VALIDATION_ERRORS.INVALID_LICENSE_LENGTH)
  .transform(str => str.trim());

// Optional license number for commands
export const OptionalLicenseNumberSchema = LicenseNumberSchema.optional();

// Years of experience validation schema
export const YearsOfExperienceSchema = z.number()
  .int('Years of experience must be a whole number')
  .min(0, 'Years of experience cannot be negative')
  .max(50, DOCTOR_VALIDATION_ERRORS.INVALID_YEARS_EXPERIENCE);

// Optional years of experience for commands
export const OptionalYearsOfExperienceSchema = YearsOfExperienceSchema.optional();

// Query validation schemas
export const GetDoctorByIdQuerySchema = z.object({
  id: DoctorIdSchema
});

export const GetDoctorByUserIdQuerySchema = z.object({
  userId: UserIdSchema
});

export const GetDoctorsBySpecializationQuerySchema = z.object({
  specialization: SpecializationSchema
});

export const GetActiveDoctorsQuerySchema = z.object({
  // Empty schema for consistency - no parameters needed
});

// Command validation schemas
export const CreateDoctorProfileCommandSchema = z.object({
  userId: UserIdSchema,
  specialization: SpecializationSchema,
  licenseNumber: OptionalLicenseNumberSchema,
  yearsOfExperience: OptionalYearsOfExperienceSchema,
});

export const UpdateDoctorProfileCommandSchema = z.object({
  id: DoctorIdSchema,
  specialization: SpecializationSchema.optional(),
  licenseNumber: OptionalLicenseNumberSchema,
  yearsOfExperience: OptionalYearsOfExperienceSchema,
  isActive: z.boolean().optional(),
});

// Note: Type definitions are in dto/DoctorQueries.ts to avoid duplicate exports
// These schemas validate the types defined there
