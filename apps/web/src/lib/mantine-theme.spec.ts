import { describe, it, expect } from 'vitest';
import { mantineTheme } from './mantine-theme';

describe('Mantine Theme', () => {
  describe('Theme Configuration', () => {
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
  });
});