import { injectable, inject } from 'tsyringe';
import { Appointment, type IAppointmentRepository, AppointmentNotFoundException } from '@nx-starter/domain';
import type { GetAppointmentByIdQuery } from '../../dto/AppointmentQueries';
import { TOKENS } from '../../di/tokens';

/**
 * Query handler for retrieving a specific appointment by ID
 */
@injectable()
export class GetAppointmentByIdQueryHandler {
  constructor(
    @inject(TOKENS.AppointmentRepository) private appointmentRepository: IAppointmentRepository
  ) {}

  async execute(query: GetAppointmentByIdQuery): Promise<Appointment> {
    const appointment = await this.appointmentRepository.getById(query.id);
    
    if (!appointment) {
      throw new AppointmentNotFoundException(`Appointment with ID ${query.id} not found`);
    }

    return appointment;
  }
}
