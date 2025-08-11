import { z } from 'zod';

/**
 * Zod schemas for Transaction validation
 * These schemas define validation rules for both form validation and API commands
 * and generate TypeScript types for the entire transaction system
 */

// Centralized transaction validation error messages
export const TRANSACTION_VALIDATION_ERRORS = {
  MISSING_PATIENT: 'Patient selection is required',
  MISSING_DATE: 'Transaction date is required',
  MISSING_PAYMENT_METHOD: 'Payment method is required',
  MISSING_RECEIVED_BY: 'Received by is required',
  MISSING_ITEMS: 'At least one service item is required',
  INVALID_DATE_FORMAT: 'Invalid date format. Use YYYY-MM-DD',
  FUTURE_DATE: 'Transaction date cannot be in the future',
  INVALID_SERVICE_NAME: 'Service name is required',
  INVALID_QUANTITY: 'Quantity must be a positive number',
  INVALID_UNIT_PRICE: 'Unit price must be a positive number',
  SERVICE_NAME_TOO_SHORT: 'Service name must be at least 2 characters',
  SERVICE_NAME_TOO_LONG: 'Service name cannot exceed 200 characters',
  DESCRIPTION_TOO_LONG: 'Description cannot exceed 1000 characters',
  INVALID_UUID: 'Invalid ID format. Must be a valid UUID',
  QUANTITY_MIN: 'Quantity must be at least 1',
  QUANTITY_MAX: 'Quantity cannot exceed 999',
  UNIT_PRICE_MIN: 'Unit price must be greater than 0',
  UNIT_PRICE_MAX: 'Unit price cannot exceed 999999',
} as const;

// Enhanced service name validation
const validateServiceName = (serviceName: string, ctx: z.RefinementCtx) => {
  if (serviceName === undefined || serviceName === null) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: TRANSACTION_VALIDATION_ERRORS.INVALID_SERVICE_NAME,
    });
    return;
  }

  if (serviceName === '') {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: TRANSACTION_VALIDATION_ERRORS.INVALID_SERVICE_NAME,
    });
    return;
  }

  if (serviceName.trim().length < 2) {
    ctx.addIssue({
      code: z.ZodIssueCode.too_small,
      message: TRANSACTION_VALIDATION_ERRORS.SERVICE_NAME_TOO_SHORT,
      minimum: 2,
      origin: 'string',
      inclusive: true,
      input: serviceName,
    });
    return;
  }

  if (serviceName.trim().length > 200) {
    ctx.addIssue({
      code: z.ZodIssueCode.too_big,
      message: TRANSACTION_VALIDATION_ERRORS.SERVICE_NAME_TOO_LONG,
      maximum: 200,
      origin: 'string',
      inclusive: true,
      input: serviceName,
    });
  }
};

// Enhanced date validation function
const validateTransactionDate = (date: string, ctx: z.RefinementCtx) => {
  // Check if date is provided
  if (!date || date.trim() === '') {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: TRANSACTION_VALIDATION_ERRORS.MISSING_DATE,
    });
    return;
  }

  // Check if it's a valid date format
  const parsedDate = new Date(date);
  if (isNaN(parsedDate.getTime())) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: TRANSACTION_VALIDATION_ERRORS.INVALID_DATE_FORMAT,
    });
    return;
  }

  // Check if date is not in the future
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const transactionDate = new Date(date);
  transactionDate.setHours(0, 0, 0, 0);

  if (transactionDate > today) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: TRANSACTION_VALIDATION_ERRORS.FUTURE_DATE,
    });
  }
};

// Flexible ID validation schema that supports both UUID and dashless UUID formats
export const TransactionIdSchema = z.string()
  .min(1, 'Transaction ID cannot be empty')
  .refine((id) => {
    // Support both UUID format (with dashes) and dashless UUID format
    const uuidPattern = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
    const dashlessUuidPattern = /^[0-9a-fA-F]{32}$/;
    return uuidPattern.test(id) || dashlessUuidPattern.test(id);
  }, {
    message: TRANSACTION_VALIDATION_ERRORS.INVALID_UUID,
  });

// Generic ID schema for patientId and receivedById that supports both formats
export const FlexibleIdSchema = z.string()
  .min(1, 'ID is required')
  .refine((id) => {
    // Support both UUID format (with dashes) and dashless UUID format
    const uuidPattern = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
    const dashlessUuidPattern = /^[0-9a-fA-F]{32}$/;
    return uuidPattern.test(id) || dashlessUuidPattern.test(id);
  }, {
    message: TRANSACTION_VALIDATION_ERRORS.INVALID_UUID,
  });

// Transaction item validation schema for forms
export const TransactionItemSchema = z.object({
  serviceName: z.string()
    .min(1, TRANSACTION_VALIDATION_ERRORS.INVALID_SERVICE_NAME)
    .max(200, TRANSACTION_VALIDATION_ERRORS.SERVICE_NAME_TOO_LONG),
  description: z.string()
    .max(1000, TRANSACTION_VALIDATION_ERRORS.DESCRIPTION_TOO_LONG)
    .optional()
    .default(''),
  quantity: z.number()
    .min(1, TRANSACTION_VALIDATION_ERRORS.QUANTITY_MIN)
    .max(999, TRANSACTION_VALIDATION_ERRORS.QUANTITY_MAX),
  unitPrice: z.number()
    .min(0.01, TRANSACTION_VALIDATION_ERRORS.UNIT_PRICE_MIN)
    .max(999999, TRANSACTION_VALIDATION_ERRORS.UNIT_PRICE_MAX),
});

