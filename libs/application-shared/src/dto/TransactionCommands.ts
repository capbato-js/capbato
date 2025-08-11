// Command DTOs for CQRS pattern
// TypeScript types are now generated from Zod schemas for consistency

import {
  CreateTransactionCommandSchema,
  UpdateTransactionCommandSchema,
  DeleteTransactionCommandSchema,
} from '../validation/TransactionValidationSchemas';

// Re-export command types from validation schemas
export type {
  CreateTransactionCommand,
  UpdateTransactionCommand,
  DeleteTransactionCommand,
} from '../validation/TransactionValidationSchemas';

// Re-export validation schemas for backward compatibility
export {
  CreateTransactionCommandSchema,
  UpdateTransactionCommandSchema,
  DeleteTransactionCommandSchema,
  TransactionValidationSchemas,
} from '../validation/TransactionValidationSchemas';

// Legacy function for backward compatibility - now returns required schemas
export const createTransactionCommandValidationSchema = () => {
  try {
    // Use proper ES6 imports since the module exists
    return {
      CreateTransactionCommandSchema,
      UpdateTransactionCommandSchema,
      DeleteTransactionCommandSchema,
    };
  } catch {
    // Fallback in case of import issues
    return {};
  }
};