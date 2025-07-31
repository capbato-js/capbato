import { injectable } from 'tsyringe';

/**
 * Domain service for age calculation operations
 * Handles age computation from date of birth
 */
@injectable()
export class AgeCalculationService {
  /**
   * Calculates age from date of birth
   * @param dateOfBirth The date of birth in YYYY-MM-DD format or Date object
   * @returns The calculated age in years
   */
  calculateAge(dateOfBirth: string | Date): number {
    const birthDate = typeof dateOfBirth === 'string' ? new Date(dateOfBirth) : dateOfBirth;
    const today = new Date();
    
    // Validate the birth date
    if (isNaN(birthDate.getTime())) {
      throw new Error('Invalid date of birth');
    }
    
    // Check if birth date is in the future
    if (birthDate > today) {
      throw new Error('Date of birth cannot be in the future');
    }
    
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    // If the birthday hasn't occurred this year yet, subtract 1
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return Math.max(0, age); // Ensure non-negative age
  }

  /**
   * Determines age category based on age
   * @param age The age in years
   * @returns Age category string
   */
  getAgeCategory(age: number): 'child' | 'adult' | 'senior' {
    if (age < 18) return 'child';
    if (age < 60) return 'adult';
    return 'senior';
  }

  /**
   * Calculates age and category from date of birth
   * @param dateOfBirth The date of birth in YYYY-MM-DD format or Date object
   * @returns Object with age and category
   */
  calculateAgeWithCategory(dateOfBirth: string | Date): { age: number; category: 'child' | 'adult' | 'senior' } {
    const age = this.calculateAge(dateOfBirth);
    const category = this.getAgeCategory(age);
    
    return { age, category };
  }

  /**
   * Validates if a date of birth is reasonable
   * @param dateOfBirth The date of birth to validate
   * @returns True if valid, false otherwise
   */
  isValidDateOfBirth(dateOfBirth: string | Date): boolean {
    try {
      const birthDate = typeof dateOfBirth === 'string' ? new Date(dateOfBirth) : dateOfBirth;
      const today = new Date();
      
      // Check if valid date
      if (isNaN(birthDate.getTime())) {
        return false;
      }
      
      // Check if not in future
      if (birthDate > today) {
        return false;
      }
      
      // Check if not too old (150 years)
      const minDate = new Date();
      minDate.setFullYear(today.getFullYear() - 150);
      if (birthDate < minDate) {
        return false;
      }
      
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Formats age for display with appropriate unit
   * @param age The age in years
   * @returns Formatted age string (e.g., "25 years old", "1 year old")
   */
  formatAgeForDisplay(age: number): string {
    if (age === 1) {
      return '1 year old';
    }
    return `${age} years old`;
  }

  /**
   * Calculates how many days until next birthday
   * @param dateOfBirth The date of birth in YYYY-MM-DD format or Date object
   * @returns Number of days until next birthday
   */
  daysUntilNextBirthday(dateOfBirth: string | Date): number {
    const birthDate = typeof dateOfBirth === 'string' ? new Date(dateOfBirth) : dateOfBirth;
    const today = new Date();
    
    if (!this.isValidDateOfBirth(birthDate)) {
      throw new Error('Invalid date of birth');
    }
    
    const nextBirthday = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate());
    
    // If birthday already passed this year, calculate for next year
    if (nextBirthday < today) {
      nextBirthday.setFullYear(today.getFullYear() + 1);
    }
    
    const diffTime = nextBirthday.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  }
}