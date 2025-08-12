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
  // Doctor profile fields (optional, but schedulePattern is required when role is 'doctor')
  specialization?: string;
  licenseNumber?: string;
  experienceYears?: number;
  schedulePattern?: string; // Required when role is 'doctor' (e.g., "MWF", "TTh")
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
  // Doctor profile fields (optional)
  specialization?: string;
  licenseNumber?: string;
  experienceYears?: number;
  schedulePattern?: string;
}