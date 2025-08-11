import { injectable, inject } from 'tsyringe';
import { 
  Doctor, 
  IDoctorRepository,
  DoctorSchedulePattern
} from '@nx-starter/domain';
import { UpdateDoctorSchedulePatternCommand } from '../../dto/DoctorCommands';

/**
 * Use Case for updating a doctor's schedule pattern
 * Only administrators should be able to execute this command
 */
@injectable()
export class UpdateDoctorSchedulePatternUseCase {
  constructor(
    @inject('IDoctorRepository') private doctorRepository: IDoctorRepository
  ) {}

  async execute(command: UpdateDoctorSchedulePatternCommand): Promise<Doctor> {
    // Find the doctor
    const doctor = await this.doctorRepository.getById(command.id);
    if (!doctor) {
      throw new Error(`Doctor with ID ${command.id} not found`);
    }

    // Validate and parse the schedule pattern
    let schedulePattern: DoctorSchedulePattern;
    try {
      schedulePattern = DoctorSchedulePattern.fromString(command.schedulePattern);
    } catch (error) {
      throw new Error(`Invalid schedule pattern: ${command.schedulePattern}. Valid patterns include: MWF, TTH, WEEKDAYS, etc.`);
    }

    // Update the doctor's schedule pattern
    const updatedDoctor = doctor.updateSchedulePattern(schedulePattern);

    // Save the updated doctor
    const savedDoctor = await this.doctorRepository.update(updatedDoctor);

    return savedDoctor;
  }
}