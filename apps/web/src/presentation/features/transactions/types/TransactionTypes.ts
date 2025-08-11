/**
 * Transaction-related TypeScript interfaces
 * Re-exports from shared application layer for consistency
 */

// Re-export shared types from application layer
export type {
  TransactionDto as Transaction,
  TransactionItemDto as TransactionItem,
  PatientInfoDto as TransactionPatient,
  CreateTransactionRequestDto,
  TransactionListResponse as TransactionApiResponse,
  TransactionResponse,
  TransactionOperationResponse,
} from '@nx-starter/application-shared';

// For the DataTable component
export interface TransactionTableItem {
  id: string | null;
  receiptNumber: string;
  date: string;
  patient: {
    id: string;
    patientNumber: string;
    firstName: string;
    lastName: string;
    middleName: string;
    fullName: string;
  };
  totalAmount: number;
  paymentMethod: string;
  receivedBy: string;
  items: Array<{
    serviceName: string;
    description: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
  }>;
  itemsSummary: string;
  createdAt: string;
  updatedAt: string;
  // Additional computed fields for table display
  formattedDate?: string;
  formattedAmount?: string;
}