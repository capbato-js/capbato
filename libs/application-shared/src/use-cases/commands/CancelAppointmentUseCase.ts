import { injectable, inject } from 'tsyringe';
import { type IAppointmentRepository, AppointmentNotFoundException } from '@nx-starter/domain';
import type { CancelAppointmentCommand } from '../../dto/AppointmentCommands';
import { TOKENS } from '../../di/tokens';

/**
 * Use case for cancelling an appointment
 * Handles all business logic and validation for appointment cancellation
 */
@injectable()
export class CancelAppointmentUseCase {
  constructor(
    @inject(TOKENS.AppointmentRepository) private appointmentRepository: IAppointmentRepository
  ) {}

  async execute(command: CancelAppointmentCommand): Promise<void> {
    // Get existing appointment
    const existingAppointment = await this.appointmentRepository.getById(command.id);
    if (!existingAppointment) {
      throw new AppointmentNotFoundException(`Appointment with ID ${command.id} not found`);
    }

    // Cancel the appointment using domain logic
    const cancelledAppointment = existingAppointment.cancel();

    // Update using repository
    await this.appointmentRepository.update(command.id, cancelledAppointment);
  }
}
