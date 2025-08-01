import { z } from 'zod';

/**
 * Zod schemas for Doctor validation
 * These schemas define the validation rules and generate TypeScript types
 * 
 * Note: These schemas are for Doctor profile management, which links to User entities.
 */

// Doctor validation error messages
export const DOCTOR_VALIDATION_ERRORS = {
  MISSING_DOCTOR_ID: 'Doctor profile ID is required',
  INVALID_DOCTOR_ID: 'Doctor profile ID must be a valid UUID format',
  MISSING_USER_ID: 'User ID is required',
  INVALID_USER_ID: 'User ID can only contain letters, numbers, hyphens and underscores',
  MISSING_SPECIALIZATION: 'Specialization is required',
  INVALID_SPECIALIZATION_LENGTH: 'Specialization cannot exceed 100 characters',
  MISSING_MEDICAL_CONTACT: 'Medical contact number is required',
  INVALID_MEDICAL_CONTACT_FORMAT: 'Medical contact number can only contain digits, spaces, hyphens, parentheses, and plus signs',
  INVALID_MEDICAL_CONTACT: 'Medical contact number must be a valid Philippine mobile number (09xxxxxxxxx) or landline number (02xxxxxxx, 0xxxxxxxxx)',
  INVALID_LICENSE_LENGTH: 'License number cannot exceed 50 characters',
  INVALID_YEARS_EXPERIENCE: 'Years of experience must be between 0 and 50 years',
} as const;

// Doctor ID validation schema
export const DoctorIdSchema = z.string()
  .min(1, DOCTOR_VALIDATION_ERRORS.MISSING_DOCTOR_ID)
  .uuid(DOCTOR_VALIDATION_ERRORS.INVALID_DOCTOR_ID);

// User ID validation schema (for linking to User entity)
export const UserIdSchema = z.string()
  .min(1, DOCTOR_VALIDATION_ERRORS.MISSING_USER_ID)
  .regex(/^[a-zA-Z0-9_-]+$/, DOCTOR_VALIDATION_ERRORS.INVALID_USER_ID);

// Specialization validation schema
export const SpecializationSchema = z.string()
  .min(1, DOCTOR_VALIDATION_ERRORS.MISSING_SPECIALIZATION)
  .max(100, DOCTOR_VALIDATION_ERRORS.INVALID_SPECIALIZATION_LENGTH)
  .transform(str => str.trim());

// Medical contact number validation schema (Philippine mobile format)
// Supports both personal and clinic contact numbers
export const MedicalContactNumberSchema = z.string()
  .min(1, DOCTOR_VALIDATION_ERRORS.MISSING_MEDICAL_CONTACT)
  .regex(/^[\d\s\-()+-]+$/, DOCTOR_VALIDATION_ERRORS.INVALID_MEDICAL_CONTACT_FORMAT)
  .transform(str => str.replace(/[\s\-()]/g, '')) // Remove formatting characters, keep digits and +
  .refine(
    (phone) => {
      // Philippine mobile: 09xxxxxxxxx (11 digits) or +639xxxxxxxxx (13 characters)
      // Philippine landline: (02)xxxxxxx, (032)xxxxxxx, etc. (area code + 7 digits)
      // International format: +63xxxxxxxxxx
      
      // Remove + for easier validation
      const cleanPhone = phone.replace(/^\+/, '');
      
      // Philippine mobile: 09xxxxxxxxx (starts with 09, 11 digits total)
      if (/^09\d{9}$/.test(phone)) return true;
      
      // Philippine mobile international: 639xxxxxxxxx (starts with 639, 12 digits total)
      if (/^639\d{9}$/.test(cleanPhone)) return true;
      
      // Philippine landline: area code (2-4 digits) + 7 digits
      // Common area codes: 02 (Metro Manila), 032 (Cebu), 033 (Iloilo), 034 (Bacolod), etc.
      if (/^0[2-9]\d{7}$/.test(phone)) return true; // 02xxxxxxx format
      if (/^0[3-8]\d{8}$/.test(phone)) return true; // 0xx7digitx format
      
      return false;
    },
    DOCTOR_VALIDATION_ERRORS.INVALID_MEDICAL_CONTACT
  );

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
  medicalContactNumber: MedicalContactNumberSchema,
  licenseNumber: OptionalLicenseNumberSchema,
  yearsOfExperience: OptionalYearsOfExperienceSchema,
});

export const UpdateDoctorProfileCommandSchema = z.object({
  id: DoctorIdSchema,
  specialization: SpecializationSchema.optional(),
  medicalContactNumber: MedicalContactNumberSchema.optional(),
  licenseNumber: OptionalLicenseNumberSchema,
  yearsOfExperience: OptionalYearsOfExperienceSchema,
  isActive: z.boolean().optional(),
});

// Note: Type definitions are in dto/DoctorQueries.ts to avoid duplicate exports
// These schemas validate the types defined there
