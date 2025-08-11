import type {
  TransactionDto,
  CreateTransactionRequestDto,
} from '@nx-starter/application-shared';

export type TransactionStoreStatus = 'idle' | 'loading' | 'succeeded' | 'failed';

export interface TransactionStore {
  // State
  transactions: TransactionDto[];
  status: TransactionStoreStatus;
  error: string | null;

  // Computed getters as functions
  getIsLoading(): boolean;
  getIsIdle(): boolean;
  getHasError(): boolean;
  getTransactionById(id: string): TransactionDto | undefined;
  getStats(): {
    total: number;
    totalAmount: number;
    cashTransactions: number;
    creditCardTransactions: number;
  };

  // Actions
  loadTransactions(): Promise<void>;
  createTransaction(data: CreateTransactionRequestDto): Promise<void>;
  deleteTransaction(id: string): Promise<void>;
  getTransaction(id: string): Promise<TransactionDto>;
  clearError(): void;
}