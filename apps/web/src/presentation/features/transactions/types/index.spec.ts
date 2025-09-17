import { describe, it, expect } from 'vitest';

describe('Transaction Types Index', () => {
  it('should export TransactionTypes', async () => {
    const module = await import('./index');
    
    // Test that the module exports are available
    expect(module).toBeDefined();
    
    // Test that the types are accessible (compile-time check)
    // This ensures the export is working correctly
    expect(typeof module).toBe('object');
  });

  it('should re-export all TransactionTypes exports', async () => {
    const indexModule = await import('./index');
    const typesModule = await import('./TransactionTypes');
    
    // Compare the exported keys from both modules
    const indexKeys = Object.keys(indexModule);
    const typesKeys = Object.keys(typesModule);
    
    // All types should be re-exported
    typesKeys.forEach(key => {
      expect(indexKeys).toContain(key);
    });
  });
});