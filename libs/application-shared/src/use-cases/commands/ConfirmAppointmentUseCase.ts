import { injectable, inject } from 'tsyringe';
import { AppointmentDomainService, type IAppointmentRepository, AppointmentNotFoundException } from '@nx-starter/domain';
import type { ConfirmAppointmentCommand } from '../../dto/AppointmentCommands';
import { TOKENS } from '../../di/tokens';

/**
 * Use case for confirming an appointment
 * Handles all business logic and validation for appointment confirmation
 */
@injectable()
export class ConfirmAppointmentUseCase {
  constructor(
    @inject(TOKENS.AppointmentRepository) private appointmentRepository: IAppointmentRepository
  ) {}

  async execute(command: ConfirmAppointmentCommand): Promise<void> {
    // Get existing appointment
    const existingAppointment = await this.appointmentRepository.getById(command.id);
    if (!existingAppointment) {
      throw new AppointmentNotFoundException(`Appointment with ID ${command.id} not found`);
    }

    // Create domain service to check if appointment can be confirmed
    const domainService = new AppointmentDomainService(this.appointmentRepository);
    const canConfirm = await domainService.canConfirmAppointment(existingAppointment);
    
    if (!canConfirm) {
      if (existingAppointment.isConfirmed()) {
        throw new Error('Appointment is already confirmed');
      }
      if (existingAppointment.isCancelled()) {
        throw new Error('Cannot confirm a cancelled appointment');
      }
      throw new Error('Time slot is no longer available for confirmation');
    }

    // Confirm the appointment using domain logic
    const confirmedAppointment = existingAppointment.confirm();

    // Update using repository
    await this.appointmentRepository.update(command.id, confirmedAppointment);
  }
}
