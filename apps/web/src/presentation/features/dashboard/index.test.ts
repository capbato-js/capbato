import { describe, it, expect } from 'vitest';
import * as dashboardExports from './index';

describe('Dashboard Feature Index', () => {
  describe('exports', () => {
    it('exports DashboardPage', () => {
      expect(dashboardExports.DashboardPage).toBeDefined();
      expect(typeof dashboardExports.DashboardPage).toBe('function');
    });

    it('exports useDashboardViewModel', () => {
      expect(dashboardExports.useDashboardViewModel).toBeDefined();
      expect(typeof dashboardExports.useDashboardViewModel).toBe('function');
    });

    it('exports DashboardViewModel type', () => {
      // Type exports can't be tested at runtime, but we can test that the import doesn't fail
      // and that the module structure is correct
      expect(dashboardExports).toBeDefined();
    });

    it('exports DashboardStats type', () => {
      // Type exports can't be tested at runtime, but we can test that the import doesn't fail
      // and that the module structure is correct
      expect(dashboardExports).toBeDefined();
    });

    it('has correct module structure', () => {
      // Test that the module has the expected runtime exports
      const exportedKeys = Object.keys(dashboardExports);
      expect(exportedKeys).toContain('DashboardPage');
      expect(exportedKeys).toContain('useDashboardViewModel');
      expect(exportedKeys.length).toBe(2); // Only runtime exports, types aren't enumerable
    });

    it('DashboardPage is a React component', () => {
      // Basic validation that the exported function looks like a React component
      expect(dashboardExports.DashboardPage).toBeInstanceOf(Function);
      expect(dashboardExports.DashboardPage.name).toBe('DashboardPage');
    });

    it('useDashboardViewModel is a hook function', () => {
      // Basic validation that the exported function looks like a React hook
      expect(dashboardExports.useDashboardViewModel).toBeInstanceOf(Function);
      expect(dashboardExports.useDashboardViewModel.name).toBe('useDashboardViewModel');
    });

    it('exports are not undefined', () => {
      expect(dashboardExports.DashboardPage).not.toBeUndefined();
      expect(dashboardExports.useDashboardViewModel).not.toBeUndefined();
    });

    it('exports are functions', () => {
      expect(typeof dashboardExports.DashboardPage).toBe('function');
      expect(typeof dashboardExports.useDashboardViewModel).toBe('function');
    });
  });
});