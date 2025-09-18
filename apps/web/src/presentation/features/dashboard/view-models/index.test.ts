import { describe, it, expect } from 'vitest';
import * as viewModels from './index';

describe('Dashboard View Models Index', () => {
  describe('exports', () => {
    it('exports useDashboardViewModel', () => {
      expect(viewModels.useDashboardViewModel).toBeDefined();
      expect(typeof viewModels.useDashboardViewModel).toBe('function');
    });

    it('exports DashboardViewModel type', () => {
      // Type exports can't be tested at runtime, but we can test that the import doesn't fail
      // and that the module structure is correct
      expect(viewModels).toBeDefined();
    });

    it('exports DashboardStats type', () => {
      // Type exports can't be tested at runtime, but we can test that the import doesn't fail
      // and that the module structure is correct
      expect(viewModels).toBeDefined();
    });

    it('has correct module structure', () => {
      // Test that the module has the expected exports
      const exportedKeys = Object.keys(viewModels);
      expect(exportedKeys).toContain('useDashboardViewModel');
      expect(exportedKeys.length).toBe(1); // Only runtime exports, types aren't enumerable
    });

    it('useDashboardViewModel is a hook function', () => {
      // Basic validation that the exported function looks like a React hook
      expect(viewModels.useDashboardViewModel).toBeInstanceOf(Function);
      expect(viewModels.useDashboardViewModel.name).toBe('useDashboardViewModel');
    });
  });
});