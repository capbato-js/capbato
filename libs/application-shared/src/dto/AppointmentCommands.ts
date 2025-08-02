// Command DTOs for CQRS pattern
// TypeScript types are now generated from Zod schemas for consistency

import {
  CreateAppointmentCommandSchema,
  UpdateAppointmentCommandSchema,
  DeleteAppointmentCommandSchema,
  ConfirmAppointmentCommandSchema,
  CancelAppointmentCommandSchema,
  RescheduleAppointmentCommandSchema,
} from '../validation/AppointmentValidationSchemas';

// Re-export command types from validation schemas
export type {
  CreateAppointmentCommand,
  UpdateAppointmentCommand,
  DeleteAppointmentCommand,
  ConfirmAppointmentCommand,
  CancelAppointmentCommand,
  RescheduleAppointmentCommand,
} from '../validation/AppointmentValidationSchemas';

// Re-export validation schemas for backward compatibility
export {
  CreateAppointmentCommandSchema,
  UpdateAppointmentCommandSchema,
  DeleteAppointmentCommandSchema,
  ConfirmAppointmentCommandSchema,
  CancelAppointmentCommandSchema,
  RescheduleAppointmentCommandSchema,
  AppointmentValidationSchemas,
} from '../validation/AppointmentValidationSchemas';

// Legacy function for backward compatibility - now returns required schemas
export const createAppointmentCommandValidationSchema = () => {
  try {
    // Use proper ES6 imports since the module exists
    return {
      CreateAppointmentCommandSchema,
      UpdateAppointmentCommandSchema,
      DeleteAppointmentCommandSchema,
      ConfirmAppointmentCommandSchema,
      CancelAppointmentCommandSchema,
      RescheduleAppointmentCommandSchema,
    };
  } catch {
    // Fallback in case of import issues
    return {};
  }
};
