/**
 * Doctor Schedule Override Query DTOs
 * Data structures for schedule override queries
 */

// Query DTOs
export interface GetScheduleOverrideByDateQuery {
  date: string;
}

export interface GetScheduleOverridesByDateRangeQuery {
  startDate: string;
  endDate: string;
}

export interface GetScheduleOverridesByDoctorQuery {
  doctorId: string;
}

export interface GetScheduleOverrideByIdQuery {
  id: string;
}

export interface GetScheduleOverridesByDatesQuery {
  dates: string[];
}
