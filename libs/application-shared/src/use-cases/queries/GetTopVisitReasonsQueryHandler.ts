import { injectable, inject } from 'tsyringe';
import { type IAppointmentRepository, type TopVisitReasonDto } from '@nx-starter/domain';
import type { GetTopVisitReasonsQuery } from '../../dto/AppointmentQueries';
import { TOKENS } from '../../di/tokens';

/**
 * Query handler for retrieving top visit reasons from appointments
 */
@injectable()
export class GetTopVisitReasonsQueryHandler {
  constructor(
    @inject(TOKENS.AppointmentRepository) private appointmentRepository: IAppointmentRepository
  ) {}

  async execute(query?: GetTopVisitReasonsQuery): Promise<TopVisitReasonDto[]> {
    return this.appointmentRepository.getTopVisitReasons(query);
  }
}
