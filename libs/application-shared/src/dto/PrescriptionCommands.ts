// Command DTOs for CQRS pattern
// TypeScript types are now generated from Zod schemas for consistency

import {
  CreatePrescriptionCommandSchema,
  UpdatePrescriptionCommandSchema,
  DeletePrescriptionCommandSchema,
} from '../validation/PrescriptionValidationSchemas';

// Re-export command types from validation schemas
export type {
  CreatePrescriptionCommand,
  UpdatePrescriptionCommand,
  DeletePrescriptionCommand,
} from '../validation/PrescriptionValidationSchemas';

// Re-export validation schemas for backward compatibility
export {
  CreatePrescriptionCommandSchema,
  UpdatePrescriptionCommandSchema,
  DeletePrescriptionCommandSchema,
  PrescriptionValidationSchemas,
} from '../validation/PrescriptionValidationSchemas';

// Legacy function for backward compatibility - now returns required schemas
export const createPrescriptionCommandValidationSchema = () => {
  try {
    // Use proper ES6 imports since the module exists
    return {
      CreatePrescriptionCommandSchema,
      UpdatePrescriptionCommandSchema,
      DeletePrescriptionCommandSchema,
    };
  } catch {
    // Fallback in case of import issues
    return {};
  }
};