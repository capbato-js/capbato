/**
 * Domain Service for Name Formatting Business Logic
 * Contains business rules for formatting names to proper case (Capital Letter First)
 */
export class NameFormattingService {
  /**
   * Formats a name to proper case (Capital Letter First)
   * Handles various input formats: all caps, all lowercase, mixed case
   * 
   * Business Rules:
   * - First letter of each word should be capitalized
   * - Rest of the letters should be lowercase
   * - Preserves spaces and hyphens as word separators
   * - Handles common name prefixes and suffixes appropriately
   * 
   * @param name The name to format
   * @returns Properly formatted name with Capital Letter First for each word
   */
  static formatToProperCase(name: string): string {
    if (!name || typeof name !== 'string') {
      return name;
    }

    const trimmedName = name.trim();
    if (trimmedName.length === 0) {
      return trimmedName;
    }

    // Split by spaces and hyphens, preserve the separators
    const parts = trimmedName.split(/(\s+|-)/);
    
    return parts.map(part => {
      // Skip separators (spaces and hyphens)
      if (/^\s+$/.test(part) || part === '-') {
        return part;
      }
      
      // Handle empty parts
      if (part.length === 0) {
        return part;
      }
      
      // Format each word part to proper case
      return this.formatWordToProperCase(part);
    }).join('');
  }

  /**
   * Formats a single word to proper case
   * Handles special cases for name formatting
   */
  private static formatWordToProperCase(word: string): string {
    if (word.length === 0) {
      return word;
    }

    // Handle single character
    if (word.length === 1) {
      return word.toUpperCase();
    }

    // Special cases for common name prefixes and suffixes
    const lowerWord = word.toLowerCase();
    
    // Common name prefixes that should have specific capitalization
    const specialPrefixes = ['mc', 'mac', 'o\''];
    for (const prefix of specialPrefixes) {
      if (lowerWord.startsWith(prefix)) {
        if (prefix === 'mc' && word.length > 2) {
          return 'Mc' + word.charAt(2).toUpperCase() + word.slice(3).toLowerCase();
        }
        if (prefix === 'mac' && word.length > 3) {
          return 'Mac' + word.charAt(3).toUpperCase() + word.slice(4).toLowerCase();
        }
        if (prefix === 'o\'' && word.length > 2) {
          return 'O\'' + word.charAt(2).toUpperCase() + word.slice(3).toLowerCase();
        }
      }
    }

    // Default proper case: first letter uppercase, rest lowercase
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  }

  /**
   * Validates that a name is properly formatted
   * Useful for checking if formatting is needed
   */
  static isProperlyFormatted(name: string): boolean {
    if (!name || typeof name !== 'string') {
      return false;
    }

    const formatted = this.formatToProperCase(name);
    return name === formatted;
  }
}