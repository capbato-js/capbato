/**
 * Standardized validation messages across the application
 */

export const PHONE_VALIDATION = {
  // Standardized error message for Philippine mobile numbers
  INVALID_PHILIPPINE_MOBILE: 'Please provide a valid Philippine mobile number (09xxxxxxxxx)',
  
  // Standardized placeholder for Philippine mobile numbers
  PLACEHOLDER: '09123456789',
  
  // Alternative messages for specific contexts
  INVALID_CONTACT_NUMBER: 'Contact number must be a valid Philippine mobile number (09xxxxxxxxx)',
  INVALID_MEDICAL_CONTACT: 'Medical contact number must be a valid Philippine mobile number (09xxxxxxxxx) or landline number (02xxxxxxx, 0xxxxxxxxx)',
} as const;

export const NAME_VALIDATION = {
  INVALID_CHARACTERS: 'can only contain letters, spaces, hyphens, apostrophes, and periods',
  MIN_LENGTH: 'must be at least 2 characters',
  MAX_LENGTH: 'cannot exceed 50 characters',
  REQUIRED: 'is required',
} as const;

export const VALIDATION_MESSAGES = {
  PHONE: PHONE_VALIDATION,
  NAME: NAME_VALIDATION,
} as const;
