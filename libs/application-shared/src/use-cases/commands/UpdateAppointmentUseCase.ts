import { injectable, inject } from 'tsyringe';
import { Appointment, AppointmentDomainService, type IAppointmentRepository, AppointmentNotFoundException } from '@nx-starter/domain';
import type { UpdateAppointmentCommand } from '../../dto/AppointmentCommands';
import { TOKENS } from '../../di/tokens';

/**
 * Use case for updating an existing appointment
 * Handles all business logic and validation for appointment updates
 */
@injectable()
export class UpdateAppointmentUseCase {
  constructor(
    @inject(TOKENS.AppointmentRepository) private appointmentRepository: IAppointmentRepository
  ) {}

  async execute(command: UpdateAppointmentCommand): Promise<void> {
    // Get existing appointment
    const existingAppointment = await this.appointmentRepository.getById(command.id);
    if (!existingAppointment) {
      throw new AppointmentNotFoundException(`Appointment with ID ${command.id} not found`);
    }

    // Create updated appointment entity
    const updatedAppointment = new Appointment(
      command.patientId ?? existingAppointment.patientId,
      command.reasonForVisit ?? existingAppointment.reasonForVisit,
      command.appointmentDate ?? existingAppointment.appointmentDate,
      command.appointmentTime ?? existingAppointment.appointmentTime,
      command.doctorId ?? existingAppointment.doctorId,
      command.status ?? existingAppointment.statusValue,
      existingAppointment.stringId,
      existingAppointment.createdAt,
      new Date() // updatedAt
    );

    // Validate business invariants
    updatedAppointment.validate();

    // Create domain service for business rule validation
    const domainService = new AppointmentDomainService(this.appointmentRepository);
    await domainService.validateAppointmentUpdate(updatedAppointment, command.id);

    // Update using repository
    await this.appointmentRepository.update(command.id, updatedAppointment);
  }
}
