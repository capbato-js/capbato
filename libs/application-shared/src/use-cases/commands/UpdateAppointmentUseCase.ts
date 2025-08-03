import { injectable, inject } from 'tsyringe';
import { 
  Appointment, 
  AppointmentDomainService, 
  type IAppointmentRepository, 
  AppointmentNotFoundException,
  type IScheduleRepository,
  Schedule,
  type IPatientRepository
} from '@nx-starter/domain';
import type { UpdateAppointmentCommand } from '../../dto/AppointmentCommands';
import { TOKENS } from '../../di/tokens';

/**
 * Use case for updating an existing appointment
 * Handles all business logic and validation for appointment updates
 * Automatically updates corresponding schedule entry for doctor's calendar
 */
@injectable()
export class UpdateAppointmentUseCase {
  constructor(
    @inject(TOKENS.AppointmentRepository) private appointmentRepository: IAppointmentRepository,
    @inject(TOKENS.ScheduleRepository) private scheduleRepository: IScheduleRepository,
    @inject(TOKENS.PatientRepository) private patientRepository: IPatientRepository
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

    // Fetch patient information for user-friendly error messages
    const patientId = command.patientId ?? existingAppointment.patientId;
    const patient = await this.patientRepository.getById(patientId);
    const patientName = patient ? patient.fullName : undefined;

    // Create domain service for business rule validation
    const domainService = new AppointmentDomainService(this.appointmentRepository);
    await domainService.validateAppointmentUpdate(updatedAppointment, command.id, patientName);

    // Update appointment using repository
    await this.appointmentRepository.update(command.id, updatedAppointment);

    // Update corresponding schedule entry if date, time, or doctor changed
    const dateChanged = command.appointmentDate && 
      command.appointmentDate.getTime() !== existingAppointment.appointmentDate.getTime();
    const timeChanged = command.appointmentTime && 
      command.appointmentTime !== existingAppointment.appointmentTime.value;
    const doctorChanged = command.doctorId && 
      command.doctorId !== existingAppointment.doctorId;

    if (dateChanged || timeChanged || doctorChanged) {
      // For simplicity, create a new schedule entry for the updated appointment
      // The calendar will show the updated information
      const schedule = new Schedule(
        updatedAppointment.doctorId,
        updatedAppointment.appointmentDate,
        updatedAppointment.appointmentTime.value
      );

      schedule.validate();
      await this.scheduleRepository.create(schedule);
    }
  }
}
