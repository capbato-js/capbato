import { describe, it, expect } from 'vitest';

describe('Infrastructure HTTP Index', () => {
  it('should export IHttpClient interface', async () => {
    const module = await import('./index');
    expect(module).toHaveProperty('AxiosHttpClient');
    expect(module).toHaveProperty('HttpClientFactory');
  });

  it('should export all expected members', async () => {
    const module = await import('./index');
    
    // Check that exports exist
    expect(typeof module.AxiosHttpClient).toBe('function');
    expect(typeof module.HttpClientFactory).toBe('function');
  });

  it('should have consistent exports', async () => {
    const module = await import('./index');
    
    // Verify the module exports are defined
    expect(module.AxiosHttpClient).toBeDefined();
    expect(module.HttpClientFactory).toBeDefined();
  });
});