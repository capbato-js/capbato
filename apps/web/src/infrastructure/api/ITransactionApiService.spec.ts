import { describe, it, expect } from 'vitest';
import { ITransactionApiService } from './ITransactionApiService';

describe('ITransactionApiService', () => {
  describe('interface contract', () => {
    it('should define all required methods with correct signatures', () => {
      const mockService: ITransactionApiService = {
        getAllTransactions: async () => ({ success: true, data: [] }),
        getTransactionById: async (id: string) => ({ success: true, data: {} as any }),
        createTransaction: async (transactionData: any) => ({ success: true, data: {} as any }),
        deleteTransaction: async (id: string) => ({ success: true })
      };

      const methods = ['getAllTransactions', 'getTransactionById', 'createTransaction', 'deleteTransaction'];
      methods.forEach(method => {
        expect(mockService[method as keyof ITransactionApiService]).toBeDefined();
        expect(typeof mockService[method as keyof ITransactionApiService]).toBe('function');
      });
    });

    it('should ensure all methods return Promises', async () => {
      const mockService: ITransactionApiService = {
        getAllTransactions: async () => ({ success: true, data: [] }),
        getTransactionById: async () => ({ success: true, data: {} as any }),
        createTransaction: async () => ({ success: true, data: {} as any }),
        deleteTransaction: async () => ({ success: true })
      };

      const results = await Promise.all([
        mockService.getAllTransactions(),
        mockService.getTransactionById('id'),
        mockService.createTransaction({}),
        mockService.deleteTransaction('id')
      ]);

      expect(results).toHaveLength(4);
      results.forEach(result => expect(result).toBeDefined());
    });
  });
});