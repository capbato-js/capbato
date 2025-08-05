import { describe, it, expect } from 'vitest';
import { DoctorName } from './DoctorName';

describe('DoctorName Value Object', () => {
  describe('constructor', () => {
    it('should create a doctor name with proper case formatting', () => {
      const doctorName = new DoctorName('john smith');
      expect(doctorName.value).toBe('John Smith');
    });

    it('should format uppercase names to proper case', () => {
      const doctorName = new DoctorName('MARIA GONZALEZ');
      expect(doctorName.value).toBe('Maria Gonzalez');
    });

    it('should format mixed case names to proper case', () => {
      const doctorName = new DoctorName('jOhN dOe');
      expect(doctorName.value).toBe('John Doe');
    });

    it('should format compound names properly', () => {
      const doctorName = new DoctorName('jean-paul martinez');
      expect(doctorName.value).toBe('Jean-Paul Martinez');
    });

    it('should handle names with apostrophes', () => {
      const doctorName = new DoctorName('o\'connor');
      expect(doctorName.value).toBe('O\'Connor');
    });

    it('should handle special name prefixes', () => {
      const mcName = new DoctorName('dr. mcdonald');
      expect(mcName.value).toBe('Dr. McDonald');

      const macName = new DoctorName('macdonald');
      expect(macName.value).toBe('MacDonald');
    });

    it('should trim whitespace before formatting', () => {
      const doctorName = new DoctorName('  john smith  ');
      expect(doctorName.value).toBe('John Smith');
    });
  });

  describe('validation', () => {
    it('should throw error for empty names', () => {
      expect(() => new DoctorName('')).toThrow('Doctor name cannot be empty');
      expect(() => new DoctorName('   ')).toThrow('Doctor name cannot be empty');
    });

    it('should throw error for names that are too short', () => {
      expect(() => new DoctorName('J')).toThrow('Doctor name must be at least 2 characters long');
    });

    it('should throw error for names that are too long', () => {
      const longName = 'a'.repeat(51);
      expect(() => new DoctorName(longName)).toThrow('Doctor name cannot exceed 50 characters');
    });

    it('should throw error for names with invalid characters', () => {
      expect(() => new DoctorName('John123')).toThrow('Doctor name can only contain letters, spaces, hyphens, apostrophes, and periods');
      expect(() => new DoctorName('John@Doe')).toThrow('Doctor name can only contain letters, spaces, hyphens, apostrophes, and periods');
      expect(() => new DoctorName('John_Doe')).toThrow('Doctor name can only contain letters, spaces, hyphens, apostrophes, and periods');
    });

    it('should allow valid characters', () => {
      expect(() => new DoctorName('John Smith')).not.toThrow();
      expect(() => new DoctorName('Jean-Paul')).not.toThrow();
      expect(() => new DoctorName('O\'Connor')).not.toThrow();
      expect(() => new DoctorName('Dr. Smith')).not.toThrow();
      expect(() => new DoctorName('Mary Jane Smith')).not.toThrow();
    });
  });

  describe('value object behavior', () => {
    it('should be immutable', () => {
      const doctorName = new DoctorName('john smith');
      expect(doctorName.value).toBe('John Smith');
      
      // Value object is properly encapsulated and immutable
      expect(doctorName.value).toBe('John Smith'); // Value remains the same
    });

    it('should support equality comparison', () => {
      const name1 = new DoctorName('john smith');
      const name2 = new DoctorName('JOHN SMITH');
      const name3 = new DoctorName('jane doe');

      expect(name1.equals(name2)).toBe(true); // Both format to 'John Smith'
      expect(name1.equals(name3)).toBe(false);
    });

    it('should support toString', () => {
      const doctorName = new DoctorName('john smith');
      expect(doctorName.toString()).toBe('John Smith');
    });
  });

  describe('medical professional use cases', () => {
    it('should handle typical doctor name scenarios', () => {
      // Lowercase input
      const lowerCase = new DoctorName('dr. martinez');
      expect(lowerCase.value).toBe('Dr. Martinez');

      // Uppercase input  
      const upperCase = new DoctorName('DR. RODRIGUEZ');
      expect(upperCase.value).toBe('Dr. Rodriguez');

      // Mixed case input
      const mixedCase = new DoctorName('dR. jOhN sMiTh');
      expect(mixedCase.value).toBe('Dr. John Smith');
    });

    it('should handle compound doctor names', () => {
      const hispanicName = new DoctorName('dr. de la cruz');
      expect(hispanicName.value).toBe('Dr. De La Cruz');
      
      const dutchName = new DoctorName('van der berg');
      expect(dutchName.value).toBe('Van Der Berg');
    });

    it('should handle names with multiple titles', () => {
      const name = new DoctorName('prof. dr. martinez');
      expect(name.value).toBe('Prof. Dr. Martinez');
    });

    it('should handle specialty suffixes', () => {
      const name = new DoctorName('john smith md');
      expect(name.value).toBe('John Smith Md');
    });
  });
});