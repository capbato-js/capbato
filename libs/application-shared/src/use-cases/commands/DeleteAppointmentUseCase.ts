import { injectable, inject } from 'tsyringe';
import { 
  type IAppointmentRepository, 
  AppointmentNotFoundException,
  type IScheduleRepository
} from '@nx-starter/domain';
import type { DeleteAppointmentCommand } from '../../dto/AppointmentCommands';
import { TOKENS } from '../../di/tokens';

/**
 * Use case for deleting an appointment
 * Handles all business logic and validation for appointment deletion
 * Removes corresponding schedule entry from doctor's calendar
 */
@injectable()
export class DeleteAppointmentUseCase {
  constructor(
    @inject(TOKENS.AppointmentRepository) private appointmentRepository: IAppointmentRepository,
    @inject(TOKENS.ScheduleRepository) private scheduleRepository: IScheduleRepository
  ) {}

  async execute(command: DeleteAppointmentCommand): Promise<void> {
    // Check if appointment exists and get its details before deletion
    const appointment = await this.appointmentRepository.getById(command.id);
    if (!appointment) {
      throw new AppointmentNotFoundException(`Appointment with ID ${command.id} not found`);
    }

    // Store appointment details for schedule cleanup
    const appointmentDateStr = appointment.appointmentDate.toISOString().split('T')[0];
    const appointmentTime = appointment.appointmentTime.value;
    const doctorId = appointment.doctorId;

    // Delete appointment using repository
    await this.appointmentRepository.delete(command.id);

    // Remove corresponding schedule entries for this doctor, date, and time
    const doctorSchedules = await this.scheduleRepository.getByDoctorId(doctorId);
    
    // Filter schedules that match the deleted appointment date and time
    const matchingSchedules = doctorSchedules.filter(schedule => 
      schedule.dateString === appointmentDateStr && 
      schedule.timeString === appointmentTime
    );

    // Delete matching schedule entries
    for (const schedule of matchingSchedules) {
      if (schedule.id) {
        await this.scheduleRepository.delete(schedule.id);
      }
    }
  }
}
