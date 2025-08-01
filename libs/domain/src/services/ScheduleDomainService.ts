import { Schedule } from '../entities/Schedule';
import { DoctorId } from '../value-objects/DoctorId';
import { IDoctorRepository } from '../repositories/IDoctorRepository';
import { DoctorNotFoundForScheduleException } from '../exceptions/DomainExceptions';

/**
 * Domain Service for Schedule Business Logic
 * Contains business rules that don't naturally fit in a single entity
 */
export class ScheduleDomainService {
  constructor(private doctorRepository: IDoctorRepository) {}

  /**
   * Validates that a doctor exists before creating/updating a schedule
   * @param doctorId - The doctor ID to validate
   * @throws DoctorNotFoundForScheduleException if doctor doesn't exist
   */
  async validateDoctorExists(doctorId: DoctorId | string): Promise<void> {
    const id = doctorId instanceof DoctorId ? doctorId.value : doctorId;
    
    const exists = await this.doctorRepository.exists(id);
    if (!exists) {
      throw new DoctorNotFoundForScheduleException(id);
    }
  }

  /**
   * Validates that multiple doctors exist (for batch operations)
   * @param doctorIds - Array of doctor IDs to validate
   * @throws DoctorNotFoundForScheduleException for the first non-existent doctor
   */
  async validateDoctorsExist(doctorIds: (DoctorId | string)[]): Promise<void> {
    for (const doctorId of doctorIds) {
      await this.validateDoctorExists(doctorId);
    }
  }

  /**
   * Check if schedules conflict with each other
   * @param schedules - Array of schedules to check for conflicts
   * @returns Array of conflicting schedule pairs
   */
  findScheduleConflicts(schedules: Schedule[]): Array<{ schedule1: Schedule; schedule2: Schedule }> {
    const conflicts: Array<{ schedule1: Schedule; schedule2: Schedule }> = [];
    
    for (let i = 0; i < schedules.length; i++) {
      for (let j = i + 1; j < schedules.length; j++) {
        if (schedules[i].conflictsWith(schedules[j])) {
          conflicts.push({
            schedule1: schedules[i],
            schedule2: schedules[j]
          });
        }
      }
    }
    
    return conflicts;
  }

  /**
   * Get schedules grouped by doctor ID
   * @param schedules - Schedules to group
   * @returns Map of doctor ID to their schedules
   */
  groupSchedulesByDoctor(schedules: Schedule[]): Map<string, Schedule[]> {
    const grouped = new Map<string, Schedule[]>();
    
    for (const schedule of schedules) {
      const doctorId = schedule.doctorId?.value;
      if (!doctorId) continue;
      
      if (!grouped.has(doctorId)) {
        grouped.set(doctorId, []);
      }
      const doctorSchedules = grouped.get(doctorId);
      if (doctorSchedules) {
        doctorSchedules.push(schedule);
      }
    }
    
    return grouped;
  }
}
