import { injectable, inject } from 'tsyringe';
import { 
  AppointmentDomainService, 
  type IAppointmentRepository, 
  AppointmentNotFoundException,
  type IScheduleRepository,
  Schedule
} from '@nx-starter/domain';
import type { RescheduleAppointmentCommand } from '../../dto/AppointmentCommands';
import { TOKENS } from '../../di/tokens';

/**
 * Use case for rescheduling an appointment
 * Handles all business logic and validation for appointment rescheduling
 * Updates corresponding schedule entry for doctor's calendar
 */
@injectable()
export class RescheduleAppointmentUseCase {
  constructor(
    @inject(TOKENS.AppointmentRepository) private appointmentRepository: IAppointmentRepository,
    @inject(TOKENS.ScheduleRepository) private scheduleRepository: IScheduleRepository
  ) {}

  async execute(command: RescheduleAppointmentCommand): Promise<void> {
    // Get existing appointment
    const existingAppointment = await this.appointmentRepository.getById(command.id);
    if (!existingAppointment) {
      throw new AppointmentNotFoundException(`Appointment with ID ${command.id} not found`);
    }

    // Store old appointment details for schedule cleanup
    const oldDateStr = existingAppointment.appointmentDate.toISOString().split('T')[0];
    const oldTime = existingAppointment.appointmentTime.value;
    const doctorId = existingAppointment.doctorId;

    // Reschedule the appointment using domain logic
    const rescheduledAppointment = existingAppointment.reschedule(
      command.appointmentDate,
      command.appointmentTime
    );

    // Create domain service for business rule validation
    const domainService = new AppointmentDomainService(this.appointmentRepository);
    await domainService.validateAppointmentUpdate(rescheduledAppointment, command.id);

    // Update appointment using repository
    await this.appointmentRepository.update(command.id, rescheduledAppointment);

    // Remove old schedule entries
    const doctorSchedules = await this.scheduleRepository.getByDoctorId(doctorId);
    const oldMatchingSchedules = doctorSchedules.filter(schedule => 
      schedule.dateString === oldDateStr && 
      schedule.timeString === oldTime
    );

    for (const schedule of oldMatchingSchedules) {
      if (schedule.id) {
        await this.scheduleRepository.delete(schedule.id);
      }
    }

    // Create new schedule entry for the rescheduled appointment
    const newSchedule = new Schedule(
      doctorId,
      command.appointmentDate,
      command.appointmentTime
    );

    newSchedule.validate();
    await this.scheduleRepository.create(newSchedule);
  }
}
