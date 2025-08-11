// Query DTOs for CQRS pattern
// TypeScript types are now generated from Zod schemas for consistency

import {
  GetTransactionByIdQuerySchema,
  GetAllTransactionsQuerySchema,
} from '../validation/TransactionValidationSchemas';

// Re-export query types from validation schemas
export type {
  GetTransactionByIdQuery,
  GetAllTransactionsQuery,
} from '../validation/TransactionValidationSchemas';

// Re-export validation schemas for backward compatibility
export {
  GetTransactionByIdQuerySchema,
  GetAllTransactionsQuerySchema,
} from '../validation/TransactionValidationSchemas';