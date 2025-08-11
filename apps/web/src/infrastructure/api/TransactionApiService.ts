import { injectable, inject } from 'tsyringe';
import { IHttpClient } from '../http/IHttpClient';
import { ITransactionApiService } from './ITransactionApiService';
import { getApiConfig } from './config/ApiConfig';
import {
  TransactionListResponse,
  TransactionResponse,
  TransactionOperationResponse,
  CreateTransactionRequestDto,
  TOKENS,
} from '@nx-starter/application-shared';

@injectable()
export class TransactionApiService implements ITransactionApiService {
  private readonly apiConfig = getApiConfig();

  constructor(
    @inject(TOKENS.HttpClient) private readonly httpClient: IHttpClient
  ) {}

  async getAllTransactions(): Promise<TransactionListResponse> {
    const response = await this.httpClient.get<TransactionListResponse>(
      this.apiConfig.endpoints.transactions.all
    );
    
    if (!response.data.success) {
      throw new Error('Failed to fetch transactions');
    }
    
    return response.data;
  }

  async getTransactionById(id: string): Promise<TransactionResponse> {
    const response = await this.httpClient.get<TransactionResponse>(
      this.apiConfig.endpoints.transactions.byId(id)
    );
    
    if (!response.data.success) {
      throw new Error(`Failed to fetch transaction with ID: ${id}`);
    }
    
    return response.data;
  }

  async createTransaction(transactionData: CreateTransactionRequestDto): Promise<TransactionResponse> {
    const response = await this.httpClient.post<TransactionResponse>(
      this.apiConfig.endpoints.transactions.create,
      transactionData
    );
    
    if (!response.data.success) {
      throw new Error('Failed to create transaction');
    }
    
    return response.data;
  }

  async deleteTransaction(id: string): Promise<TransactionOperationResponse> {
    const response = await this.httpClient.delete<TransactionOperationResponse>(
      this.apiConfig.endpoints.transactions.delete(id)
    );
    
    if (!response.data.success) {
      throw new Error(`Failed to delete transaction with ID: ${id}`);
    }
    
    return response.data;
  }
}