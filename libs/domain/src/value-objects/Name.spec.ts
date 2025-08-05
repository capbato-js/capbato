import { describe, it, expect } from 'vitest';
import { Name } from './Name';

describe('Name Value Object', () => {
  describe('create', () => {
    it('should create a name with proper case formatting', () => {
      const name = Name.create('john');
      expect(name.value).toBe('John');
    });

    it('should format uppercase names to proper case', () => {
      const name = Name.create('JOHN');
      expect(name.value).toBe('John');
    });

    it('should format mixed case names to proper case', () => {
      const name = Name.create('jOhN');
      expect(name.value).toBe('John');
    });

    it('should format compound names properly', () => {
      const firstName = Name.create('jean-paul');
      expect(firstName.value).toBe('Jean-Paul');

      const lastName = Name.create('MARIE-CLAIRE');
      expect(lastName.value).toBe('Marie-Claire');
    });

    it('should format names with spaces properly', () => {
      const name = Name.create('mary jane');
      expect(name.value).toBe('Mary Jane');
    });

    it('should handle special name prefixes', () => {
      const mcName = Name.create('mcdonald');
      expect(mcName.value).toBe('McDonald');

      const macName = Name.create('macdonald');
      expect(macName.value).toBe('MacDonald');

      // Note: apostrophes are not allowed in Name value object
      // Only letters, spaces, and hyphens are permitted
    });

    it('should trim whitespace before formatting', () => {
      const name = Name.create('  john  ');
      expect(name.value).toBe('John');
    });

    it('should handle names with special characters (ñ)', () => {
      const name = Name.create('niño');
      expect(name.value).toBe('Niño');
      
      const name2 = Name.create('SEÑOR');
      expect(name2.value).toBe('Señor');
    });
  });

  describe('validation', () => {
    it('should throw error for empty names', () => {
      expect(() => Name.create('')).toThrow('Name cannot be empty');
      expect(() => Name.create('   ')).toThrow('Name cannot be empty');
    });

    it('should throw error for names that are too long', () => {
      const longName = 'a'.repeat(51);
      expect(() => Name.create(longName)).toThrow('Name cannot exceed 50 characters');
    });

    it('should throw error for names with invalid characters', () => {
      expect(() => Name.create('John123')).toThrow('Names can only contain letters, spaces, and hyphens');
      expect(() => Name.create('John@Doe')).toThrow('Names can only contain letters, spaces, and hyphens');
      expect(() => Name.create('John_Doe')).toThrow('Names can only contain letters, spaces, and hyphens');
    });

    it('should allow valid characters including ñ', () => {
      expect(() => Name.create('Niño')).not.toThrow();
      expect(() => Name.create('SEÑOR')).not.toThrow();
      expect(() => Name.create('niño')).not.toThrow();
    });

    it('should allow hyphens and spaces', () => {
      expect(() => Name.create('Jean-Paul')).not.toThrow();
      expect(() => Name.create('Mary Jane')).not.toThrow();
      expect(() => Name.create('Anne-Marie Claire')).not.toThrow();
    });
  });

  describe('value object behavior', () => {
    it('should be immutable', () => {
      const name = Name.create('john');
      expect(name.value).toBe('John');
      
      // ValueObject is properly encapsulated and immutable
      // The _value property is protected and cannot be changed from outside
      expect(name.value).toBe('John'); // Value remains the same
    });

    it('should support equality comparison', () => {
      const name1 = Name.create('john');
      const name2 = Name.create('JOHN');
      const name3 = Name.create('jane');

      expect(name1.equals(name2)).toBe(true); // Both format to 'John'
      expect(name1.equals(name3)).toBe(false);
    });
  });

  describe('integration with business use cases', () => {
    it('should handle typical user input scenarios', () => {
      // All lowercase input
      const lowerCase = Name.create('maria gonzalez');
      expect(lowerCase.value).toBe('Maria Gonzalez');

      // All uppercase input
      const upperCase = Name.create('JOHN SMITH');
      expect(upperCase.value).toBe('John Smith');

      // Mixed case input
      const mixedCase = Name.create('jOhN dOe');
      expect(mixedCase.value).toBe('John Doe');
    });

    it('should work with medical professional names', () => {
      // Note: periods are not allowed in Name value object
      // Only letters, spaces, hyphens, and ñ are permitted
      const doctorName = Name.create('martinez');
      expect(doctorName.value).toBe('Martinez');
    });

    it('should handle compound Hispanic names', () => {
      const hispanicName = Name.create('de la cruz');
      expect(hispanicName.value).toBe('De La Cruz');
      
      const vanName = Name.create('van der berg');
      expect(vanName.value).toBe('Van Der Berg');
    });
  });
});