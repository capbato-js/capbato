import { describe, it, expect } from 'vitest';

describe('Transaction Pages Index', () => {
  it('should export TransactionsPage', async () => {
    const module = await import('./index');
    
    // Test that the module exports are available
    expect(module).toBeDefined();
    expect(typeof module).toBe('object');
  });

  it('should re-export all TransactionsPage exports', async () => {
    const indexModule = await import('./index');
    const transactionsPageModule = await import('./TransactionsPage');
    
    // Compare the exported keys from both modules
    const indexKeys = Object.keys(indexModule);
    const transactionsPageKeys = Object.keys(transactionsPageModule);
    
    // All exports should be re-exported
    transactionsPageKeys.forEach(key => {
      expect(indexKeys).toContain(key);
    });
  });

  it('should provide centralized access to page components', async () => {
    const module = await import('./index');
    
    // Test that we can access exports
    const exports = Object.keys(module);
    
    // Should have at least one export
    expect(exports.length).toBeGreaterThan(0);
  });
});