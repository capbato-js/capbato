import { injectable, inject } from 'tsyringe';
import { type IAppointmentRepository, AppointmentNotFoundException } from '@nx-starter/domain';
import type { DeleteAppointmentCommand } from '../../dto/AppointmentCommands';
import { TOKENS } from '../../di/tokens';

/**
 * Use case for deleting an appointment
 * Handles all business logic and validation for appointment deletion
 */
@injectable()
export class DeleteAppointmentUseCase {
  constructor(
    @inject(TOKENS.AppointmentRepository) private appointmentRepository: IAppointmentRepository
  ) {}

  async execute(command: DeleteAppointmentCommand): Promise<void> {
    // Check if appointment exists
    const appointment = await this.appointmentRepository.getById(command.id);
    if (!appointment) {
      throw new AppointmentNotFoundException(`Appointment with ID ${command.id} not found`);
    }

    // Delete using repository
    await this.appointmentRepository.delete(command.id);
  }
}
