import type { ApiError } from '../../../../infrastructure/api/errors/ApiError';

export interface FieldError {
  field: string;
  message: string;
}

export interface ErrorClassification {
  type: 'field' | 'general';
  fieldError?: FieldError;
  generalMessage?: string;
}

/**
 * Error codes that map to specific form fields
 */
const FIELD_ERROR_MAPPING = {
  DUPLICATE_PATIENT: 'contactNumber',
  INVALID_PHONE_NUMBER: 'contactNumber',
  INVALID_PATIENT_DATA: null, // Requires message parsing
} as const;

/**
 * Extract field name from error message patterns
 */
const extractFieldFromMessage = (message: string): string | null => {
  const lowercaseMessage = message.toLowerCase();
  
  // Check for contact number patterns
  if (lowercaseMessage.includes('contact number')) {
    return 'contactNumber';
  }
  
  // Check for guardian contact number patterns
  if (lowercaseMessage.includes('guardian') && lowercaseMessage.includes('contact')) {
    return 'guardianContactNumber';
  }
  
  // Check for phone number patterns
  if (lowercaseMessage.includes('phone number')) {
    return 'contactNumber';
  }
  
  // Add more field patterns as needed
  return null;
};

/**
 * Check if an error should be treated as a field error based on status code
 */
const isFieldErrorStatus = (status: number): boolean => {
  return status === 400 || status === 409; // Bad Request or Conflict
};

/**
 * Parse API error response to extract structured error information
 */
const parseApiErrorResponse = (apiError: ApiError): { message?: string; code?: string } => {
  // Check if the error has structured response data
  if (apiError.data && typeof apiError.data === 'object') {
    const data = apiError.data as any;
    
    // Handle backend error response format
    if (data.error && data.code) {
      return {
        message: data.error,
        code: data.code
      };
    }
    
    // Handle other structured error formats
    if (data.message) {
      return {
        message: data.message,
        code: data.code
      };
    }
  }
  
  // Fallback to error message
  return {
    message: apiError.message
  };
};

/**
 * Classify an error as either a field-specific error or a general error
 */
export const classifyError = (error: unknown): ErrorClassification => {
  // Handle non-API errors
  if (!error || typeof error !== 'object') {
    return {
      type: 'general',
      generalMessage: typeof error === 'string' ? error : 'An unexpected error occurred'
    };
  }
  
  // Handle API errors
  if ('isApiError' in error && error.isApiError) {
    const apiError = error as ApiError;
    const { message, code } = parseApiErrorResponse(apiError);
    
    // Check if this is likely a field error based on status code
    if (!isFieldErrorStatus(apiError.status)) {
      return {
        type: 'general',
        generalMessage: message || apiError.message
      };
    }
    
    // Try to map error code to field
    if (code && code in FIELD_ERROR_MAPPING) {
      const fieldName = FIELD_ERROR_MAPPING[code as keyof typeof FIELD_ERROR_MAPPING];
      
      if (fieldName) {
        return {
          type: 'field',
          fieldError: {
            field: fieldName,
            message: message || apiError.message
          }
        };
      }
    }
    
    // Try to extract field from error message
    const fieldFromMessage = extractFieldFromMessage(message || apiError.message);
    if (fieldFromMessage) {
      return {
        type: 'field',
        fieldError: {
          field: fieldFromMessage,
          message: message || apiError.message
        }
      };
    }
    
    // Fallback to general error
    return {
      type: 'general',
      generalMessage: message || apiError.message
    };
  }
  
  // Handle Error objects
  if (error instanceof Error) {
    // Try to extract field information from error message
    const fieldFromMessage = extractFieldFromMessage(error.message);
    if (fieldFromMessage) {
      return {
        type: 'field',
        fieldError: {
          field: fieldFromMessage,
          message: error.message
        }
      };
    }
    
    return {
      type: 'general',
      generalMessage: error.message
    };
  }
  
  // Unknown error type
  return {
    type: 'general',
    generalMessage: 'An unexpected error occurred'
  };
};

/**
 * Create a user-friendly error message for field errors
 */
export const formatFieldErrorMessage = (fieldName: string, originalMessage: string): string => {
  // Remove redundant field references from the message
  const cleanMessage = originalMessage
    .replace(/contact number/gi, 'this contact number')
    .replace(/phone number/gi, 'this phone number');
  
  return cleanMessage;
};