import { injectable, inject } from 'tsyringe';
import { Appointment, type IAppointmentRepository } from '@nx-starter/domain';
import type { GetAppointmentsByDateQuery } from '../../dto/AppointmentQueries';
import { TOKENS } from '../../di/tokens';

/**
 * Query handler for retrieving appointments by specific date
 */
@injectable()
export class GetAppointmentsByDateQueryHandler {
  constructor(
    @inject(TOKENS.AppointmentRepository) private appointmentRepository: IAppointmentRepository
  ) {}

  async execute(query: GetAppointmentsByDateQuery): Promise<Appointment[]> {
    return this.appointmentRepository.getAppointmentsByDate(query.date);
  }
}
