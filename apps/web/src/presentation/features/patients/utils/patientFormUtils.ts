import { NameFormattingService } from '@nx-starter/domain';
import type { CreatePatientCommand } from '@nx-starter/application-shared';

// Helper function to safely extract error message
export const getErrorMessage = (error: unknown): string | undefined => {
  if (typeof error === 'string') return error;
  if (error && typeof error === 'object' && 'message' in error) {
    return (error as { message: string }).message;
  }
  return undefined;
};

// Calculate age from date of birth
export const calculateAge = (birthDate: string): number | null => {
  if (!birthDate) return null;
  
  const birth = new Date(birthDate);
  const today = new Date();
  
  // Check if birth date is valid
  if (isNaN(birth.getTime()) || birth > today) return null;
  
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  // Adjust age if birthday hasn't occurred this year
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age >= 0 ? age : null;
};

// Check if required form fields are empty for create mode
export const isFormEmpty = (
  isUpdateMode: boolean,
  firstName?: string,
  lastName?: string,
  dateOfBirth?: string,
  gender?: string,
  contactNumber?: string
): boolean => {
  if (isUpdateMode) return false; // Allow updates even with empty fields
  
  return (!firstName?.trim() || 
          !lastName?.trim() || 
          !dateOfBirth?.trim() || 
          !gender?.trim() ||
          !contactNumber?.trim());
};

// Format name field using proper case formatting
export const formatNameField = (value: string): string => {
  if (!value || typeof value !== 'string') return value;
  return NameFormattingService.formatToProperCase(value);
};
