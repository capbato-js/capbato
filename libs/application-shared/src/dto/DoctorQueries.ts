/**
 * Doctor Query DTOs
 * Data Transfer Objects for Doctor queries following CQRS pattern
 * 
 * These DTOs combine User information (name, email, role) with Doctor profile information
 * (specialization, medical contact, license) to avoid data duplication.
 */

import { ApiSuccessMessageResponse } from './ApiResponse';

// Base Doctor DTO - combines User + Doctor Profile information
export interface DoctorDto {
  // Doctor Profile Fields
  id: string; // Doctor profile ID
  userId: string; // Reference to User entity
  specialization: string;
  medicalContactNumber: string;
  formattedMedicalContactNumber: string;
  licenseNumber?: string;
  yearsOfExperience?: number;
  isActive: boolean;
  
  // User Information (fetched via relationship)
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  username: string;
  personalContactNumber?: string; // From User.mobile
  role: string; // Should always be 'doctor'
}

// Lightweight DTO for listings that don't need full user details
export interface DoctorSummaryDto {
  id: string;
  userId: string;
  fullName: string; // Computed from user's first + last name
  specialization: string;
  formattedMedicalContactNumber: string;
  yearsOfExperience?: number;
  isActive: boolean;
}

// Query Request DTOs
export interface GetDoctorByIdQuery {
  id: string;
}

export interface GetDoctorByUserIdQuery {
  userId: string;
}

export interface GetDoctorsBySpecializationQuery {
  specialization: string;
}

export interface GetActiveDoctorsQuery {
  // Explicitly empty - gets all active doctors without filters
  readonly _marker?: 'GetActiveDoctorsQuery';
}

export interface GetAllDoctorsQuery {
  activeOnly?: boolean;
}

// Response DTOs following existing patterns
export interface DoctorResponse {
  success: true;
  data: DoctorDto;
}

export interface DoctorListResponse {
  success: true;
  data: DoctorDto[];
}

export interface DoctorSummaryListResponse {
  success: true;
  data: DoctorSummaryDto[];
}

export type DoctorOperationResponse = ApiSuccessMessageResponse;

// Command DTOs for doctor profile management
export interface CreateDoctorProfileCommand {
  userId: string;
  specialization: string;
  medicalContactNumber: string;
  licenseNumber?: string;
  yearsOfExperience?: number;
}

export interface UpdateDoctorProfileCommand {
  id: string;
  specialization?: string;
  medicalContactNumber?: string;
  licenseNumber?: string;
  yearsOfExperience?: number;
  isActive?: boolean;
}
