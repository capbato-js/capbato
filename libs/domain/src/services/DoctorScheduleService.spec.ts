import { DoctorScheduleService } from './DoctorScheduleService';
import { DoctorSchedulePattern } from '../value-objects/DoctorSchedulePattern';

describe('DoctorScheduleService', () => {
  describe('getDefaultSchedulePattern', () => {
    it('should assign MWF pattern to first doctor (index 0)', () => {
      const pattern = DoctorScheduleService.getDefaultSchedulePattern(0);
      expect(pattern.equals(DoctorSchedulePattern.MWF)).toBe(true);
      expect(pattern.toString()).toBe('MWF');
    });

    it('should assign TTH pattern to second doctor (index 1)', () => {
      const pattern = DoctorScheduleService.getDefaultSchedulePattern(1);
      expect(pattern.equals(DoctorSchedulePattern.TTH)).toBe(true);
      expect(pattern.toString()).toBe('TTH');
    });

    it('should throw error for third doctor (index 2) and beyond', () => {
      expect(() => DoctorScheduleService.getDefaultSchedulePattern(2))
        .toThrow('Only supports up to 2 doctors with MWF and TTH patterns');
      
      expect(() => DoctorScheduleService.getDefaultSchedulePattern(3))
        .toThrow('Only supports up to 2 doctors with MWF and TTH patterns');
    });

    it('should throw error for negative index', () => {
      expect(() => DoctorScheduleService.getDefaultSchedulePattern(-1))
        .toThrow('Doctor index cannot be negative');
    });
  });

  describe('getExpectedPatternForPosition', () => {
    it('should return MWF for first doctor position', () => {
      const pattern = DoctorScheduleService.getExpectedPatternForPosition(2, 1);
      expect(pattern.equals(DoctorSchedulePattern.MWF)).toBe(true);
    });

    it('should return TTH for second doctor position', () => {
      const pattern = DoctorScheduleService.getExpectedPatternForPosition(2, 2);
      expect(pattern.equals(DoctorSchedulePattern.TTH)).toBe(true);
    });

    it('should throw error for invalid position', () => {
      expect(() => DoctorScheduleService.getExpectedPatternForPosition(2, 0))
        .toThrow('Doctor position must be at least 1');
      
      expect(() => DoctorScheduleService.getExpectedPatternForPosition(2, 3))
        .toThrow('Doctor position cannot exceed total doctors');
    });
  });

  describe('validateSchedulePatterns', () => {
    it('should validate empty patterns array', () => {
      const result = DoctorScheduleService.validateSchedulePatterns([]);
      expect(result.isValid).toBe(true);
      expect(result.issues).toHaveLength(0);
      expect(result.suggestions).toHaveLength(1);
    });

    it('should detect identical schedules', () => {
      const patterns = [DoctorSchedulePattern.MWF, DoctorSchedulePattern.MWF];
      const result = DoctorScheduleService.validateSchedulePatterns(patterns);
      
      expect(result.isValid).toBe(false);
      expect(result.issues).toContain('Doctors 1 and 2 have identical schedules, which may cause conflicts');
    });

    it('should validate ideal 2-doctor MWF/TTH split', () => {
      const patterns = [DoctorSchedulePattern.MWF, DoctorSchedulePattern.TTH];
      const result = DoctorScheduleService.validateSchedulePatterns(patterns);
      
      expect(result.isValid).toBe(true);
      expect(result.issues).toHaveLength(0);
    });

    it('should suggest MWF/TTH for any 2-doctor setup', () => {
      // Since we only support MWF and TTH patterns, any validation should suggest this ideal split
      const patterns = [DoctorSchedulePattern.MWF, DoctorSchedulePattern.MWF]; // duplicate patterns
      const result = DoctorScheduleService.validateSchedulePatterns(patterns);
      
      expect(result.suggestions).toContain('For optimal coverage with 2 doctors, consider using MWF and TTH patterns');
    });

    it('should detect coverage gaps', () => {
      const mondayOnly = new DoctorSchedulePattern(['MONDAY']);
      const result = DoctorScheduleService.validateSchedulePatterns([mondayOnly]);
      
      expect(result.isValid).toBe(false);
      expect(result.issues.some(issue => issue.includes('No coverage for'))).toBe(true);
    });
  });

  describe('suggestOptimalPatterns', () => {
    it('should suggest MWF for single doctor', () => {
      const patterns = DoctorScheduleService.suggestOptimalPatterns(1);
      expect(patterns).toHaveLength(1);
      expect(patterns[0].equals(DoctorSchedulePattern.MWF)).toBe(true);
    });

    it('should suggest MWF and TTH for two doctors', () => {
      const patterns = DoctorScheduleService.suggestOptimalPatterns(2);
      expect(patterns).toHaveLength(2);
      expect(patterns[0].equals(DoctorSchedulePattern.MWF)).toBe(true);
      expect(patterns[1].equals(DoctorSchedulePattern.TTH)).toBe(true);
    });

    it('should throw error for more than two doctors', () => {
      expect(() => DoctorScheduleService.suggestOptimalPatterns(3))
        .toThrow('Only supports up to 2 doctors with MWF and TTH patterns');
      
      expect(() => DoctorScheduleService.suggestOptimalPatterns(4))
        .toThrow('Only supports up to 2 doctors with MWF and TTH patterns');
    });

    it('should throw error for invalid number of doctors', () => {
      expect(() => DoctorScheduleService.suggestOptimalPatterns(0))
        .toThrow('Number of doctors must be at least 1');
    });
  });

  describe('getComplementaryPattern', () => {
    it('should return TTH as complement to MWF', () => {
      const complement = DoctorScheduleService.getComplementaryPattern(DoctorSchedulePattern.MWF);
      expect(complement.equals(DoctorSchedulePattern.TTH)).toBe(true);
    });

    it('should return MWF as complement to TTH', () => {
      const complement = DoctorScheduleService.getComplementaryPattern(DoctorSchedulePattern.TTH);
      expect(complement.equals(DoctorSchedulePattern.MWF)).toBe(true);
    });

    it('should return non-overlapping days for custom patterns', () => {
      const mondayWednesday = new DoctorSchedulePattern(['MONDAY', 'WEDNESDAY']);
      const complement = DoctorScheduleService.getComplementaryPattern(mondayWednesday);
      
      // Should include Tuesday, Thursday, Friday (the remaining weekdays)
      expect(complement.includesDay('TUESDAY')).toBe(true);
      expect(complement.includesDay('THURSDAY')).toBe(true);
      expect(complement.includesDay('FRIDAY')).toBe(true);
      expect(complement.includesDay('MONDAY')).toBe(false);
      expect(complement.includesDay('WEDNESDAY')).toBe(false);
    });

              it('should return TTH fallback for non-standard patterns', () => {
      // Test with a custom pattern since WEEKDAYS no longer exists
      const customPattern = new DoctorSchedulePattern(['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY']);
      const complement = DoctorScheduleService.getComplementaryPattern(customPattern);
      expect(complement.equals(DoctorSchedulePattern.TTH)).toBe(true);
    });
  });

  describe('isPatternAppropriateForPosition', () => {
    it('should return true for appropriate patterns', () => {
      expect(DoctorScheduleService.isPatternAppropriateForPosition(0, DoctorSchedulePattern.MWF)).toBe(true);
      expect(DoctorScheduleService.isPatternAppropriateForPosition(1, DoctorSchedulePattern.TTH)).toBe(true);
    });

    it('should return false for inappropriate patterns', () => {
      expect(DoctorScheduleService.isPatternAppropriateForPosition(0, DoctorSchedulePattern.TTH)).toBe(false);
      expect(DoctorScheduleService.isPatternAppropriateForPosition(1, DoctorSchedulePattern.MWF)).toBe(false);
    });
  });

  describe('getAssignmentDescription', () => {
    it('should return descriptive text about assignment logic', () => {
      const description = DoctorScheduleService.getAssignmentDescription();
      expect(description).toContain('First doctor');
      expect(description).toContain('MWF');
      expect(description).toContain('Second doctor');
      expect(description).toContain('TTH');
      expect(description).toContain('Additional doctors');
    });
  });
});