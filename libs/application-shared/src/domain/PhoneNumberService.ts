import { injectable } from 'tsyringe';

/**
 * Domain service for Philippine phone number operations
 * Handles validation, sanitization, and formatting of Philippine mobile numbers
 */
@injectable()
export class PhoneNumberService {
  private readonly PHILIPPINE_MOBILE_REGEX = /^09\d{9}$/;

  /**
   * Validates Philippine mobile number format (09XXXXXXXXX)
   * @param phoneNumber The phone number to validate
   * @returns True if valid, false otherwise
   */
  isValidPhilippineMobile(phoneNumber: string): boolean {
    if (!phoneNumber) return false;
    
    const phoneStr = String(phoneNumber).trim();
    return this.PHILIPPINE_MOBILE_REGEX.test(phoneStr);
  }

  /**
   * Sanitizes phone number by removing all non-digit characters
   * @param phoneNumber The phone number to sanitize
   * @returns Sanitized phone number with only digits
   */
  sanitize(phoneNumber: string): string {
    if (!phoneNumber) return '';
    
    return String(phoneNumber).replace(/\D/g, '');
  }

  /**
   * Formats phone number for display (e.g., "09123456789" -> "0912 345 6789")
   * @param phoneNumber The phone number to format
   * @returns Formatted phone number for display
   */
  formatForDisplay(phoneNumber: string): string {
    const sanitized = this.sanitize(phoneNumber);
    
    if (!this.isValidPhilippineMobile(sanitized)) {
      return phoneNumber; // Return original if invalid
    }
    
    // Format as: 0912 345 6789
    return `${sanitized.slice(0, 4)} ${sanitized.slice(4, 7)} ${sanitized.slice(7)}`;
  }

  /**
   * Validates and sanitizes phone number
   * @param phoneNumber The phone number to process
   * @returns Sanitized phone number if valid, empty string if invalid
   */
  validateAndSanitize(phoneNumber: string): string {
    if (!phoneNumber) return '';
    
    const sanitized = this.sanitize(phoneNumber);
    return this.isValidPhilippineMobile(sanitized) ? sanitized : '';
  }

  /**
   * Validates multiple phone numbers and returns validation errors
   * @param phoneNumbers Object with field names and phone numbers
   * @returns Array of validation error messages
   */
  validateMultiple(phoneNumbers: Record<string, string>): string[] {
    const errors: string[] = [];
    
    for (const [fieldName, phoneNumber] of Object.entries(phoneNumbers)) {
      if (phoneNumber && !this.isValidPhilippineMobile(phoneNumber)) {
        errors.push(`${fieldName} must be 11 digits starting with 09 (e.g., 09278479061)`);
      }
    }
    
    return errors;
  }

  /**
   * Converts phone number to international format (+63XXXXXXXXX)
   * @param phoneNumber The Philippine mobile number (09XXXXXXXXX)
   * @returns International format or original if invalid
   */
  toInternationalFormat(phoneNumber: string): string {
    const sanitized = this.sanitize(phoneNumber);
    
    if (!this.isValidPhilippineMobile(sanitized)) {
      return phoneNumber;
    }
    
    // Replace leading 0 with +63
    return `+63${sanitized.slice(1)}`;
  }

  /**
   * Converts international format to local format
   * @param phoneNumber The international format (+63XXXXXXXXX)
   * @returns Local format (09XXXXXXXXX) or original if invalid
   */
  toLocalFormat(phoneNumber: string): string {
    const sanitized = this.sanitize(phoneNumber);
    
    // Check if it's international format (+63XXXXXXXXX)
    if (sanitized.startsWith('63') && sanitized.length === 12) {
      return `0${sanitized.slice(2)}`;
    }
    
    return phoneNumber;
  }
}