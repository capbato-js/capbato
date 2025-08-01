import { injectable, inject } from 'tsyringe';
import { Doctor, IDoctorRepository } from '@nx-starter/domain';
import { TOKENS } from '@nx-starter/application-shared';

/**
 * Query handler for retrieving all doctors
 * Follows CQRS pattern - read-only operations
 */
@injectable()
export class GetAllDoctorsQueryHandler {
  constructor(
    @inject(TOKENS.DoctorRepository)
    private doctorRepository: IDoctorRepository
  ) {}

  async execute(): Promise<Doctor[]> {
    return await this.doctorRepository.getAll();
  }
}
