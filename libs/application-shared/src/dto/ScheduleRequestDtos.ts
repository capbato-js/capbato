// Request DTOs for Schedule API endpoints
// These are used for HTTP request body validation

import { ScheduleDto, CreateScheduleDto, UpdateScheduleDto, TodayDoctorDto } from './ScheduleDto';

// Request DTOs for API endpoints
export interface CreateScheduleRequestDto {
  doctorName: string;
  date: string;
  time: string;
}

export interface UpdateScheduleRequestDto {
  doctorName?: string;
  date?: string;
  time?: string;
}

// Response DTOs for API endpoints
export interface ScheduleResponse {
  success: boolean;
  data: ScheduleDto;
}

export interface ScheduleListResponse {
  success: boolean;
  data: ScheduleDto[];
}

export interface ScheduleStatsResponse {
  success: boolean;
  data: {
    total: number;
    today: number;
    upcoming: number;
    uniqueDoctors: number;
  };
}

export interface ScheduleOperationResponse {
  success: boolean;
  message: string;
}

export interface TodayDoctorResponse {
  success: boolean;
  data: TodayDoctorDto;
}

// Re-export base DTOs
export type { ScheduleDto, CreateScheduleDto, UpdateScheduleDto, TodayDoctorDto };