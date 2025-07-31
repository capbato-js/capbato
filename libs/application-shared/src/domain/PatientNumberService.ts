import { injectable } from 'tsyringe';

/**
 * Domain service for generating patient numbers
 * Generates unique patient numbers in format: YYYY-L# (e.g., "2025-J1", "2025-J2")
 */
@injectable()
export class PatientNumberService {
  /**
   * Generates a patient number based on the year and first letter of last name
   * @param lastName The patient's last name
   * @param existingCount The number of existing patients with the same year-letter prefix
   * @returns Generated patient number in format YYYY-L#
   */
  generatePatientNumber(lastName: string, existingCount: number): string {
    const currentYear = new Date().getFullYear();
    const firstLetter = (lastName || '').charAt(0).toUpperCase();
    const nextNumber = existingCount + 1;
    
    return `${currentYear}-${firstLetter}${nextNumber}`;
  }

  /**
   * Extracts the prefix (YYYY-L) from a patient number
   * @param patientNumber The patient number
   * @returns The prefix part (e.g., "2025-J" from "2025-J1")
   */
  extractPrefix(patientNumber: string): string {
    const match = patientNumber.match(/^(\d{4}-[A-Z])\d+$/);
    return match ? match[1] : '';
  }

  /**
   * Validates patient number format
   * @param patientNumber The patient number to validate
   * @returns True if valid format, false otherwise
   */
  isValidFormat(patientNumber: string): boolean {
    const regex = /^\d{4}-[A-Z]\d+$/;
    return regex.test(patientNumber);
  }

  /**
   * Gets the year from a patient number
   * @param patientNumber The patient number
   * @returns The year or null if invalid format
   */
  getYear(patientNumber: string): number | null {
    const match = patientNumber.match(/^(\d{4})-[A-Z]\d+$/);
    return match ? parseInt(match[1], 10) : null;
  }

  /**
   * Gets the letter from a patient number
   * @param patientNumber The patient number
   * @returns The letter or null if invalid format
   */
  getLetter(patientNumber: string): string | null {
    const match = patientNumber.match(/^\d{4}-([A-Z])\d+$/);
    return match ? match[1] : null;
  }
}