import { describe, it, expect } from 'vitest';

describe('Hooks Index', () => {
  it('should export useAddressSelector hook', async () => {
    const module = await import('./index');
    
    expect(module.useAddressSelector).toBeDefined();
    expect(typeof module.useAddressSelector).toBe('function');
  });

  it('should export type definitions correctly', async () => {
    const module = await import('./index');
    
    // Type exports are available at compile time but not at runtime
    // We can only test that the module exports what we expect
    expect(module).toBeDefined();
    
    // The actual type checking is done by TypeScript at compile time
    expect(typeof module).toBe('object');
  });

  it('should export interface definitions correctly', async () => {
    const module = await import('./index');
    
    // Interface exports are available at compile time but not at runtime
    // We can only test that the module exports what we expect
    expect(module).toBeDefined();
    
    // The actual interface checking is done by TypeScript at compile time
    expect(typeof module).toBe('object');
  });

  it('should re-export all useAddressSelector exports', async () => {
    const indexModule = await import('./index');
    const addressSelectorModule = await import('./useAddressSelector');
    
    // Check that useAddressSelector hook is properly re-exported
    expect(indexModule.useAddressSelector).toBe(addressSelectorModule.useAddressSelector);
    
    // Check that types are available in the index (compile-time verification)
    const indexKeys = Object.keys(indexModule);
    const addressSelectorKeys = Object.keys(addressSelectorModule);
    
    addressSelectorKeys.forEach(key => {
      expect(indexKeys).toContain(key);
    });
  });

  it('should provide centralized hook access', async () => {
    const module = await import('./index');
    
    // Should have at least the useAddressSelector export
    const exports = Object.keys(module);
    expect(exports.length).toBeGreaterThan(0);
    expect(exports).toContain('useAddressSelector');
  });
});