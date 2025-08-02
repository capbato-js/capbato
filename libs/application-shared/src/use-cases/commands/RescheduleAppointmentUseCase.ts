import { injectable, inject } from 'tsyringe';
import { AppointmentDomainService, type IAppointmentRepository, AppointmentNotFoundException } from '@nx-starter/domain';
import type { RescheduleAppointmentCommand } from '../../dto/AppointmentCommands';
import { TOKENS } from '../../di/tokens';

/**
 * Use case for rescheduling an appointment
 * Handles all business logic and validation for appointment rescheduling
 */
@injectable()
export class RescheduleAppointmentUseCase {
  constructor(
    @inject(TOKENS.AppointmentRepository) private appointmentRepository: IAppointmentRepository
  ) {}

  async execute(command: RescheduleAppointmentCommand): Promise<void> {
    // Get existing appointment
    const existingAppointment = await this.appointmentRepository.getById(command.id);
    if (!existingAppointment) {
      throw new AppointmentNotFoundException(`Appointment with ID ${command.id} not found`);
    }

    // Reschedule the appointment using domain logic
    const rescheduledAppointment = existingAppointment.reschedule(
      command.appointmentDate,
      command.appointmentTime
    );

    // Create domain service for business rule validation
    const domainService = new AppointmentDomainService(this.appointmentRepository);
    await domainService.validateAppointmentUpdate(rescheduledAppointment, command.id);

    // Update using repository
    await this.appointmentRepository.update(command.id, rescheduledAppointment);
  }
}
