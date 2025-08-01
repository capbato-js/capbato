// Data Transfer Objects for Schedule operations
// Unified version combining frontend and backend DTOs

export interface ScheduleDto {
  id: string;
  doctorId: string;
  date: string; // ISO date string (YYYY-MM-DD)
  time: string; // 24-hour format (HH:MM)
  formattedDate?: string; // Human-readable date
  formattedTime?: string; // 12-hour format with AM/PM
  createdAt: string; // ISO datetime string
  updatedAt?: string; // ISO datetime string
}

export interface CreateScheduleDto {
  doctorId: string;
  date: string; // ISO date string or Date object
  time: string; // HH:MM format (24-hour or 12-hour with AM/PM)
}

export interface UpdateScheduleDto {
  doctorId?: string;
  date?: string; // ISO date string
  time?: string; // HH:MM format
}

export interface ScheduleStatsDto {
  total: number;
  today: number;
  upcoming: number;
  uniqueDoctors: number;
}

export interface ScheduleFilterDto {
  doctorName?: string;
  date?: string; // ISO date string
  activeOnly?: boolean; // Only future schedules
}

export interface TodayDoctorDto {
  doctorName: string;
  scheduleId?: string;
  time?: string;
  formattedTime?: string;
}