import { DoctorSchedulePattern, DayOfWeek } from './DoctorSchedulePattern';

describe('DoctorSchedulePattern', () => {
  describe('Constructor', () => {
    it('should create pattern with valid days', () => {
      const pattern = new DoctorSchedulePattern(['MONDAY', 'WEDNESDAY', 'FRIDAY']);
      expect(pattern.days).toEqual(['MONDAY', 'WEDNESDAY', 'FRIDAY']);
    });

    it('should remove duplicates and sort days', () => {
      const pattern = new DoctorSchedulePattern(['FRIDAY', 'MONDAY', 'WEDNESDAY', 'MONDAY']);
      expect(pattern.days).toEqual(['MONDAY', 'WEDNESDAY', 'FRIDAY']);
    });

    it('should throw error for empty days array', () => {
      expect(() => new DoctorSchedulePattern([])).toThrow('Doctor schedule pattern must include at least one day');
    });

    it('should throw error for invalid day', () => {
      expect(() => new DoctorSchedulePattern(['INVALID_DAY' as DayOfWeek])).toThrow('Invalid day of week: INVALID_DAY');
    });
  });

  describe('Predefined patterns', () => {
    it('should have MWF pattern', () => {
      expect(DoctorSchedulePattern.MWF.days).toEqual(['MONDAY', 'WEDNESDAY', 'FRIDAY']);
    });

    it('should have TTH pattern', () => {
      expect(DoctorSchedulePattern.TTH.days).toEqual(['TUESDAY', 'THURSDAY']);
    });

    it('should have WEEKDAYS pattern', () => {
      expect(DoctorSchedulePattern.WEEKDAYS.days).toEqual(['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY']);
    });

    it('should have ALL_DAYS pattern', () => {
      expect(DoctorSchedulePattern.ALL_DAYS.days).toEqual(['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY']);
    });
  });

  describe('fromString', () => {
    it('should create MWF pattern from string', () => {
      const pattern = DoctorSchedulePattern.fromString('MWF');
      expect(pattern.days).toEqual(['MONDAY', 'WEDNESDAY', 'FRIDAY']);
    });

    it('should create TTH pattern from string', () => {
      const pattern = DoctorSchedulePattern.fromString('TTH');
      expect(pattern.days).toEqual(['TUESDAY', 'THURSDAY']);
    });

    it('should create pattern from individual day codes', () => {
      const pattern = DoctorSchedulePattern.fromString('MRF'); // Monday, Thursday (R), Friday
      expect(pattern.days).toEqual(['MONDAY', 'THURSDAY', 'FRIDAY']);
    });

    it('should be case insensitive', () => {
      const pattern = DoctorSchedulePattern.fromString('mwf');
      expect(pattern.days).toEqual(['MONDAY', 'WEDNESDAY', 'FRIDAY']);
    });

    it('should throw error for invalid pattern', () => {
      expect(() => DoctorSchedulePattern.fromString('XYZ')).toThrow('Invalid schedule pattern: XYZ');
    });
  });

  describe('fromDayNames', () => {
    it('should create pattern from full day names', () => {
      const pattern = DoctorSchedulePattern.fromDayNames(['monday', 'wednesday', 'friday']);
      expect(pattern.days).toEqual(['MONDAY', 'WEDNESDAY', 'FRIDAY']);
    });

    it('should create pattern from abbreviated day names', () => {
      const pattern = DoctorSchedulePattern.fromDayNames(['mon', 'wed', 'fri']);
      expect(pattern.days).toEqual(['MONDAY', 'WEDNESDAY', 'FRIDAY']);
    });

    it('should be case insensitive', () => {
      const pattern = DoctorSchedulePattern.fromDayNames(['MONDAY', 'wednesday', 'FRI']);
      expect(pattern.days).toEqual(['MONDAY', 'WEDNESDAY', 'FRIDAY']);
    });

    it('should throw error for invalid day name', () => {
      expect(() => DoctorSchedulePattern.fromDayNames(['invalid'])).toThrow('Invalid day name: invalid');
    });
  });

  describe('includesDay', () => {
    const pattern = DoctorSchedulePattern.MWF;

    it('should return true for included days', () => {
      expect(pattern.includesDay('MONDAY')).toBe(true);
      expect(pattern.includesDay('WEDNESDAY')).toBe(true);
      expect(pattern.includesDay('FRIDAY')).toBe(true);
    });

    it('should return false for excluded days', () => {
      expect(pattern.includesDay('TUESDAY')).toBe(false);
      expect(pattern.includesDay('THURSDAY')).toBe(false);
      expect(pattern.includesDay('SATURDAY')).toBe(false);
      expect(pattern.includesDay('SUNDAY')).toBe(false);
    });
  });

  describe('includesDate', () => {
    const pattern = DoctorSchedulePattern.MWF;

    it('should return true for dates on included days', () => {
      // Monday, January 1, 2024
      const monday = new Date(2024, 0, 1);
      expect(pattern.includesDate(monday)).toBe(true);

      // Wednesday, January 3, 2024
      const wednesday = new Date(2024, 0, 3);
      expect(pattern.includesDate(wednesday)).toBe(true);

      // Friday, January 5, 2024
      const friday = new Date(2024, 0, 5);
      expect(pattern.includesDate(friday)).toBe(true);
    });

    it('should return false for dates on excluded days', () => {
      // Tuesday, January 2, 2024
      const tuesday = new Date(2024, 0, 2);
      expect(pattern.includesDate(tuesday)).toBe(false);

      // Thursday, January 4, 2024
      const thursday = new Date(2024, 0, 4);
      expect(pattern.includesDate(thursday)).toBe(false);
    });
  });

  describe('toString', () => {
    it('should return MWF for MWF pattern', () => {
      expect(DoctorSchedulePattern.MWF.toString()).toBe('MWF');
    });

    it('should return TTH for TTH pattern', () => {
      expect(DoctorSchedulePattern.TTH.toString()).toBe('TTH');
    });

    it('should return WEEKDAYS for weekdays pattern', () => {
      expect(DoctorSchedulePattern.WEEKDAYS.toString()).toBe('WEEKDAYS');
    });

    it('should return ALL for all days pattern', () => {
      expect(DoctorSchedulePattern.ALL_DAYS.toString()).toBe('ALL');
    });

    it('should return abbreviated string for custom patterns', () => {
      const pattern = new DoctorSchedulePattern(['MONDAY', 'THURSDAY', 'FRIDAY']);
      expect(pattern.toString()).toBe('MRF');
    });
  });

  describe('getDescription', () => {
    it('should return readable descriptions for common patterns', () => {
      expect(DoctorSchedulePattern.MWF.getDescription()).toBe('Monday, Wednesday, Friday');
      expect(DoctorSchedulePattern.TTH.getDescription()).toBe('Tuesday, Thursday');
      expect(DoctorSchedulePattern.WEEKDAYS.getDescription()).toBe('Weekdays');
      expect(DoctorSchedulePattern.ALL_DAYS.getDescription()).toBe('All days');
    });

    it('should return readable description for single day', () => {
      const pattern = new DoctorSchedulePattern(['MONDAY']);
      expect(pattern.getDescription()).toBe('Monday');
    });

    it('should return readable description for two days', () => {
      const pattern = new DoctorSchedulePattern(['MONDAY', 'TUESDAY']);
      expect(pattern.getDescription()).toBe('Monday and Tuesday');
    });

    it('should return readable description for multiple days', () => {
      const pattern = new DoctorSchedulePattern(['MONDAY', 'TUESDAY', 'WEDNESDAY']);
      expect(pattern.getDescription()).toBe('Monday, Tuesday, and Wednesday');
    });
  });

  describe('Properties', () => {
    it('should return correct day count', () => {
      expect(DoctorSchedulePattern.MWF.dayCount).toBe(3);
      expect(DoctorSchedulePattern.TTH.dayCount).toBe(2);
      expect(DoctorSchedulePattern.ALL_DAYS.dayCount).toBe(7);
    });

    it('should identify weekdays only patterns', () => {
      expect(DoctorSchedulePattern.MWF.isWeekdaysOnly).toBe(true);
      expect(DoctorSchedulePattern.TTH.isWeekdaysOnly).toBe(true);
      expect(DoctorSchedulePattern.WEEKDAYS.isWeekdaysOnly).toBe(true);
      expect(DoctorSchedulePattern.ALL_DAYS.isWeekdaysOnly).toBe(false);
    });

    it('should identify patterns that include weekends', () => {
      expect(DoctorSchedulePattern.MWF.includesWeekends).toBe(false);
      expect(DoctorSchedulePattern.TTH.includesWeekends).toBe(false);
      expect(DoctorSchedulePattern.WEEKDAYS.includesWeekends).toBe(false);
      expect(DoctorSchedulePattern.ALL_DAYS.includesWeekends).toBe(true);
    });
  });

  describe('Pattern operations', () => {
    it('should combine patterns', () => {
      const combined = DoctorSchedulePattern.MWF.combine(DoctorSchedulePattern.TTH);
      expect(combined.days).toEqual(['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY']);
    });

    it('should exclude patterns', () => {
      const excluded = DoctorSchedulePattern.WEEKDAYS.exclude(DoctorSchedulePattern.TTH);
      expect(excluded.days).toEqual(['MONDAY', 'WEDNESDAY', 'FRIDAY']);
    });

    it('should throw error when excluding all days', () => {
      expect(() => DoctorSchedulePattern.MWF.exclude(DoctorSchedulePattern.MWF)).toThrow('Cannot create empty schedule pattern');
    });

    it('should detect overlaps', () => {
      expect(DoctorSchedulePattern.MWF.overlapsWith(DoctorSchedulePattern.TTH)).toBe(false);
      expect(DoctorSchedulePattern.MWF.overlapsWith(DoctorSchedulePattern.WEEKDAYS)).toBe(true);
    });

    it('should get overlap days', () => {
      const overlap = DoctorSchedulePattern.MWF.getOverlapWith(DoctorSchedulePattern.WEEKDAYS);
      expect(overlap).toEqual(['MONDAY', 'WEDNESDAY', 'FRIDAY']);
    });
  });

  describe('Equality', () => {
    it('should consider patterns with same days as equal', () => {
      const pattern1 = new DoctorSchedulePattern(['MONDAY', 'WEDNESDAY', 'FRIDAY']);
      const pattern2 = new DoctorSchedulePattern(['FRIDAY', 'MONDAY', 'WEDNESDAY']);
      expect(pattern1.equals(pattern2)).toBe(true);
    });

    it('should consider patterns with different days as not equal', () => {
      const pattern1 = DoctorSchedulePattern.MWF;
      const pattern2 = DoctorSchedulePattern.TTH;
      expect(pattern1.equals(pattern2)).toBe(false);
    });

    it('should work with predefined patterns', () => {
      const customMWF = new DoctorSchedulePattern(['MONDAY', 'WEDNESDAY', 'FRIDAY']);
      expect(customMWF.equals(DoctorSchedulePattern.MWF)).toBe(true);
    });
  });
});