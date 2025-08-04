import { injectable, inject } from 'tsyringe';
import { type IAppointmentRepository, AppointmentNotFoundException } from '@nx-starter/domain';
import type { CompleteAppointmentCommand } from '../../dto/AppointmentCommands';
import { TOKENS } from '../../di/tokens';

/**
 * Use case for completing an appointment
 * Handles all business logic and validation for appointment completion
 */
@injectable()
export class CompleteAppointmentUseCase {
  constructor(
    @inject(TOKENS.AppointmentRepository) private appointmentRepository: IAppointmentRepository
  ) {}

  async execute(command: CompleteAppointmentCommand): Promise<void> {
    // Get existing appointment
    const existingAppointment = await this.appointmentRepository.getById(command.id);
    if (!existingAppointment) {
      throw new AppointmentNotFoundException(`Appointment with ID ${command.id} not found`);
    }

    // Complete the appointment using domain logic
    const completedAppointment = existingAppointment.complete();

    // Update using repository
    await this.appointmentRepository.update(command.id, completedAppointment);
  }
}
