import { describe, it, expect } from 'vitest';
import { TRANSACTIONS_PAGE_CONFIG } from './transactionsPageConfig';

describe('Transactions Page Config', () => {
  describe('TRANSACTIONS_PAGE_CONFIG', () => {
    it('should export config object', () => {
      expect(TRANSACTIONS_PAGE_CONFIG).toBeDefined();
      expect(typeof TRANSACTIONS_PAGE_CONFIG).toBe('object');
    });

    it('should have error configuration', () => {
      expect(TRANSACTIONS_PAGE_CONFIG.error).toBeDefined();
      expect(typeof TRANSACTIONS_PAGE_CONFIG.error).toBe('object');
    });

    it('should have correct error config properties', () => {
      const errorConfig = TRANSACTIONS_PAGE_CONFIG.error;
      
      expect(errorConfig.color).toBe('red');
      expect(errorConfig.title).toBe('Error');
      expect(errorConfig.marginBottom).toBe('md');
      expect(errorConfig.withCloseButton).toBe(true);
    });

    it('should use readonly types (const assertions)', () => {
      // Testing that the configuration is properly typed with const assertions
      // The actual type checking is done at compile time
      const errorConfig = TRANSACTIONS_PAGE_CONFIG.error;
      
      expect(errorConfig.color).toBe('red');
      expect(errorConfig.marginBottom).toBe('md');
    });

    it('should be immutable configuration', () => {
      // The configuration should be readonly, but we can test current values
      const originalColor = TRANSACTIONS_PAGE_CONFIG.error.color;
      const originalTitle = TRANSACTIONS_PAGE_CONFIG.error.title;
      const originalMarginBottom = TRANSACTIONS_PAGE_CONFIG.error.marginBottom;
      const originalWithCloseButton = TRANSACTIONS_PAGE_CONFIG.error.withCloseButton;

      expect(originalColor).toBe('red');
      expect(originalTitle).toBe('Error');
      expect(originalMarginBottom).toBe('md');
      expect(originalWithCloseButton).toBe(true);
    });

    it('should have appropriate error styling configuration', () => {
      const errorConfig = TRANSACTIONS_PAGE_CONFIG.error;
      
      // Color should be appropriate for errors
      expect(errorConfig.color).toBe('red');
      
      // Should have a descriptive title
      expect(errorConfig.title).toMatch(/error/i);
      
      // Should have reasonable spacing
      expect(['xs', 'sm', 'md', 'lg', 'xl']).toContain(errorConfig.marginBottom);
      
      // Should allow user to close error messages
      expect(errorConfig.withCloseButton).toBe(true);
    });

    it('should maintain consistent configuration structure', () => {
      const config = TRANSACTIONS_PAGE_CONFIG;
      
      // Should have error configuration
      expect(config).toHaveProperty('error');
      
      // Error config should have expected properties
      expect(config.error).toHaveProperty('color');
      expect(config.error).toHaveProperty('title');
      expect(config.error).toHaveProperty('marginBottom');
      expect(config.error).toHaveProperty('withCloseButton');
      
      // Should not have unexpected properties
      const errorKeys = Object.keys(config.error);
      expect(errorKeys).toHaveLength(4);
      expect(errorKeys.sort()).toEqual(['color', 'marginBottom', 'title', 'withCloseButton']);
    });
  });
});