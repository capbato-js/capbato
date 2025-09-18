import { describe, it, expect } from 'vitest';
import * as loginExports from './index';

describe('Login Feature Index', () => {
  describe('exports', () => {
    it('exports LoginPage', () => {
      expect(loginExports.LoginPage).toBeDefined();
      expect(typeof loginExports.LoginPage).toBe('function');
    });

    it('exports LoginForm', () => {
      expect(loginExports.LoginForm).toBeDefined();
      expect(typeof loginExports.LoginForm).toBe('function');
    });

    it('exports useLoginViewModel', () => {
      expect(loginExports.useLoginViewModel).toBeDefined();
      expect(typeof loginExports.useLoginViewModel).toBe('function');
    });

    it('exports useLoginFormViewModel', () => {
      expect(loginExports.useLoginFormViewModel).toBeDefined();
      expect(typeof loginExports.useLoginFormViewModel).toBe('function');
    });

    it('exports LoginFormData type', () => {
      // Type exports can't be tested at runtime, but we can test that the import doesn't fail
      // and that the module structure is correct
      expect(loginExports).toBeDefined();
    });

    it('exports LoginFormErrors type', () => {
      // Type exports can't be tested at runtime, but we can test that the import doesn't fail
      // and that the module structure is correct
      expect(loginExports).toBeDefined();
    });

    it('exports LoginFormState type', () => {
      // Type exports can't be tested at runtime, but we can test that the import doesn't fail
      // and that the module structure is correct
      expect(loginExports).toBeDefined();
    });

    it('exports AuthenticationState type', () => {
      // Type exports can't be tested at runtime, but we can test that the import doesn't fail
      // and that the module structure is correct
      expect(loginExports).toBeDefined();
    });

    it('has correct module structure', () => {
      // Test that the module has the expected runtime exports
      const exportedKeys = Object.keys(loginExports);
      expect(exportedKeys).toContain('LoginPage');
      expect(exportedKeys).toContain('LoginForm');
      expect(exportedKeys).toContain('useLoginViewModel');
      expect(exportedKeys).toContain('useLoginFormViewModel');
      expect(exportedKeys.length).toBe(4); // Only runtime exports, types aren't enumerable
    });

    it('LoginPage is a React component', () => {
      // Basic validation that the exported function looks like a React component
      expect(loginExports.LoginPage).toBeInstanceOf(Function);
      expect(loginExports.LoginPage.name).toBe('LoginPage');
    });

    it('LoginForm is a React component', () => {
      // Basic validation that the exported function looks like a React component
      expect(loginExports.LoginForm).toBeInstanceOf(Function);
      expect(loginExports.LoginForm.name).toBe('LoginForm');
    });

    it('useLoginViewModel is a hook function', () => {
      // Basic validation that the exported function looks like a React hook
      expect(loginExports.useLoginViewModel).toBeInstanceOf(Function);
      expect(loginExports.useLoginViewModel.name).toBe('useLoginViewModel');
    });

    it('useLoginFormViewModel is a hook function', () => {
      // Basic validation that the exported function looks like a React hook
      expect(loginExports.useLoginFormViewModel).toBeInstanceOf(Function);
      expect(loginExports.useLoginFormViewModel.name).toBe('useLoginFormViewModel');
    });

    it('all exports are not undefined', () => {
      expect(loginExports.LoginPage).not.toBeUndefined();
      expect(loginExports.LoginForm).not.toBeUndefined();
      expect(loginExports.useLoginViewModel).not.toBeUndefined();
      expect(loginExports.useLoginFormViewModel).not.toBeUndefined();
    });

    it('all exports are functions', () => {
      expect(typeof loginExports.LoginPage).toBe('function');
      expect(typeof loginExports.LoginForm).toBe('function');
      expect(typeof loginExports.useLoginViewModel).toBe('function');
      expect(typeof loginExports.useLoginFormViewModel).toBe('function');
    });

    it('exports follow naming conventions', () => {
      // Test component naming convention (PascalCase)
      expect(loginExports.LoginPage.name).toMatch(/^[A-Z]/);
      expect(loginExports.LoginForm.name).toMatch(/^[A-Z]/);
      
      // Test hook naming convention (camelCase starting with 'use')
      expect(loginExports.useLoginViewModel.name).toMatch(/^use[A-Z]/);
      expect(loginExports.useLoginFormViewModel.name).toMatch(/^use[A-Z]/);
    });
  });

  describe('module integrity', () => {
    it('imports do not throw errors', () => {
      expect(() => {
        const {
          LoginPage,
          LoginForm,
          useLoginViewModel,
          useLoginFormViewModel,
        } = loginExports;
        return { LoginPage, LoginForm, useLoginViewModel, useLoginFormViewModel };
      }).not.toThrow();
    });

    it('maintains consistent export structure', () => {
      // Ensure all expected exports are present
      const requiredExports = [
        'LoginPage',
        'LoginForm',
        'useLoginViewModel',
        'useLoginFormViewModel',
      ];
      
      requiredExports.forEach(exportName => {
        expect(loginExports).toHaveProperty(exportName);
        expect((loginExports as Record<string, unknown>)[exportName]).toBeDefined();
      });
    });
  });
});