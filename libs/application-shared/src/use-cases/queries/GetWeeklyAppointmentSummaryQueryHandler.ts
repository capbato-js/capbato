import { injectable, inject } from 'tsyringe';
import { type IAppointmentRepository } from '@nx-starter/domain';
import type { WeeklyAppointmentSummaryDto } from '../../dto/AppointmentQueries';
import { TOKENS } from '../../di/tokens';

export interface GetWeeklyAppointmentSummaryQuery {
  startDate?: string;
  endDate?: string;
  granularity?: 'daily' | 'weekly' | 'monthly';
}

/**
 * Query handler for retrieving appointment summary with flexible date range and granularity
 */
@injectable()
export class GetWeeklyAppointmentSummaryQueryHandler {
  constructor(
    @inject(TOKENS.AppointmentRepository) private appointmentRepository: IAppointmentRepository
  ) {}

  async execute(query?: GetWeeklyAppointmentSummaryQuery): Promise<WeeklyAppointmentSummaryDto[]> {
    return this.appointmentRepository.getWeeklyAppointmentSummary(query);
  }
}
