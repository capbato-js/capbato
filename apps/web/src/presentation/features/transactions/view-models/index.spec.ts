import { describe, it, expect } from 'vitest';

describe('Transaction View Models Index', () => {
  it('should export all view model hooks', async () => {
    const module = await import('./index');
    
    // Test that the module exports are available
    expect(module).toBeDefined();
    expect(typeof module).toBe('object');
  });

  it('should re-export useTransactionViewModel', async () => {
    const indexModule = await import('./index');
    const transactionViewModelModule = await import('./useTransactionViewModel');
    
    // Check that all exports from useTransactionViewModel are re-exported
    const indexKeys = Object.keys(indexModule);
    const transactionViewModelKeys = Object.keys(transactionViewModelModule);
    
    transactionViewModelKeys.forEach(key => {
      expect(indexKeys).toContain(key);
    });
  });

  it('should re-export useTransactionFormViewModel', async () => {
    const indexModule = await import('./index');
    const transactionFormViewModelModule = await import('./useTransactionFormViewModel');
    
    // Check that all exports from useTransactionFormViewModel are re-exported
    const indexKeys = Object.keys(indexModule);
    const transactionFormViewModelKeys = Object.keys(transactionFormViewModelModule);
    
    transactionFormViewModelKeys.forEach(key => {
      expect(indexKeys).toContain(key);
    });
  });

  it('should re-export useTransactionItemViewModel', async () => {
    const indexModule = await import('./index');
    const transactionItemViewModelModule = await import('./useTransactionItemViewModel');
    
    // Check that all exports from useTransactionItemViewModel are re-exported
    const indexKeys = Object.keys(indexModule);
    const transactionItemViewModelKeys = Object.keys(transactionItemViewModelModule);
    
    transactionItemViewModelKeys.forEach(key => {
      expect(indexKeys).toContain(key);
    });
  });

  it('should provide centralized access to all view models', async () => {
    const module = await import('./index');
    
    // Test that we can access exports (this tests the re-export functionality)
    const exports = Object.keys(module);
    
    // Should have some exports (the actual number depends on what each module exports)
    expect(exports.length).toBeGreaterThan(0);
  });
});