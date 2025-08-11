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
}

export interface TransactionDto {
  id: number;
  receiptNumber: string;
  date: string;
  patient: PatientInfoDto;
  totalAmount: number;
  paymentMethod: string;
  receivedBy: string;
  items: TransactionItemDto[];
  itemsSummary: string;
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