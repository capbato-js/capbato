import { injectable, inject } from 'tsyringe';
import { AppointmentDomainService, type IAppointmentRepository } from '@nx-starter/domain';
import type { AppointmentStatsDto } from '../../dto/AppointmentQueries';
import { TOKENS } from '../../di/tokens';

/**
 * Query handler for retrieving appointment statistics
 */
@injectable()
export class GetAppointmentStatsQueryHandler {
  constructor(
    @inject(TOKENS.AppointmentRepository) private appointmentRepository: IAppointmentRepository
  ) {}

  async execute(): Promise<AppointmentStatsDto> {
    // Create domain service for statistics calculation
    const domainService = new AppointmentDomainService(this.appointmentRepository);
    const stats = await domainService.calculateAppointmentStats();

    return {
      total: stats.total,
      confirmed: stats.confirmed,
      cancelled: stats.cancelled,
      completed: stats.completed,
      todayTotal: stats.todayTotal,
      todayConfirmed: stats.todayConfirmed,
    };
  }
}
