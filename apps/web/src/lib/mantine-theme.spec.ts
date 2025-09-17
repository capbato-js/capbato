import { describe, it, expect } from 'vitest';
import { mantineTheme, darkMantineTheme } from './mantine-theme';

describe('Mantine Theme', () => {
  describe('Light Theme Configuration', () => {
    it('should have correct primary color configuration', () => {
      expect(mantineTheme.primaryColor).toBe('blue');
      expect(mantineTheme.primaryShade).toBe(7);
    });

    it('should have blue color palette defined', () => {
      expect(mantineTheme.colors?.blue).toBeDefined();
      expect(mantineTheme.colors?.blue).toHaveLength(10);
      expect(mantineTheme.colors?.blue?.[4]).toBe('#37b7ff'); // Main theme color
    });

    it('should have tableBlue color palette defined', () => {
      expect(mantineTheme.colors?.tableBlue).toBeDefined();
      expect(mantineTheme.colors?.tableBlue).toHaveLength(10);
      expect(mantineTheme.colors?.tableBlue?.[0]).toBe('#ebf3ff');
      expect(mantineTheme.colors?.tableBlue?.[9]).toBe('#0047ab');
    });

    it('should have customGray color palette defined', () => {
      expect(mantineTheme.colors?.customGray).toBeDefined();
      expect(mantineTheme.colors?.customGray).toHaveLength(10);
      expect(mantineTheme.colors?.customGray?.[0]).toBe('#f8f9fa'); // lightest
      expect(mantineTheme.colors?.customGray?.[8]).toBe('#0f0f0f'); // darkest
    });

    it('should have navIcons color palette defined', () => {
      expect(mantineTheme.colors?.navIcons).toBeDefined();
      expect(mantineTheme.colors?.navIcons).toHaveLength(10);
      // All navigation icons should use unified dark color
      expect(mantineTheme.colors?.navIcons?.[0]).toBe('#080809');
      expect(mantineTheme.colors?.navIcons?.[4]).toBe('#080809');
    });

    it('should have valid hex color format for all color palettes', () => {
      const hexColorRegex = /^#[0-9A-Fa-f]{6}$/;
      
      // Test blue palette
      mantineTheme.colors?.blue?.forEach(color => {
        expect(color).toMatch(hexColorRegex);
      });

      // Test tableBlue palette
      mantineTheme.colors?.tableBlue?.forEach(color => {
        expect(color).toMatch(hexColorRegex);
      });

      // Test customGray palette
      mantineTheme.colors?.customGray?.forEach(color => {
        expect(color).toMatch(hexColorRegex);
      });

      // Test navIcons palette
      mantineTheme.colors?.navIcons?.forEach(color => {
        expect(color).toMatch(hexColorRegex);
      });
    });

    it('should have color progression from light to dark', () => {
      // Function to convert hex to brightness value for comparison
      const hexToBrightness = (hex: string): number => {
        const r = parseInt(hex.substr(1, 2), 16);
        const g = parseInt(hex.substr(3, 2), 16);
        const b = parseInt(hex.substr(5, 2), 16);
        return (r * 299 + g * 587 + b * 114) / 1000;
      };

      // Test blue palette progression
      const blueBrightness = mantineTheme.colors?.blue?.map(hexToBrightness) || [];
      for (let i = 1; i < blueBrightness.length; i++) {
        expect(blueBrightness[i]).toBeLessThanOrEqual(blueBrightness[i - 1]);
      }

      // Test tableBlue palette progression
      const tableBlueBrightness = mantineTheme.colors?.tableBlue?.map(hexToBrightness) || [];
      for (let i = 1; i < tableBlueBrightness.length; i++) {
        expect(tableBlueBrightness[i]).toBeLessThanOrEqual(tableBlueBrightness[i - 1]);
      }
    });

    it('should be a valid Mantine theme object', () => {
      expect(mantineTheme).toBeDefined();
      expect(typeof mantineTheme).toBe('object');
      expect(mantineTheme.primaryColor).toBeDefined();
      expect(mantineTheme.colors).toBeDefined();
    });

    it('should have specific brand color matches', () => {
      // Verify specific brand colors are correctly defined
      expect(mantineTheme.colors?.blue?.[4]).toBe('#37b7ff'); // Main logo color
      expect(mantineTheme.colors?.customGray?.[8]).toBe('#0f0f0f'); // Title text color
      expect(mantineTheme.colors?.customGray?.[0]).toBe('#f8f9fa'); // Light background
    });

    it('should have semantic color mappings', () => {
      expect(mantineTheme.other?.titleColor).toBe('#0F0F0F');
      expect(mantineTheme.other?.colors).toBeDefined();
      expect(mantineTheme.other?.colors?.border).toBeDefined();
      expect(mantineTheme.other?.colors?.border?.light).toBe('#f5f5f5');
      expect(mantineTheme.other?.colors?.border?.default).toBe('#e9ecef');
      expect(mantineTheme.other?.colors?.border?.subtle).toBe('#f0f0f0');
    });

    it('should have font family configured', () => {
      expect(mantineTheme.fontFamily).toBe('Roboto, Arial, sans-serif');
    });

    it('should have component defaults configured', () => {
      expect(mantineTheme.components?.Button?.defaultProps?.radius).toBe('md');
      expect(mantineTheme.components?.Modal?.defaultProps?.radius).toBe('md');
    });
  });

  describe('Dark Theme Configuration', () => {
    it('should inherit from light theme', () => {
      expect(darkMantineTheme.primaryColor).toBe('blue');
      expect(darkMantineTheme.primaryShade).toBe(9); // Different from light theme
      expect(darkMantineTheme.fontFamily).toBe('Roboto, Arial, sans-serif');
    });

    it('should have modified blue color palette for dark mode', () => {
      expect(darkMantineTheme.colors?.blue).toBeDefined();
      expect(darkMantineTheme.colors?.blue).toHaveLength(10);
      // Dark theme should have different blue palette
      expect(darkMantineTheme.colors?.blue?.[0]).toBe('#e7fefa');
      expect(darkMantineTheme.colors?.blue?.[9]).toBe('#00997e');
    });

    it('should have dark color palette defined', () => {
      expect(darkMantineTheme.colors?.dark).toBeDefined();
      expect(darkMantineTheme.colors?.dark).toHaveLength(10);
      expect(darkMantineTheme.colors?.dark?.[0]).toBe('#d5d7e0');
      expect(darkMantineTheme.colors?.dark?.[9]).toBe('#01010a');
    });

    it('should preserve other color palettes from light theme', () => {
      expect(darkMantineTheme.colors?.tableBlue).toEqual(mantineTheme.colors?.tableBlue);
      expect(darkMantineTheme.colors?.customGray).toEqual(mantineTheme.colors?.customGray);
      expect(darkMantineTheme.colors?.navIcons).toEqual(mantineTheme.colors?.navIcons);
    });

    it('should have valid hex colors in dark palette', () => {
      const hexColorRegex = /^#[0-9A-Fa-f]{6}$/;
      
      darkMantineTheme.colors?.dark?.forEach(color => {
        expect(color).toMatch(hexColorRegex);
      });

      darkMantineTheme.colors?.blue?.forEach(color => {
        expect(color).toMatch(hexColorRegex);
      });
    });

    it('should have dark color progression', () => {
      const hexToBrightness = (hex: string): number => {
        const r = parseInt(hex.substr(1, 2), 16);
        const g = parseInt(hex.substr(3, 2), 16);
        const b = parseInt(hex.substr(5, 2), 16);
        return (r * 299 + g * 587 + b * 114) / 1000;
      };

      // Test dark palette progression
      const darkBrightness = darkMantineTheme.colors?.dark?.map(hexToBrightness) || [];
      for (let i = 1; i < darkBrightness.length; i++) {
        expect(darkBrightness[i]).toBeLessThanOrEqual(darkBrightness[i - 1]);
      }
    });
  });

  describe('Color Accessibility', () => {
    it('should have sufficient contrast between light and dark shades', () => {
      const lightShade = mantineTheme.colors?.blue?.[0];
      const darkShade = mantineTheme.colors?.blue?.[9];
      
      expect(lightShade).toBeDefined();
      expect(darkShade).toBeDefined();
      
      // Light shade should be lighter than dark shade
      const hexToBrightness = (hex: string): number => {
        const r = parseInt(hex.substr(1, 2), 16);
        const g = parseInt(hex.substr(3, 2), 16);
        const b = parseInt(hex.substr(5, 2), 16);
        return (r * 299 + g * 587 + b * 114) / 1000;
      };

      const lightBrightness = hexToBrightness(lightShade!);
      const darkBrightness = hexToBrightness(darkShade!);
      
      expect(lightBrightness).toBeGreaterThan(darkBrightness);
    });

    it('should have accessible contrast in dark theme', () => {
      const lightShade = darkMantineTheme.colors?.dark?.[0];
      const darkShade = darkMantineTheme.colors?.dark?.[9];
      
      expect(lightShade).toBeDefined();
      expect(darkShade).toBeDefined();
      
      const hexToBrightness = (hex: string): number => {
        const r = parseInt(hex.substr(1, 2), 16);
        const g = parseInt(hex.substr(3, 2), 16);
        const b = parseInt(hex.substr(5, 2), 16);
        return (r * 299 + g * 587 + b * 114) / 1000;
      };

      const lightBrightness = hexToBrightness(lightShade!);
      const darkBrightness = hexToBrightness(darkShade!);
      
      expect(lightBrightness).toBeGreaterThan(darkBrightness);
    });
  });

  describe('Theme Consistency', () => {
    it('should export both themes', () => {
      expect(mantineTheme).toBeDefined();
      expect(darkMantineTheme).toBeDefined();
    });

    it('should have consistent structure between themes', () => {
      expect(mantineTheme.primaryColor).toBeDefined();
      expect(darkMantineTheme.primaryColor).toBeDefined();
      
      expect(mantineTheme.colors).toBeDefined();
      expect(darkMantineTheme.colors).toBeDefined();
      
      expect(mantineTheme.fontFamily).toBeDefined();
      expect(darkMantineTheme.fontFamily).toBeDefined();
    });

    it('should have different primary shades for light and dark themes', () => {
      expect(mantineTheme.primaryShade).toBe(7);
      expect(darkMantineTheme.primaryShade).toBe(9);
    });
  });

  describe('Component Configuration', () => {
    it('should configure Button component defaults', () => {
      expect(mantineTheme.components?.Button?.defaultProps?.radius).toBe('md');
    });

    it('should configure Modal component defaults', () => {
      expect(mantineTheme.components?.Modal?.defaultProps?.radius).toBe('md');
    });

    it('should have consistent component configuration across themes', () => {
      // Both themes should inherit the same component configurations
      expect(darkMantineTheme.components?.Button?.defaultProps?.radius).toBe('md');
      expect(darkMantineTheme.components?.Modal?.defaultProps?.radius).toBe('md');
    });
  });
});