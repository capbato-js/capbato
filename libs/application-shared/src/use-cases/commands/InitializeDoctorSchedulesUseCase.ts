import { injectable, inject } from 'tsyringe';
import { 
  Doctor, 
  IDoctorRepository,
  DoctorScheduleService
} from '@nx-starter/domain';

/**
 * Use Case for initializing default schedule patterns for doctors that don't have them
 * This is useful for migrating existing doctors to the centralized schedule system
 * Only administrators should be able to execute this command
 */
@injectable()
export class InitializeDoctorSchedulesUseCase {
  constructor(
    @inject('IDoctorRepository') private doctorRepository: IDoctorRepository
  ) {}

  async execute(): Promise<{ updated: number; skipped: number; doctors: Doctor[] }> {
    // Get all active doctors
    const doctors = await this.doctorRepository.getActiveDoctors();
    
    let updated = 0;
    let skipped = 0;
    const updatedDoctors: Doctor[] = [];

    for (let i = 0; i < doctors.length; i++) {
      const doctor = doctors[i];
      
      // Skip doctors that already have a schedule pattern
      if (doctor.schedulePattern) {
        skipped++;
        continue;
      }

      // Assign default schedule pattern based on position
      const defaultPattern = DoctorScheduleService.getDefaultSchedulePattern(i);
      const updatedDoctor = doctor.updateSchedulePattern(defaultPattern);
      
      // Save the updated doctor
      const savedDoctor = await this.doctorRepository.update(updatedDoctor);
      updatedDoctors.push(savedDoctor);
      updated++;
    }

    return {
      updated,
      skipped,
      doctors: updatedDoctors
    };
  }
}