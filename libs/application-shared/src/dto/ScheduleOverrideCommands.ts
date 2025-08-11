/**
 * Doctor Schedule Override Command DTOs
 * Input and output data structures for schedule override operations
 */

// Request DTOs
export interface CreateScheduleOverrideRequestDto {
  date: string;
  assignedDoctorId: string;
  reason: string;
  originalDoctorId?: string;
}

export interface UpdateScheduleOverrideRequestDto {
  reason?: string;
  assignedDoctorId?: string;
}

// Response DTOs
export interface ScheduleOverrideDto {
  id: string;
  date: string;
  originalDoctorId: string | null;
  assignedDoctorId: string;
  reason: string;
  createdAt: string;
  updatedAt: string;
}

export interface ScheduleOverrideListResponse {
  success: boolean;
  data: ScheduleOverrideDto[];
  message?: string;
}

export interface ScheduleOverrideResponse {
  success: boolean;
  data: ScheduleOverrideDto;
  message?: string;
}

export interface ScheduleOverrideOperationResponse {
  success: boolean;
  message: string;
}

// Command DTOs for internal use
export interface CreateScheduleOverrideCommand {
  date: string;
  assignedDoctorId: string;
  reason: string;
  originalDoctorId?: string;
}

export interface UpdateScheduleOverrideCommand {
  id: string;
  reason?: string;
  assignedDoctorId?: string;
}

export interface DeleteScheduleOverrideCommand {
  id: string;
}
