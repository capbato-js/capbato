import { describe, it, expect } from 'vitest';

describe('Layouts Index', () => {
  it('should export MainLayout', async () => {
    const module = await import('./index');
    
    // Test that the module exports MainLayout
    expect(module).toBeDefined();
    expect(module.MainLayout).toBeDefined();
  }, 10000);

  it('should re-export MainLayout correctly', async () => {
    const indexModule = await import('./index');
    const mainLayoutModule = await import('./MainLayout');
    
    // Check that MainLayout is properly re-exported
    expect(indexModule.MainLayout).toBe(mainLayoutModule.MainLayout);
  });

  it('should provide centralized layout exports', async () => {
    const module = await import('./index');
    
    // Should have MainLayout export
    expect('MainLayout' in module).toBe(true);
    
    // Test that MainLayout is a component (function)
    expect(typeof module.MainLayout).toBe('function');
  });
});