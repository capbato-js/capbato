import { ValueObject } from './ValueObject';

export type DayOfWeek = 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY';

/**
 * Value Object representing a doctor's weekly schedule pattern
 * Defines which days of the week a doctor is available
 */
export class DoctorSchedulePattern extends ValueObject<DayOfWeek[]> {
  // Pre-defined schedule patterns
  public static readonly MWF = new DoctorSchedulePattern(['MONDAY', 'WEDNESDAY', 'FRIDAY']);
  public static readonly TTH = new DoctorSchedulePattern(['TUESDAY', 'THURSDAY']);
  public static readonly WEEKDAYS = new DoctorSchedulePattern(['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY']);
  public static readonly ALL_DAYS = new DoctorSchedulePattern(['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY']);

  constructor(days: DayOfWeek[]) {
    // Validate and normalize the input
    if (!days || days.length === 0) {
      throw new Error('Doctor schedule pattern must include at least one day');
    }

    // Remove duplicates and sort by day order
    const validDays = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];
    const uniqueDays = [...new Set(days)];
    
    // Validate all days are valid
    for (const day of uniqueDays) {
      if (!validDays.includes(day)) {
        throw new Error(`Invalid day of week: ${day}`);
      }
    }

    // Sort days in week order
    const sortedDays = uniqueDays.sort((a, b) => validDays.indexOf(a) - validDays.indexOf(b));
    
    super(sortedDays);
  }

  protected validate(days: DayOfWeek[]): void {
    // Validation is already done in constructor
  }

  /**
   * Create a pattern from a string representation (e.g., "MWF", "TTH")
   * Only supports MWF and TTH patterns for the 2-doctor system
   */
  public static fromString(pattern: string): DoctorSchedulePattern {
    const upperPattern = pattern.toUpperCase().trim();
    
    switch (upperPattern) {
      case 'MWF':
        return DoctorSchedulePattern.MWF;
      case 'TTH':
        return DoctorSchedulePattern.TTH;
      default:
        throw new Error(`Invalid schedule pattern: ${pattern}. Only MWF and TTH patterns are supported.`);
    }
  }

  /**
   * Create a pattern from an array of day names
   */
  public static fromDayNames(dayNames: string[]): DoctorSchedulePattern {
    const dayMap: Record<string, DayOfWeek> = {
      'monday': 'MONDAY',
      'tuesday': 'TUESDAY',
      'wednesday': 'WEDNESDAY',
      'thursday': 'THURSDAY',
      'friday': 'FRIDAY',
      'saturday': 'SATURDAY',
      'sunday': 'SUNDAY',
      'mon': 'MONDAY',
      'tue': 'TUESDAY',
      'wed': 'WEDNESDAY',
      'thu': 'THURSDAY',
      'fri': 'FRIDAY',
      'sat': 'SATURDAY',
      'sun': 'SUNDAY'
    };

    const days: DayOfWeek[] = [];
    for (const dayName of dayNames) {
      const normalizedDay = dayName.toLowerCase().trim();
      if (dayMap[normalizedDay]) {
        days.push(dayMap[normalizedDay]);
      } else {
        throw new Error(`Invalid day name: ${dayName}`);
      }
    }

    return new DoctorSchedulePattern(days);
  }

  /**
   * Get the days in this pattern
   */
  public get days(): DayOfWeek[] {
    return [...this.value];
  }

  /**
   * Check if a specific day is included in this pattern
   */
  public includesDay(day: DayOfWeek): boolean {
    return this.value.includes(day);
  }

  /**
   * Check if this pattern includes a specific day by date
   */
  public includesDate(date: Date): boolean {
    const dayOfWeek = this.getDayOfWeekFromDate(date);
    return this.includesDay(dayOfWeek);
  }

  /**
   * Get day of week from a date
   */
  private getDayOfWeekFromDate(date: Date): DayOfWeek {
    const dayIndex = date.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const days: DayOfWeek[] = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
    return days[dayIndex];
  }

  /**
   * Get a string representation of the pattern
   * Only supports MWF and TTH patterns
   */
  public override toString(): string {
    // Check for supported patterns
    if (this.equals(DoctorSchedulePattern.MWF)) {
      return 'MWF';
    }
    if (this.equals(DoctorSchedulePattern.TTH)) {
      return 'TTH';
    }

    // Fallback: create abbreviated string for custom patterns
    const dayAbbr: Record<DayOfWeek, string> = {
      'MONDAY': 'M',
      'TUESDAY': 'T',
      'WEDNESDAY': 'W',
      'THURSDAY': 'R',
      'FRIDAY': 'F',
      'SATURDAY': 'S',
      'SUNDAY': 'U'
    };

    return this.value.map(day => dayAbbr[day]).join('');
  }

  /**
   * Get a human-readable description of the pattern
   * Only supports MWF and TTH patterns
   */
  public getDescription(): string {
    if (this.equals(DoctorSchedulePattern.MWF)) {
      return 'Monday, Wednesday, Friday';
    }
    if (this.equals(DoctorSchedulePattern.TTH)) {
      return 'Tuesday, Thursday';
    }

    // Create full description for custom patterns
    const dayNames: Record<DayOfWeek, string> = {
      'MONDAY': 'Monday',
      'TUESDAY': 'Tuesday',
      'WEDNESDAY': 'Wednesday',
      'THURSDAY': 'Thursday',
      'FRIDAY': 'Friday',
      'SATURDAY': 'Saturday',
      'SUNDAY': 'Sunday'
    };

    const names = this.value.map(day => dayNames[day]);
    if (names.length === 1) {
      return names[0];
    }
    if (names.length === 2) {
      return names.join(' and ');
    }
    return names.slice(0, -1).join(', ') + ', and ' + names[names.length - 1];
  }

  /**
   * Get the number of days in this pattern
   */
  public get dayCount(): number {
    return this.value.length;
  }

  /**
   * Check if this is a weekday-only pattern
   */
  public get isWeekdaysOnly(): boolean {
    return !this.value.includes('SATURDAY') && !this.value.includes('SUNDAY');
  }

  /**
   * Check if this pattern includes weekends
   */
  public get includesWeekends(): boolean {
    return this.value.includes('SATURDAY') || this.value.includes('SUNDAY');
  }

  /**
   * Combine this pattern with another pattern
   */
  public combine(other: DoctorSchedulePattern): DoctorSchedulePattern {
    const combinedDays = [...new Set([...this.value, ...other.value])];
    return new DoctorSchedulePattern(combinedDays);
  }

  /**
   * Remove days from this pattern that are in another pattern
   */
  public exclude(other: DoctorSchedulePattern): DoctorSchedulePattern {
    const remainingDays = this.value.filter(day => !other.value.includes(day));
    if (remainingDays.length === 0) {
      throw new Error('Cannot create empty schedule pattern');
    }
    return new DoctorSchedulePattern(remainingDays);
  }

  /**
   * Check if this pattern overlaps with another pattern
   */
  public overlapsWith(other: DoctorSchedulePattern): boolean {
    return this.value.some(day => other.value.includes(day));
  }

  /**
   * Get the days that overlap with another pattern
   */
  public getOverlapWith(other: DoctorSchedulePattern): DayOfWeek[] {
    return this.value.filter(day => other.value.includes(day));
  }
}