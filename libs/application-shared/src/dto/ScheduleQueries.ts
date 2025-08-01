// Query DTOs for CQRS pattern

import {
  GetScheduleByIdQuerySchema,
  GetSchedulesByDateQuerySchema,
  GetSchedulesByDoctorQuerySchema,
} from '../validation/ScheduleValidationSchemas';

// Re-export query types from validation schemas
export type {
  GetScheduleByIdQuery,
  GetSchedulesByDateQuery,
  GetSchedulesByDoctorQuery,
} from '../validation/ScheduleValidationSchemas';

// Re-export validation schemas for backward compatibility
export {
  GetScheduleByIdQuerySchema,
  GetSchedulesByDateQuerySchema,
  GetSchedulesByDoctorQuerySchema,
} from '../validation/ScheduleValidationSchemas';

// Additional query types
export interface GetAllSchedulesQuery {
  activeOnly?: boolean;
}

export interface GetTodaySchedulesQuery {
  // No parameters needed - uses current date
}

export interface GetScheduleStatsQuery {
  // No parameters needed - returns all stats
}

export interface GetTodayDoctorQuery {
  // No parameters needed - returns first doctor for today
}