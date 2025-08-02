import { injectable, inject } from 'tsyringe';
import { Appointment, type IAppointmentRepository } from '@nx-starter/domain';
import { TOKENS } from '../../di/tokens';

/**
 * Query handler for retrieving today's confirmed appointments
 */
@injectable()
export class GetTodayConfirmedAppointmentsQueryHandler {
  constructor(
    @inject(TOKENS.AppointmentRepository) private appointmentRepository: IAppointmentRepository
  ) {}

  async execute(): Promise<Appointment[]> {
    return this.appointmentRepository.getTodayConfirmedAppointments();
  }
}
