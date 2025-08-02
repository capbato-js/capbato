import { injectable, inject } from 'tsyringe';
import { Appointment, type IAppointmentRepository } from '@nx-starter/domain';
import type { GetAppointmentsByPatientIdQuery } from '../../dto/AppointmentQueries';
import { TOKENS } from '../../di/tokens';

/**
 * Query handler for retrieving appointments by patient ID
 */
@injectable()
export class GetAppointmentsByPatientIdQueryHandler {
  constructor(
    @inject(TOKENS.AppointmentRepository) private appointmentRepository: IAppointmentRepository
  ) {}

  async execute(query: GetAppointmentsByPatientIdQuery): Promise<Appointment[]> {
    return this.appointmentRepository.getByPatientId(query.patientId);
  }
}
