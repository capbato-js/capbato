/**
 * Philippine Mobile Number Validation Utility for Backend
 * Format: 09XXXXXXXXX (11 digits total, starting with 09)
 */

// Function to validate Philippine mobile number format
function validatePhilippineMobile(contactNumber) {
  if (!contactNumber) return true; // Allow empty values (optional fields)
  
  // Convert to string and trim whitespace
  const phoneStr = String(contactNumber).trim();
  
  // Check if exactly 11 digits, starts with 09, and contains only numbers
  const phoneRegex = /^09\d{9}$/;
  return phoneRegex.test(phoneStr);
}

// Function to validate multiple contact numbers
function validateContactNumbers(contacts) {
  const errors = [];
  
  for (const [fieldName, value] of Object.entries(contacts)) {
    if (value && !validatePhilippineMobile(value)) {
      errors.push(`${fieldName} must be 11 digits starting with 09 (e.g., 09278479061)`);
    }
  }
  
  return errors;
}

// Function to sanitize phone number (remove non-digits, ensure format)
function sanitizePhoneNumber(contactNumber) {
  if (!contactNumber) return '';
  
  // Remove all non-digit characters
  const digitsOnly = String(contactNumber).replace(/\D/g, '');
  
  // Return only if it matches the valid format
  return validatePhilippineMobile(digitsOnly) ? digitsOnly : '';
}

export {
  validatePhilippineMobile,
  validateContactNumbers,
  sanitizePhoneNumber
};
