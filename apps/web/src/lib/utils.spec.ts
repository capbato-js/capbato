import { describe, it, expect } from 'vitest';
import { cn } from './utils';

describe('Utils', () => {
  describe('cn function', () => {
    it('should merge classes correctly', () => {
      expect(cn('bg-red-500', 'text-white')).toBe('bg-red-500 text-white');
    });

    it('should handle conditional classes', () => {
      expect(cn('bg-red-500', false && 'text-white', 'p-4')).toBe('bg-red-500 p-4');
    });

    it('should handle conflicting classes with tailwind-merge', () => {
      expect(cn('bg-red-500', 'bg-blue-500')).toBe('bg-blue-500');
    });

    it('should handle arrays of classes', () => {
      expect(cn(['bg-red-500', 'text-white'], 'p-4')).toBe('bg-red-500 text-white p-4');
    });

    it('should handle objects with conditional classes', () => {
      expect(cn({
        'bg-red-500': true,
        'text-white': false,
        'p-4': true,
      })).toBe('bg-red-500 p-4');
    });

    it('should handle undefined and null values', () => {
      expect(cn('bg-red-500', undefined, null, 'p-4')).toBe('bg-red-500 p-4');
    });

    it('should handle empty input', () => {
      expect(cn()).toBe('');
    });

    it('should handle nested arrays and objects', () => {
      expect(cn(
        'base-class',
        ['array-class-1', 'array-class-2'],
        {
          'conditional-true': true,
          'conditional-false': false,
        },
        undefined,
        'final-class'
      )).toBe('base-class array-class-1 array-class-2 conditional-true final-class');
    });

    it('should prioritize later classes in conflicting tailwind classes', () => {
      expect(cn('p-2 p-4 p-8')).toBe('p-8');
      expect(cn('text-sm text-lg')).toBe('text-lg');
      expect(cn('bg-red-100 bg-red-200 bg-blue-500')).toBe('bg-blue-500');
    });

    it('should handle spacing variations correctly', () => {
      expect(cn('  bg-red-500  ', '  text-white  ')).toBe('bg-red-500 text-white');
    });
  });
});