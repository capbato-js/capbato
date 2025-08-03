import { injectable, inject } from 'tsyringe';
import { Appointment, AppointmentDomainService, type IAppointmentRepository } from '@nx-starter/domain';
import type { CreateAppointmentCommand } from '../../dto/AppointmentCommands';
import { TOKENS } from '../../di/tokens';

/**
 * Use case for creating a new appointment
 * Handles all business logic and validation for appointment creation
 */
@injectable()
export class CreateAppointmentUseCase {
  constructor(
    @inject(TOKENS.AppointmentRepository) private appointmentRepository: IAppointmentRepository
  ) {}

  async execute(command: CreateAppointmentCommand): Promise<Appointment> {
    // Create appointment entity with domain logic
    const appointment = new Appointment(
      command.patientId,
      command.reasonForVisit,
      command.appointmentDate,
      command.appointmentTime,
      command.doctorId,
      command.status || 'confirmed'
    );

    // Validate business invariants
    appointment.validate();

    // Create domain service for business rule validation
    const domainService = new AppointmentDomainService(this.appointmentRepository);
    await domainService.validateAppointmentCreation(appointment);

    // Persist using repository
    const id = await this.appointmentRepository.create(appointment);

    // Return the created appointment with ID
    return new Appointment(
      appointment.patientId,
      appointment.reasonForVisit,
      appointment.appointmentDate,
      appointment.appointmentTime,
      appointment.doctorId,
      appointment.statusValue,
      id,
      appointment.createdAt
    );
  }
}
