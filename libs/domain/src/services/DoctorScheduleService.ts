import { DoctorSchedulePattern } from '../value-objects/DoctorSchedulePattern';

/**
 * Domain Service for Doctor Schedule Management
 * Handles business logic for assigning default schedule patterns to doctors
 */
export class DoctorScheduleService {
  /**
   * Assigns default schedule pattern based on doctor creation order
   * First doctor gets MWF (Monday, Wednesday, Friday)
   * Second doctor gets TTH (Tuesday, Thursday)
   * Only supports up to 2 doctors with MWF and TTH patterns
   * 
   * @param doctorIndex - Zero-based index indicating the order of doctor creation (0 = first doctor, 1 = second doctor)
   * @returns Default schedule pattern for the doctor
   */
  public static getDefaultSchedulePattern(doctorIndex: number): DoctorSchedulePattern {
    if (doctorIndex < 0) {
      throw new Error('Doctor index cannot be negative');
    }

    if (doctorIndex > 1) {
      throw new Error('Only supports up to 2 doctors with MWF and TTH patterns');
    }

    switch (doctorIndex) {
      case 0:
        // First doctor gets MWF schedule
        return DoctorSchedulePattern.MWF;
      case 1:
        // Second doctor gets TTH schedule
        return DoctorSchedulePattern.TTH;
      default:
        throw new Error('Invalid doctor index');
    }
  }

  /**
   * Gets the expected schedule pattern for a doctor based on their position
   * This is used for validation and ensuring consistency
   * 
   * @param totalDoctors - Total number of doctors in the system
   * @param doctorPosition - Position of this doctor (1-based: 1 = first doctor, 2 = second doctor)
   * @returns Expected schedule pattern
   */
  public static getExpectedPatternForPosition(totalDoctors: number, doctorPosition: number): DoctorSchedulePattern {
    if (doctorPosition < 1) {
      throw new Error('Doctor position must be at least 1');
    }
    
    if (doctorPosition > totalDoctors) {
      throw new Error('Doctor position cannot exceed total doctors');
    }

    // Convert to zero-based index for the main logic
    return this.getDefaultSchedulePattern(doctorPosition - 1);
  }

  /**
   * Validates that doctor schedule patterns don't have major conflicts
   * For the 2-doctor system, MWF and TTH are perfectly complementary (no overlap)
   * 
   * @param patterns - Array of schedule patterns to validate
   * @returns Validation result with any issues found
   */
  public static validateSchedulePatterns(patterns: DoctorSchedulePattern[]): {
    isValid: boolean;
    issues: string[];
    suggestions: string[];
  } {
    const issues: string[] = [];
    const suggestions: string[] = [];

    if (patterns.length === 0) {
      return {
        isValid: true,
        issues: [],
        suggestions: ['Consider adding doctor schedule patterns for better coverage']
      };
    }

    // Check for complete overlaps (doctors with identical schedules)
    for (let i = 0; i < patterns.length; i++) {
      for (let j = i + 1; j < patterns.length; j++) {
        if (patterns[i].equals(patterns[j])) {
          issues.push(`Doctors ${i + 1} and ${j + 1} have identical schedules, which may cause conflicts`);
        }
      }
    }

    // For 2-doctor system, check if we have the ideal MWF/TTH split
    if (patterns.length === 2) {
      const hasIdealSplit = 
        (patterns[0].equals(DoctorSchedulePattern.MWF) && patterns[1].equals(DoctorSchedulePattern.TTH)) ||
        (patterns[0].equals(DoctorSchedulePattern.TTH) && patterns[1].equals(DoctorSchedulePattern.MWF));

      if (!hasIdealSplit) {
        suggestions.push('For optimal coverage with 2 doctors, consider using MWF and TTH patterns');
      }
    }

    // Check coverage (ensure all weekdays are covered)
    const allWeekdays = DoctorSchedulePattern.WEEKDAYS.days;
    const coveredDays = new Set<string>();
    
    patterns.forEach(pattern => {
      pattern.days.forEach(day => {
        if (allWeekdays.includes(day)) {
          coveredDays.add(day);
        }
      });
    });

    const uncoveredWeekdays = allWeekdays.filter(day => !coveredDays.has(day));
    if (uncoveredWeekdays.length > 0) {
      issues.push(`No coverage for: ${uncoveredWeekdays.join(', ')}`);
    }

    // Check for gaps (days with no coverage)
    if (uncoveredWeekdays.length > 2) {
      issues.push('Significant coverage gaps detected - consider adjusting schedule patterns');
    }

    return {
      isValid: issues.length === 0,
      issues,
      suggestions
    };
  }

  /**
   * Suggests optimal schedule patterns for a given number of doctors
   * Only supports up to 2 doctors with MWF and TTH patterns
   * 
   * @param numberOfDoctors - Number of doctors to create patterns for (max 2)
   * @returns Array of suggested schedule patterns
   */
  public static suggestOptimalPatterns(numberOfDoctors: number): DoctorSchedulePattern[] {
    if (numberOfDoctors < 1) {
      throw new Error('Number of doctors must be at least 1');
    }

    if (numberOfDoctors > 2) {
      throw new Error('Only supports up to 2 doctors with MWF and TTH patterns');
    }

    const patterns: DoctorSchedulePattern[] = [];

    for (let i = 0; i < numberOfDoctors; i++) {
      patterns.push(this.getDefaultSchedulePattern(i));
    }

    return patterns;
  }

  /**
   * Gets the complementary pattern for a given pattern
   * Useful for ensuring good coverage when adding a second doctor
   * 
   * @param existingPattern - The existing doctor's schedule pattern
   * @returns Complementary pattern that provides good coverage
   */
  public static getComplementaryPattern(existingPattern: DoctorSchedulePattern): DoctorSchedulePattern {
    // If existing is MWF, complement is TTH
    if (existingPattern.equals(DoctorSchedulePattern.MWF)) {
      return DoctorSchedulePattern.TTH;
    }
    
    // If existing is TTH, complement is MWF  
    if (existingPattern.equals(DoctorSchedulePattern.TTH)) {
      return DoctorSchedulePattern.MWF;
    }

    // For other patterns, try to find non-overlapping days
    const allWeekdays = DoctorSchedulePattern.WEEKDAYS.days;
    const existingDays = existingPattern.days;
    const remainingDays = allWeekdays.filter(day => !existingDays.includes(day));

    if (remainingDays.length > 0) {
      return new DoctorSchedulePattern(remainingDays);
    }

    // Fallback: return TTH as it's most commonly complementary
    return DoctorSchedulePattern.TTH;
  }

  /**
   * Checks if a doctor's schedule pattern is appropriate for their position
   * Used for validation during doctor creation or updates
   * 
   * @param doctorIndex - Zero-based index of the doctor
   * @param actualPattern - The actual schedule pattern assigned
   * @returns Whether the pattern matches the expected default
   */
  public static isPatternAppropriateForPosition(
    doctorIndex: number, 
    actualPattern: DoctorSchedulePattern
  ): boolean {
    const expectedPattern = this.getDefaultSchedulePattern(doctorIndex);
    return actualPattern.equals(expectedPattern);
  }

  /**
   * Gets a human-readable description of the default schedule assignment logic
   * Useful for documentation and user interfaces
   */
  public static getAssignmentDescription(): string {
    return 'First doctor is assigned Monday, Wednesday, Friday (MWF). ' +
           'Second doctor is assigned Tuesday, Thursday (TTH). ' +
           'Additional doctors are assigned weekdays (Monday-Friday).';
  }
}