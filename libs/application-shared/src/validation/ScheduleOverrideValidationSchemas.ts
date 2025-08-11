import { z } from 'zod';

/**
 * Validation schemas for Doctor Schedule Override operations
 */

// Date validation
const dateSchema = z.string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format')
  .refine((date) => {
    const parsedDate = new Date(date);
    return !isNaN(parsedDate.getTime());
  }, 'Invalid date')
  .refine((date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const inputDate = new Date(date);
    return inputDate >= today;
  }, 'Cannot create override for past dates');

// UUID validation
const uuidSchema = z.string()
  .regex(/^[0-9a-fA-F]{32}$/, 'Must be a valid dashless UUID format (32 hexadecimal characters)');

// Reason validation
const reasonSchema = z.string()
  .min(3, 'Reason must be at least 3 characters long')
  .max(500, 'Reason cannot exceed 500 characters')
  .trim();

// Create Schedule Override Schema
export const CreateScheduleOverrideSchema = z.object({
  date: dateSchema,
  assignedDoctorId: uuidSchema,
  reason: reasonSchema,
  originalDoctorId: uuidSchema.optional(),
}).refine((data) => {
  // Ensure assigned doctor is different from original doctor
  if (data.originalDoctorId && data.assignedDoctorId === data.originalDoctorId) {
    return false;
  }
  return true;
}, {
  message: 'Cannot override with the same doctor',
  path: ['assignedDoctorId'],
});

// Update Schedule Override Schema
export const UpdateScheduleOverrideSchema = z.object({
  id: uuidSchema,
  reason: reasonSchema.optional(),
  assignedDoctorId: uuidSchema.optional(),
}).refine((data) => {
  // At least one field must be provided (excluding id)
  return data.reason !== undefined || data.assignedDoctorId !== undefined;
}, {
  message: 'At least one field (reason or assignedDoctorId) must be provided',
});

// Schedule Override ID Schema
export const ScheduleOverrideIdSchema = uuidSchema;

// Date parameter schema
export const ScheduleOverrideDateSchema = dateSchema;

// Date range schema
export const ScheduleOverrideDateRangeSchema = z.object({
  startDate: dateSchema,
  endDate: dateSchema,
}).refine((data) => {
  const start = new Date(data.startDate);
  const end = new Date(data.endDate);
  return start <= end;
}, {
  message: 'Start date must be before or equal to end date',
  path: ['endDate'],
});

// Doctor ID parameter schema
export const ScheduleOverrideDoctorIdSchema = uuidSchema;

// Multiple dates schema
export const ScheduleOverrideDatesSchema = z.object({
  dates: z.array(dateSchema).min(1, 'At least one date must be provided'),
});

// Export types
export type CreateScheduleOverrideInput = z.infer<typeof CreateScheduleOverrideSchema>;
export type UpdateScheduleOverrideInput = z.infer<typeof UpdateScheduleOverrideSchema>;
export type ScheduleOverrideDateRangeInput = z.infer<typeof ScheduleOverrideDateRangeSchema>;
export type ScheduleOverrideDatesInput = z.infer<typeof ScheduleOverrideDatesSchema>;
