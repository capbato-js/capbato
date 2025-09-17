import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TransactionApiService } from './TransactionApiService';
import { IHttpClient } from '../http/IHttpClient';
import { 
  TransactionListResponse,
  TransactionResponse,
  TransactionOperationResponse,
  CreateTransactionRequestDto,
  TOKENS
} from '@nx-starter/application-shared';

// Mock API config
vi.mock('./config/ApiConfig', () => ({
  getApiConfig: () => ({
    endpoints: {
      transactions: {
        all: '/api/transactions',
        byId: (id: string) => `/api/transactions/${id}`,
        create: '/api/transactions',
        delete: (id: string) => `/api/transactions/${id}`
      }
    }
  })
}));

describe('TransactionApiService', () => {
  let transactionService: TransactionApiService;
  let mockHttpClient: IHttpClient;

  beforeEach(() => {
    mockHttpClient = {
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      delete: vi.fn()
    };

    transactionService = new TransactionApiService(mockHttpClient);
  });

  describe('getAllTransactions', () => {
    it('should get all transactions successfully', async () => {
      const mockResponse: TransactionListResponse = {
        success: true,
        data: [
          {
            id: 'trans-1',
            patientId: 'patient-1',
            amount: 150.00,
            paymentMethod: 'cash',
            description: 'Consultation fee',
            date: new Date(),
            receiptNumber: 'RCP-001',
            createdAt: new Date(),
            updatedAt: new Date()
          }
        ]
      };

      vi.mocked(mockHttpClient.get).mockResolvedValue({ data: mockResponse });

      const result = await transactionService.getAllTransactions();

      expect(mockHttpClient.get).toHaveBeenCalledWith('/api/transactions');
      expect(result).toEqual(mockResponse);
    });

    it('should throw error when request fails', async () => {
      const mockResponse = { data: { success: false } };
      vi.mocked(mockHttpClient.get).mockResolvedValue(mockResponse);

      await expect(transactionService.getAllTransactions()).rejects.toThrow('Failed to fetch transactions');
    });
  });

  describe('getTransactionById', () => {
    it('should get transaction by id successfully', async () => {
      const transactionId = 'trans-1';
      const mockResponse: TransactionResponse = {
        success: true,
        data: {
          id: transactionId,
          patientId: 'patient-1',
          amount: 200.00,
          paymentMethod: 'card',
          description: 'Laboratory test',
          date: new Date(),
          receiptNumber: 'RCP-002',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      };

      vi.mocked(mockHttpClient.get).mockResolvedValue({ data: mockResponse });

      const result = await transactionService.getTransactionById(transactionId);

      expect(mockHttpClient.get).toHaveBeenCalledWith(`/api/transactions/${transactionId}`);
      expect(result).toEqual(mockResponse);
    });

    it('should throw error when transaction not found', async () => {
      const transactionId = 'non-existent';
      const mockResponse = { data: { success: false } };
      vi.mocked(mockHttpClient.get).mockResolvedValue(mockResponse);

      await expect(transactionService.getTransactionById(transactionId)).rejects.toThrow(`Failed to fetch transaction with ID: ${transactionId}`);
    });
  });

  describe('createTransaction', () => {
    it('should create transaction successfully', async () => {
      const transactionData: CreateTransactionRequestDto = {
        patientId: 'patient-1',
        amount: 100.00,
        paymentMethod: 'cash',
        description: 'Medicine purchase',
        date: new Date()
      };

      const mockResponse: TransactionResponse = {
        success: true,
        data: {
          id: 'new-trans-id',
          ...transactionData,
          receiptNumber: 'RCP-003',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      };

      vi.mocked(mockHttpClient.post).mockResolvedValue({ data: mockResponse });

      const result = await transactionService.createTransaction(transactionData);

      expect(mockHttpClient.post).toHaveBeenCalledWith('/api/transactions', transactionData);
      expect(result).toEqual(mockResponse);
    });

    it('should throw error when creation fails', async () => {
      const transactionData: CreateTransactionRequestDto = {
        patientId: 'patient-1',
        amount: 100.00,
        paymentMethod: 'cash',
        description: 'Medicine purchase',
        date: new Date()
      };

      const mockResponse = { data: { success: false } };
      vi.mocked(mockHttpClient.post).mockResolvedValue(mockResponse);

      await expect(transactionService.createTransaction(transactionData)).rejects.toThrow('Failed to create transaction');
    });
  });

  describe('deleteTransaction', () => {
    it('should delete transaction successfully', async () => {
      const transactionId = 'trans-1';
      const mockResponse: TransactionOperationResponse = {
        success: true,
        message: 'Transaction deleted successfully'
      };

      vi.mocked(mockHttpClient.delete).mockResolvedValue({ data: mockResponse });

      const result = await transactionService.deleteTransaction(transactionId);

      expect(mockHttpClient.delete).toHaveBeenCalledWith(`/api/transactions/${transactionId}`);
      expect(result).toEqual(mockResponse);
    });

    it('should throw error when deletion fails', async () => {
      const transactionId = 'trans-1';
      const mockResponse = { data: { success: false } };
      vi.mocked(mockHttpClient.delete).mockResolvedValue(mockResponse);

      await expect(transactionService.deleteTransaction(transactionId)).rejects.toThrow(`Failed to delete transaction with ID: ${transactionId}`);
    });
  });

  describe('edge cases', () => {
    it('should handle null response data in getAllTransactions', async () => {
      vi.mocked(mockHttpClient.get).mockResolvedValue({ data: null });

      await expect(transactionService.getAllTransactions()).rejects.toThrow();
    });

    it('should handle undefined response data in getTransactionById', async () => {
      vi.mocked(mockHttpClient.get).mockResolvedValue({ data: undefined });

      await expect(transactionService.getTransactionById('trans-1')).rejects.toThrow();
    });

    it('should handle empty transaction ID', async () => {
      const mockResponse = { data: { success: false } };
      vi.mocked(mockHttpClient.get).mockResolvedValue(mockResponse);

      await expect(transactionService.getTransactionById('')).rejects.toThrow('Failed to fetch transaction with ID: ');
    });

    it('should handle special characters in transaction ID', async () => {
      const specialId = 'trans-@#$%';
      const mockResponse: TransactionResponse = {
        success: true,
        data: {
          id: specialId,
          patientId: 'patient-1',
          amount: 100.00,
          paymentMethod: 'cash',
          description: 'Test transaction',
          date: new Date(),
          receiptNumber: 'RCP-004',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      };

      vi.mocked(mockHttpClient.get).mockResolvedValue({ data: mockResponse });

      const result = await transactionService.getTransactionById(specialId);

      expect(mockHttpClient.get).toHaveBeenCalledWith(`/api/transactions/${specialId}`);
      expect(result).toEqual(mockResponse);
    });
  });
});