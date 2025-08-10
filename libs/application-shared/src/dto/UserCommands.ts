/**
 * User Command DTOs
 * Commands for user-related operations following CQRS pattern
 */

export interface RegisterUserCommand {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
  mobile?: string;
  // Doctor profile fields (optional, only required when role is 'doctor')
  specialization?: string;
  licenseNumber?: string;
  experienceYears?: number;
}

// Frontend form data that includes confirmPassword for UI validation
export interface RegisterUserFormData extends RegisterUserCommand {
  confirmPassword: string;
}

export interface LoginUserCommand {
  identifier: string; // Can be email or username
  password: string;
}

// Query type for getting all users
export type GetAllUsersQuery = Record<string, never>;

export interface ChangeUserPasswordCommand {
  userId: string;
  newPassword: string;
}

export interface UpdateUserDetailsCommand {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  mobile?: string;
  role?: string;
}