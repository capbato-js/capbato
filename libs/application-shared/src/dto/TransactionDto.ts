// Data Transfer Objects for Transaction operations

export interface TransactionItemDto {
  serviceName: string;
  description: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface PatientInfoDto {
  id: string;
  patientNumber: string;
  firstName: string;
  lastName: string;
  middleName: string;
  fullName: string;
  address: string;
  contactNumber: string;
  email?: string; // Email is not available in current patient entity, so optional
}

export interface TransactionDto {
  id: string | null;
  receiptNumber: string;
  date: string;
  patient: PatientInfoDto;
  totalAmount: number;
  paymentMethod: string;
  receivedBy: string;
  items: TransactionItemDto[];
  itemsSummary: string;
  labRequestId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTransactionDto {
  patientId: string;
  date: string;
  paymentMethod: string;
  receivedById: string;
  items: Array<{
    serviceName: string;
    description: string;
    quantity: number;
    unitPrice: number;
  }>;
  labRequestId?: string;
}

// Request DTOs for consistency with other modules
export interface CreateTransactionRequestDto {
  patientId: string;
  date: string;
  paymentMethod: string;
  receivedById: string;
  items: Array<{
    serviceName: string;
    description: string;
    quantity: number;
    unitPrice: number;
  }>;
  labRequestId?: string;
}

// API Response DTOs matching the spec
export interface TransactionListResponse {
  success: boolean;
  data: TransactionDto[];
}

export interface TransactionResponse {
  success: boolean;
  data: TransactionDto;
}

export interface TransactionOperationResponse {
  success: boolean;
  message: string;
}