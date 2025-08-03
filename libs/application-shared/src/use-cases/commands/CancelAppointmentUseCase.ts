import { injectable, inject } from 'tsyringe';
import { 
  type IAppointmentRepository, 
  AppointmentNotFoundException,
  type IScheduleRepository
} from '@nx-starter/domain';
import type { CancelAppointmentCommand } from '../../dto/AppointmentCommands';
import { TOKENS } from '../../di/tokens';

/**
 * Use case for cancelling an appointment
 * Handles all business logic and validation for appointment cancellation
 * Removes corresponding schedule entry from doctor's calendar
 */
@injectable()
export class CancelAppointmentUseCase {
  constructor(
    @inject(TOKENS.AppointmentRepository) private appointmentRepository: IAppointmentRepository,
    @inject(TOKENS.ScheduleRepository) private scheduleRepository: IScheduleRepository
  ) {}

  async execute(command: CancelAppointmentCommand): Promise<void> {
    // Get existing appointment
    const existingAppointment = await this.appointmentRepository.getById(command.id);
    if (!existingAppointment) {
      throw new AppointmentNotFoundException(`Appointment with ID ${command.id} not found`);
    }

    // Cancel the appointment using domain logic
    const cancelledAppointment = existingAppointment.cancel();

    // Update appointment using repository
    await this.appointmentRepository.update(command.id, cancelledAppointment);

    // Remove corresponding schedule entries for this doctor, date, and time
    // Find schedules that match the cancelled appointment
    const doctorSchedules = await this.scheduleRepository.getByDoctorId(existingAppointment.doctorId);
    const appointmentDateStr = existingAppointment.appointmentDate.toISOString().split('T')[0];
    
    // Filter schedules that match the appointment date and time
    const matchingSchedules = doctorSchedules.filter(schedule => 
      schedule.dateString === appointmentDateStr && 
      schedule.timeString === existingAppointment.appointmentTime.value
    );

    // Delete matching schedule entries
    for (const schedule of matchingSchedules) {
      if (schedule.id) {
        await this.scheduleRepository.delete(schedule.id);
      }
    }
  }
}
