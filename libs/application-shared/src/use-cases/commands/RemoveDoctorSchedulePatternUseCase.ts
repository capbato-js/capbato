import { injectable, inject } from 'tsyringe';
import { 
  Doctor, 
  IDoctorRepository
} from '@nx-starter/domain';
import { RemoveDoctorSchedulePatternCommand } from '../../dto/DoctorCommands';

/**
 * Use Case for removing a doctor's schedule pattern
 * Only administrators should be able to execute this command
 */
@injectable()
export class RemoveDoctorSchedulePatternUseCase {
  constructor(
    @inject('IDoctorRepository') private doctorRepository: IDoctorRepository
  ) {}

  async execute(command: RemoveDoctorSchedulePatternCommand): Promise<Doctor> {
    // Find the doctor
    const doctor = await this.doctorRepository.getById(command.id);
    if (!doctor) {
      throw new Error(`Doctor with ID ${command.id} not found`);
    }

    // Remove the doctor's schedule pattern
    const updatedDoctor = doctor.removeSchedulePattern();

    // Save the updated doctor
    const savedDoctor = await this.doctorRepository.update(updatedDoctor);

    return savedDoctor;
  }
}