// Add Transaction Form Schema (Frontend UI)
export const AddTransactionFormSchema = z.object({
  patientId: z.string()
    .min(1, TRANSACTION_VALIDATION_ERRORS.MISSING_PATIENT),
  date: z.string()
    .min(1, TRANSACTION_VALIDATION_ERRORS.MISSING_DATE)
    .superRefine(validateTransactionDate),
  paymentMethod: z.string()
    .min(1, TRANSACTION_VALIDATION_ERRORS.MISSING_PAYMENT_METHOD),
  receivedById: z.string()
    .min(1, TRANSACTION_VALIDATION_ERRORS.MISSING_RECEIVED_BY),
  items: z.array(TransactionItemSchema)
    .min(1, TRANSACTION_VALIDATION_ERRORS.MISSING_ITEMS),
});

// Create Transaction Command Schema (Backend API)
export const CreateTransactionCommandSchema = z.object({
  patientId: FlexibleIdSchema,
  date: z.string()
    .datetime({ message: 'Invalid date format. Must be ISO datetime' })
    .optional()
    .or(z.date().optional()),
  paymentMethod: z.string()
    .min(1, TRANSACTION_VALIDATION_ERRORS.MISSING_PAYMENT_METHOD)
    .max(50, 'Payment method must be 50 characters or less'),
  receivedById: FlexibleIdSchema,
  items: z.array(z.object({
    serviceName: z.string().superRefine(validateServiceName),
    description: z.string()
      .max(1000, TRANSACTION_VALIDATION_ERRORS.DESCRIPTION_TOO_LONG)
      .optional()
      .default(''),
    quantity: z.number()
      .min(1, TRANSACTION_VALIDATION_ERRORS.QUANTITY_MIN)
      .max(999, TRANSACTION_VALIDATION_ERRORS.QUANTITY_MAX),
    unitPrice: z.number()
      .min(0.01, TRANSACTION_VALIDATION_ERRORS.UNIT_PRICE_MIN)
      .max(999999, TRANSACTION_VALIDATION_ERRORS.UNIT_PRICE_MAX),
  })).min(1, TRANSACTION_VALIDATION_ERRORS.MISSING_ITEMS),
});

// Update Transaction Command Schema (Backend API)
export const UpdateTransactionCommandSchema = z.object({
  id: TransactionIdSchema,
  paymentMethod: z.string()
    .min(1, TRANSACTION_VALIDATION_ERRORS.MISSING_PAYMENT_METHOD)
    .max(50, 'Payment method must be 50 characters or less')
    .optional(),
  items: z.array(z.object({
    serviceName: z.string().superRefine(validateServiceName),
    description: z.string()
      .max(1000, TRANSACTION_VALIDATION_ERRORS.DESCRIPTION_TOO_LONG)
      .optional()
      .default(''),
    quantity: z.number()
      .min(1, TRANSACTION_VALIDATION_ERRORS.QUANTITY_MIN)
      .max(999, TRANSACTION_VALIDATION_ERRORS.QUANTITY_MAX),
    unitPrice: z.number()
      .min(0.01, TRANSACTION_VALIDATION_ERRORS.UNIT_PRICE_MIN)
      .max(999999, TRANSACTION_VALIDATION_ERRORS.UNIT_PRICE_MAX),
  })).optional(),
})
.refine((data) => {
  // At least one field must be provided for update
  return Object.keys(data).length > 1; // More than just 'id'
}, {
  message: 'At least one field must be provided for update',
});

// Delete Transaction Command Schema (Backend API)
export const DeleteTransactionCommandSchema = z.object({
  id: TransactionIdSchema,
});

// Frontend Form Types
export type AddTransactionFormData = z.infer<typeof AddTransactionFormSchema>;
export type UpdateTransactionFormData = z.infer<typeof UpdateTransactionCommandSchema>;
export type TransactionItemData = z.infer<typeof TransactionItemSchema>;

// Backend Command Types
export type CreateTransactionCommand = z.infer<typeof CreateTransactionCommandSchema>;
export type UpdateTransactionCommand = z.infer<typeof UpdateTransactionCommandSchema>;
export type DeleteTransactionCommand = z.infer<typeof DeleteTransactionCommandSchema>;

// Error Types
export type TransactionValidationErrors = typeof TRANSACTION_VALIDATION_ERRORS;

// Consolidated schemas export
export const TransactionValidationSchemas = {
  // Form schemas (Frontend)
  AddTransactionFormSchema,
  UpdateTransactionCommandSchema,
  TransactionItemSchema,
  // Command schemas (Backend API)  
  CreateTransactionCommandSchema,
  UpdateTransactionCommandSchema,
  DeleteTransactionCommandSchema,
  // Common schemas
  TransactionIdSchema,
  FlexibleIdSchema,
} as const;