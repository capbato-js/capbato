import {
  TransactionListResponse,
  TransactionResponse,
  TransactionOperationResponse,
  CreateTransactionRequestDto,
} from '@nx-starter/application-shared';

export interface ITransactionApiService {
  getAllTransactions(): Promise<TransactionListResponse>;
  getTransactionById(id: string): Promise<TransactionResponse>;
  createTransaction(transactionData: CreateTransactionRequestDto): Promise<TransactionResponse>;
  deleteTransaction(id: string): Promise<TransactionOperationResponse>;
}