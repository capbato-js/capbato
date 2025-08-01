import { injectable, inject } from 'tsyringe';
import { Doctor, IDoctorRepository } from '@nx-starter/domain';
import { TOKENS } from '@nx-starter/application-shared';

/**
 * Query handler for retrieving doctors by specialization
 * Follows CQRS pattern - read-only operations
 */
@injectable()
export class GetDoctorsBySpecializationQueryHandler {
  constructor(
    @inject(TOKENS.DoctorRepository)
    private doctorRepository: IDoctorRepository
  ) {}

  async execute(specialization: string): Promise<Doctor[]> {
    return await this.doctorRepository.getBySpecialization(specialization);
  }
}
