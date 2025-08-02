import { injectable, inject } from 'tsyringe';
import { Appointment, type IAppointmentRepository } from '@nx-starter/domain';
import type { GetAppointmentsByDateRangeQuery } from '../../dto/AppointmentQueries';
import { TOKENS } from '../../di/tokens';

/**
 * Query handler for retrieving appointments by date range
 */
@injectable()
export class GetAppointmentsByDateRangeQueryHandler {
  constructor(
    @inject(TOKENS.AppointmentRepository) private appointmentRepository: IAppointmentRepository
  ) {}

  async execute(query: GetAppointmentsByDateRangeQuery): Promise<Appointment[]> {
    return this.appointmentRepository.getAppointmentsByDateRange(
      query.startDate,
      query.endDate
    );
  }
}
