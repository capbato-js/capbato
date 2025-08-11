import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { subscribeWithSelector } from 'zustand/middleware';
import { container } from '../di/container';
import type { TransactionStore } from './TransactionStoreInterface';
import type { ITransactionApiService } from '../api/ITransactionApiService';
import type {
  TransactionDto,
  CreateTransactionRequestDto,
} from '@nx-starter/application-shared';

// Transaction token (we'll add this to the DI tokens)
const TRANSACTION_API_SERVICE_TOKEN = 'TransactionApiService';

export const useTransactionStore = create<TransactionStore>()(
  subscribeWithSelector(
    devtools(
      immer((set, get) => {
        // Lazy resolve API service
        const getApiService = () =>
          container.resolve<ITransactionApiService>(TRANSACTION_API_SERVICE_TOKEN);

        return {
          // Initial state
          transactions: [],
          status: 'idle',
          error: null,

          // Computed values as functions
          getIsLoading() {
            return get().status === 'loading';
          },

          getIsIdle() {
            return get().status === 'idle';
          },

          getHasError() {
            return get().status === 'failed';
          },

          getTransactionById(id: string) {
            return get().transactions.find(transaction => transaction.id === id);
          },

          getStats() {
            const { transactions } = get();
            return {
              total: transactions.length,
              totalAmount: transactions.reduce((sum, t) => sum + t.totalAmount, 0),
              cashTransactions: transactions.filter(t => t.paymentMethod === 'Cash').length,
              creditCardTransactions: transactions.filter(t => t.paymentMethod === 'Credit Card').length,
            };
          },

          // Actions
          async loadTransactions() {
            set((state) => {
              state.status = 'loading';
              state.error = null;
            });

            try {
              const response = await getApiService().getAllTransactions();
              set((state) => {
                state.transactions = response.data;
                state.status = 'succeeded';
              });
            } catch (error) {
              set((state) => {
                state.error =
                  error instanceof Error
                    ? error.message
                    : 'Failed to load transactions';
                state.status = 'failed';
              });
            }
          },

          async createTransaction(data: CreateTransactionRequestDto) {
            set((state) => {
              state.error = null;
            });

            try {
              const response = await getApiService().createTransaction(data);
              set((state) => {
                state.transactions.unshift(response.data);
                state.status = 'succeeded';
              });
            } catch (error) {
              set((state) => {
                state.error =
                  error instanceof Error
                    ? error.message
                    : 'Failed to create transaction';
                state.status = 'failed';
              });
              throw error; // Re-throw to allow UI to handle
            }
          },

          async deleteTransaction(id: string) {
            set((state) => {
              state.error = null;
            });

            try {
              await getApiService().deleteTransaction(id);
              set((state) => {
                state.transactions = state.transactions.filter(
                  (transaction) => transaction.id !== id
                );
                state.status = 'succeeded';
              });
            } catch (error) {
              set((state) => {
                state.error =
                  error instanceof Error
                    ? error.message
                    : 'Failed to delete transaction';
                state.status = 'failed';
              });
              throw error; // Re-throw to allow UI to handle
            }
          },

          async getTransaction(id: string): Promise<TransactionDto> {
            // Check if transaction is already in store
            const existingTransaction = get().getTransactionById(id);
            if (existingTransaction) {
              return existingTransaction;
            }

            // Otherwise fetch from API
            try {
              const response = await getApiService().getTransactionById(id);
              
              // Optionally add to store for caching
              set((state) => {
                const exists = state.transactions.some(t => t.id === id);
                if (!exists) {
                  state.transactions.push(response.data);
                }
              });

              return response.data;
            } catch (error) {
              set((state) => {
                state.error =
                  error instanceof Error
                    ? error.message
                    : `Failed to fetch transaction with ID: ${id}`;
                state.status = 'failed';
              });
              throw error;
            }
          },

          clearError() {
            set((state) => {
              state.error = null;
              if (state.status === 'failed') {
                state.status = 'idle';
              }
            });
          },
        };
      }),
      { name: 'transaction-store' }
    )
  )
);

// Export the transaction token for DI registration
export { TRANSACTION_API_SERVICE_TOKEN };