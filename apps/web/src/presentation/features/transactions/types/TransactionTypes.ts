/**
 * Transaction-related TypeScript interfaces
 * Based on API response structure for transactions
 */

export interface TransactionPatient {
  id: string;
  patientNumber: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  fullName: string;
}

export interface TransactionItem {
  serviceName: string;
  description: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface Transaction {
  id: number;
  receiptNumber: string;
  date: string;
  patient: TransactionPatient;
  totalAmount: number;
  paymentMethod: string;
  receivedBy: string;
  items: TransactionItem[];
  itemsSummary: string;
  createdAt: string;
  updatedAt: string;
}

export interface TransactionApiResponse {
  success: boolean;
  data: Transaction[];
}

// For the DataTable component
export interface TransactionTableItem extends Transaction {
  // Additional computed fields for table display
  formattedDate?: string;
  formattedAmount?: string;
}