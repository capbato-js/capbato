import { injectable, inject } from 'tsyringe';
import { Appointment, type IAppointmentRepository } from '@nx-starter/domain';
import { TOKENS } from '../../di/tokens';

/**
 * Query handler for retrieving the current patient appointment
 * Returns the earliest non-completed appointment
 */
@injectable()
export class GetCurrentPatientAppointmentQueryHandler {
  constructor(
    @inject(TOKENS.AppointmentRepository) private appointmentRepository: IAppointmentRepository
  ) {}

  async execute(): Promise<Appointment | undefined> {
    return this.appointmentRepository.getCurrentPatientAppointment();
  }
}