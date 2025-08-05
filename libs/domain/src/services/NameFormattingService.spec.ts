import { describe, it, expect } from 'vitest';
import { NameFormattingService } from './NameFormattingService';

describe('NameFormattingService', () => {
  describe('formatToProperCase', () => {
    it('should format lowercase names to proper case', () => {
      expect(NameFormattingService.formatToProperCase('john')).toBe('John');
      expect(NameFormattingService.formatToProperCase('mary')).toBe('Mary');
      expect(NameFormattingService.formatToProperCase('jose')).toBe('Jose');
    });

    it('should format uppercase names to proper case', () => {
      expect(NameFormattingService.formatToProperCase('JOHN')).toBe('John');
      expect(NameFormattingService.formatToProperCase('MARY')).toBe('Mary');
      expect(NameFormattingService.formatToProperCase('JOSE')).toBe('Jose');
    });

    it('should handle mixed case names correctly', () => {
      expect(NameFormattingService.formatToProperCase('jOhN')).toBe('John');
      expect(NameFormattingService.formatToProperCase('mArY')).toBe('Mary');
      expect(NameFormattingService.formatToProperCase('JoSe')).toBe('Jose');
    });

    it('should format names with spaces properly', () => {
      expect(NameFormattingService.formatToProperCase('john doe')).toBe('John Doe');
      expect(NameFormattingService.formatToProperCase('mary jane smith')).toBe('Mary Jane Smith');
      expect(NameFormattingService.formatToProperCase('JOHN DOE')).toBe('John Doe');
      expect(NameFormattingService.formatToProperCase('john doe')).toBe('John Doe');
    });

    it('should format names with hyphens properly', () => {
      expect(NameFormattingService.formatToProperCase('jean-paul')).toBe('Jean-Paul');
      expect(NameFormattingService.formatToProperCase('MARIE-CLAIRE')).toBe('Marie-Claire');
      expect(NameFormattingService.formatToProperCase('anna-maria')).toBe('Anna-Maria');
    });

    it('should format names with multiple spaces correctly', () => {
      expect(NameFormattingService.formatToProperCase('john  doe')).toBe('John  Doe');
      expect(NameFormattingService.formatToProperCase('mary   jane   smith')).toBe('Mary   Jane   Smith');
    });

    it('should handle special name prefixes correctly', () => {
      expect(NameFormattingService.formatToProperCase('mcdonald')).toBe('McDonald');
      expect(NameFormattingService.formatToProperCase('MCDONALD')).toBe('McDonald');
      expect(NameFormattingService.formatToProperCase('macdonald')).toBe('MacDonald');
      expect(NameFormattingService.formatToProperCase('MACDONALD')).toBe('MacDonald');
      expect(NameFormattingService.formatToProperCase('o\'connor')).toBe('O\'Connor');
      expect(NameFormattingService.formatToProperCase('O\'CONNOR')).toBe('O\'Connor');
    });

    it('should handle short special prefixes correctly', () => {
      expect(NameFormattingService.formatToProperCase('mc')).toBe('Mc');
      expect(NameFormattingService.formatToProperCase('mac')).toBe('Mac');
      expect(NameFormattingService.formatToProperCase('o\'')).toBe('O\'');
    });

    it('should handle single character names', () => {
      expect(NameFormattingService.formatToProperCase('j')).toBe('J');
      expect(NameFormattingService.formatToProperCase('a')).toBe('A');
      expect(NameFormattingService.formatToProperCase('x')).toBe('X');
    });

    it('should handle empty and null inputs', () => {
      expect(NameFormattingService.formatToProperCase('')).toBe('');
      expect(NameFormattingService.formatToProperCase('   ')).toBe('');
      expect(NameFormattingService.formatToProperCase(null as any)).toBe(null);
      expect(NameFormattingService.formatToProperCase(undefined as any)).toBe(undefined);
    });

    it('should preserve leading and trailing spaces after trimming', () => {
      expect(NameFormattingService.formatToProperCase('  john  ')).toBe('John');
      expect(NameFormattingService.formatToProperCase('\tjohn\t')).toBe('John');
    });

    it('should handle complex names with multiple components', () => {
      expect(NameFormattingService.formatToProperCase('jean-paul de la cruz')).toBe('Jean-Paul De La Cruz');
      expect(NameFormattingService.formatToProperCase('MARIE-CLAIRE VAN DER BERG')).toBe('Marie-Claire Van Der Berg');
      expect(NameFormattingService.formatToProperCase('anna-maria o\'connor-smith')).toBe('Anna-Maria O\'Connor-Smith');
    });

    it('should handle names with special characters correctly', () => {
      expect(NameFormattingService.formatToProperCase('josé')).toBe('José');
      expect(NameFormattingService.formatToProperCase('MARÍA')).toBe('María');
      expect(NameFormattingService.formatToProperCase('françois')).toBe('François');
    });
  });

  describe('isProperlyFormatted', () => {
    it('should return true for properly formatted names', () => {
      expect(NameFormattingService.isProperlyFormatted('John')).toBe(true);
      expect(NameFormattingService.isProperlyFormatted('Mary Jane')).toBe(true);
      expect(NameFormattingService.isProperlyFormatted('Jean-Paul')).toBe(true);
      expect(NameFormattingService.isProperlyFormatted('McDonald')).toBe(true);
      expect(NameFormattingService.isProperlyFormatted('O\'Connor')).toBe(true);
    });

    it('should return false for improperly formatted names', () => {
      expect(NameFormattingService.isProperlyFormatted('john')).toBe(false);
      expect(NameFormattingService.isProperlyFormatted('JOHN')).toBe(false);
      expect(NameFormattingService.isProperlyFormatted('jOhN')).toBe(false);
      expect(NameFormattingService.isProperlyFormatted('mary jane')).toBe(false);
      expect(NameFormattingService.isProperlyFormatted('MARY JANE')).toBe(false);
      expect(NameFormattingService.isProperlyFormatted('mcdonald')).toBe(false);
      expect(NameFormattingService.isProperlyFormatted('MCDONALD')).toBe(false);
    });

    it('should return false for empty or invalid inputs', () => {
      expect(NameFormattingService.isProperlyFormatted('')).toBe(false);
      expect(NameFormattingService.isProperlyFormatted(null as any)).toBe(false);
      expect(NameFormattingService.isProperlyFormatted(undefined as any)).toBe(false);
    });
  });

  describe('edge cases and business requirements', () => {
    it('should handle the specific use case mentioned in requirements', () => {
      // Users input all caps
      expect(NameFormattingService.formatToProperCase('JOHN SMITH')).toBe('John Smith');
      expect(NameFormattingService.formatToProperCase('MARIA GONZALEZ')).toBe('Maria Gonzalez');
      
      // Users input all lowercase
      expect(NameFormattingService.formatToProperCase('john smith')).toBe('John Smith');
      expect(NameFormattingService.formatToProperCase('maria gonzalez')).toBe('Maria Gonzalez');
      
      // Mixed case should be normalized
      expect(NameFormattingService.formatToProperCase('jOhN sMiTh')).toBe('John Smith');
      expect(NameFormattingService.formatToProperCase('mArIa GoNzAlEz')).toBe('Maria Gonzalez');
    });

    it('should maintain consistency for common medical professional names', () => {
      expect(NameFormattingService.formatToProperCase('dr. john smith')).toBe('Dr. John Smith');
      expect(NameFormattingService.formatToProperCase('DR. MARIA GONZALEZ')).toBe('Dr. Maria Gonzalez');
    });

    it('should handle names commonly found in patient records', () => {
      expect(NameFormattingService.formatToProperCase('rodriguez')).toBe('Rodriguez');
      expect(NameFormattingService.formatToProperCase('FERNANDEZ')).toBe('Fernandez');
      expect(NameFormattingService.formatToProperCase('de la cruz')).toBe('De La Cruz');
      expect(NameFormattingService.formatToProperCase('VAN DER BERG')).toBe('Van Der Berg');
    });
  });
});