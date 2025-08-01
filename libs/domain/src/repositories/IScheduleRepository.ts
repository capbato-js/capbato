import { Schedule } from '../entities/Schedule';
import { ScheduleId } from '../value-objects/ScheduleId';

/**
 * Repository interface for Schedule entity following Clean Architecture
 * Defines the contract for schedule persistence operations
 */
export interface IScheduleRepository {
  /**
   * Create a new schedule
   * @param schedule The schedule to create
   * @returns The created schedule with assigned ID
   */
  create(schedule: Schedule): Promise<Schedule>;

  /**
   * Get all schedules with optional filtering
   * @param activeOnly Whether to include only future schedules
   * @returns Array of schedules
   */
  getAll(activeOnly?: boolean): Promise<Schedule[]>;

  /**
   * Get schedule by ID
   * @param id The schedule ID
   * @returns The schedule if found, undefined otherwise
   */
  getById(id: ScheduleId): Promise<Schedule | undefined>;

  /**
   * Get schedules by date
   * @param date The date to filter by (YYYY-MM-DD format)
   * @returns Array of schedules for the specified date
   */
  getByDate(date: string): Promise<Schedule[]>;

  /**
   * Get schedules by doctor name (DEPRECATED - use getByDoctorId instead)
   * @param doctorName The doctor name to filter by
   * @returns Array of schedules for the specified doctor
   */
  getByDoctorName(doctorName: string): Promise<Schedule[]>;

  /**
   * Get schedules by doctor ID
   * @param doctorId The doctor ID to filter by
   * @returns Array of schedules for the specified doctor
   */
  getByDoctorId(doctorId: string): Promise<Schedule[]>;

  /**
   * Get today's schedules
   * @returns Array of schedules for today
   */
  getTodaySchedules(): Promise<Schedule[]>;

  /**
   * Get the first doctor scheduled for today
   * @returns The first schedule for today, undefined if none
   */
  getTodayFirstDoctor(): Promise<Schedule | undefined>;

  /**
   * Update an existing schedule
   * @param schedule The schedule to update
   * @returns The updated schedule
   */
  update(schedule: Schedule): Promise<Schedule>;

  /**
   * Delete a schedule by ID
   * @param id The schedule ID to delete
   * @returns True if deleted, false if not found
   */
  delete(id: ScheduleId): Promise<boolean>;

  /**
   * Check if a schedule exists by ID
   * @param id The schedule ID to check
   * @returns True if exists, false otherwise
   */
  exists(id: ScheduleId): Promise<boolean>;

  /**
   * Find schedules that conflict with the given schedule
   * (same doctor, same date, overlapping times)
   * @param schedule The schedule to check for conflicts
   * @returns Array of conflicting schedules
   */
  findConflicts(schedule: Schedule): Promise<Schedule[]>;

  /**
   * Get schedule statistics
   * @returns Object with schedule counts and metrics
   */
  getStats(): Promise<{
    total: number;
    today: number;
    upcoming: number;
    uniqueDoctors: number;
  }>;
}