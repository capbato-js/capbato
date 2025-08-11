/**
 * User Request DTOs
 * Data Transfer Objects for user-related API requests
 */

export interface RegisterUserRequestDto {
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
  schedulePattern?: string; // Schedule pattern for doctor role (e.g., "MWF", "TTh")
}

export interface LoginUserRequestDto {
  email?: string;
  username?: string;
  password: string;
}

export interface UpdateUserDetailsRequestDto {
  firstName?: string;
  lastName?: string;
  email?: string;
  mobile?: string;
  role?: string;
}