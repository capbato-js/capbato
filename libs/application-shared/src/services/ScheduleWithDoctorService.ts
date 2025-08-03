import { injectable, inject } from 'tsyringe';
import { Schedule } from '@nx-starter/domain';
import type { IDoctorRepository, IScheduleRepository, IUserRepository } from '@nx-starter/domain';
import { TOKENS } from '../di/tokens';

/**
 * Service for handling schedule operations with doctor name population
 * Provides enhanced schedule data with doctor names for calendar display
 */
@injectable()
export class ScheduleWithDoctorService {
  constructor(
    @inject(TOKENS.ScheduleRepository) private scheduleRepository: IScheduleRepository,
    @inject(TOKENS.DoctorRepository) private doctorRepository: IDoctorRepository,
    @inject(TOKENS.UserRepository) private userRepository: IUserRepository
  ) {}

  /**
   * Get all schedules with doctor names populated
   */
  async getAllSchedulesWithDoctorNames(activeOnly?: boolean): Promise<{ schedules: Schedule[]; doctorNames: Map<string, string> }> {
    const schedules = await this.scheduleRepository.getAll(activeOnly);
    const doctorNames = await this.populateDoctorNames(schedules);
    
    return { schedules, doctorNames };
  }

  /**
   * Get schedules by date with doctor names populated
   */
  async getSchedulesByDateWithDoctorNames(date: string): Promise<{ schedules: Schedule[]; doctorNames: Map<string, string> }> {
    const schedules = await this.scheduleRepository.getByDate(date);
    const doctorNames = await this.populateDoctorNames(schedules);
    
    return { schedules, doctorNames };
  }

  /**
   * Get schedules by doctor with doctor names populated
   */
  async getSchedulesByDoctorWithDoctorNames(doctorId: string): Promise<{ schedules: Schedule[]; doctorNames: Map<string, string> }> {
    const schedules = await this.scheduleRepository.getByDoctorId(doctorId);
    const doctorNames = await this.populateDoctorNames(schedules);
    
    return { schedules, doctorNames };
  }

  /**
   * Get today's schedules with doctor names populated
   */
  async getTodaySchedulesWithDoctorNames(): Promise<{ schedules: Schedule[]; doctorNames: Map<string, string> }> {
    const schedules = await this.scheduleRepository.getTodaySchedules();
    const doctorNames = await this.populateDoctorNames(schedules);
    
    return { schedules, doctorNames };
  }

  /**
   * Private method to populate doctor names for a list of schedules
   */
  private async populateDoctorNames(schedules: Schedule[]): Promise<Map<string, string>> {
    const doctorNames = new Map<string, string>();
    
    // Get unique doctor IDs
    const uniqueDoctorIds = [...new Set(schedules.map(schedule => schedule.doctorIdString))];
    
    // Batch fetch doctor information
    for (const doctorId of uniqueDoctorIds) {
      try {
        const doctor = await this.doctorRepository.getById(doctorId);
        if (doctor) {
          // Get user information to get the doctor's name
          const user = await this.userRepository.getById(doctor.userId);
          if (user) {
            const fullName = `${user.firstName} ${user.lastName}`.trim();
            doctorNames.set(doctorId, fullName || 'Unknown Doctor');
          } else {
            doctorNames.set(doctorId, 'Unknown Doctor');
          }
        } else {
          doctorNames.set(doctorId, 'Unknown Doctor');
        }
      } catch (error) {
        console.error(`Error fetching doctor name for ID ${doctorId}:`, error);
        doctorNames.set(doctorId, 'Unknown Doctor');
      }
    }
    
    return doctorNames;
  }
}
