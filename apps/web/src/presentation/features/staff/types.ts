import { DoctorDto, DoctorSummaryDto } from '@nx-starter/application-shared';

// Re-export the shared types for consistency
export type { DoctorDto, DoctorSummaryDto };

// Legacy interface for backwards compatibility
export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  contactNumber: string;
}

export interface ScheduleEntry {
  date: string; // YYYY-MM-DD format
  note: string;
  details?: string;
}
