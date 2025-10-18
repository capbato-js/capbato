/**
 * Doctor Command DTOs
 * Commands for doctor-related operations following CQRS pattern
 */

import { ApiSuccessMessageResponse } from './ApiResponse';

export interface CreateDoctorProfileCommand {
  userId: string;
  specialization: string;
  licenseNumber?: string;
  yearsOfExperience?: number;
  schedulePattern?: string; // Optional schedule pattern (e.g., "MWF", "TTH")
}

export interface UpdateDoctorProfileCommand {
  id: string;
  specialization?: string;
  licenseNumber?: string;
  yearsOfExperience?: number;
  isActive?: boolean;
}

export interface UpdateDoctorSchedulePatternCommand {
  id: string;
  schedulePattern: string; // Required schedule pattern string
}

export interface RemoveDoctorSchedulePatternCommand {
  id: string;
}

// Response DTOs
export type DoctorOperationResponse = ApiSuccessMessageResponse;
export type DoctorScheduleOperationResponse = ApiSuccessMessageResponse;

// Request DTOs for REST API
export interface CreateDoctorProfileRequestDto {
  userId: string;
  specialization: string;
  licenseNumber?: string;
  yearsOfExperience?: number;
  schedulePattern?: string;
}

export interface UpdateDoctorProfileRequestDto {
  specialization?: string;
  licenseNumber?: string;
  yearsOfExperience?: number;
  isActive?: boolean;
}

export interface UpdateDoctorSchedulePatternRequestDto {
  schedulePattern: string;
}