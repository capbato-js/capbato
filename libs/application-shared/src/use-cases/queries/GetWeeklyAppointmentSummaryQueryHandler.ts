import { injectable, inject } from 'tsyringe';
import { type IAppointmentRepository } from '@nx-starter/domain';
import type { WeeklyAppointmentSummaryDto } from '../../dto/AppointmentQueries';
import { TOKENS } from '../../di/tokens';

/**
 * Query handler for retrieving weekly appointment summary
 */
@injectable()
export class GetWeeklyAppointmentSummaryQueryHandler {
  constructor(
    @inject(TOKENS.AppointmentRepository) private appointmentRepository: IAppointmentRepository
  ) {}

  async execute(): Promise<WeeklyAppointmentSummaryDto[]> {
    return this.appointmentRepository.getWeeklyAppointmentSummary();
  }
}
