import { DoctorScheduleOverride } from '../entities/DoctorScheduleOverride';

/**
 * Repository interface for Doctor Schedule Overrides
 * Defines the contract for data persistence operations
 */
export interface IDoctorScheduleOverrideRepository {
  /**
   * Get all schedule overrides
   */
  getAll(): Promise<DoctorScheduleOverride[]>;

  /**
   * Get override by specific date
   */
  getByDate(date: string): Promise<DoctorScheduleOverride | null>;

  /**
   * Get overrides within a date range
   */
  getByDateRange(startDate: string, endDate: string): Promise<DoctorScheduleOverride[]>;

  /**
   * Get overrides for a specific doctor
   */
  getByDoctorId(doctorId: string): Promise<DoctorScheduleOverride[]>;

  /**
   * Get override by ID
   */
  getById(id: string): Promise<DoctorScheduleOverride | null>;

  /**
   * Create a new schedule override
   */
  create(override: DoctorScheduleOverride): Promise<DoctorScheduleOverride>;

  /**
   * Update an existing schedule override
   */
  update(override: DoctorScheduleOverride): Promise<DoctorScheduleOverride>;

  /**
   * Delete a schedule override by ID
   */
  delete(id: string): Promise<void>;

  /**
   * Delete override by date
   */
  deleteByDate(date: string): Promise<void>;

  /**
   * Check if override exists for a specific date
   */
  existsByDate(date: string): Promise<boolean>;

  /**
   * Get overrides for multiple dates
   */
  getByDates(dates: string[]): Promise<DoctorScheduleOverride[]>;
}
