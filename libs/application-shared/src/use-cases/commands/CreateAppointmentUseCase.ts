import { injectable, inject } from 'tsyringe';
import { 
  Appointment, 
  AppointmentDomainService, 
  type IAppointmentRepository,
  Schedule,
  type IScheduleRepository,
  type IDoctorRepository
} from '@nx-starter/domain';
import { type IPatientRepository } from '../../domain/IPatientRepository';
import type { CreateAppointmentCommand } from '../../dto/AppointmentCommands';
import { TOKENS } from '../../di/tokens';

/**
 * Use case for creating a new appointment
 * Handles all business logic and validation for appointment creation
 * Automatically creates corresponding schedule entry for doctor's calendar
 */
@injectable()
export class CreateAppointmentUseCase {
  constructor(
    @inject(TOKENS.AppointmentRepository) private appointmentRepository: IAppointmentRepository,
    @inject(TOKENS.ScheduleRepository) private scheduleRepository: IScheduleRepository,
    @inject(TOKENS.DoctorRepository) private doctorRepository: IDoctorRepository,
    @inject(TOKENS.PatientRepository) private patientRepository: IPatientRepository
  ) {}

  async execute(command: CreateAppointmentCommand): Promise<Appointment> {
    // Fetch patient information for user-friendly error messages
    const patient = await this.patientRepository.getById(command.patientId);
    const patientName = patient ? patient.fullName : undefined;

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
    await domainService.validateAppointmentCreation(appointment, patientName);

    // Persist appointment using repository
    const appointmentId = await this.appointmentRepository.create(appointment);

    // Create corresponding schedule entry for doctor's calendar
    const schedule = new Schedule(
      command.doctorId,
      command.appointmentDate,
      command.appointmentTime
    );

    // Validate and create schedule
    schedule.validate();
    await this.scheduleRepository.create(schedule);

    // Return the created appointment with ID
    return new Appointment(
      appointment.patientId,
      appointment.reasonForVisit,
      appointment.appointmentDate,
      appointment.appointmentTime,
      appointment.doctorId,
      appointment.statusValue,
      appointmentId,
      appointment.createdAt
    );
  }
}
