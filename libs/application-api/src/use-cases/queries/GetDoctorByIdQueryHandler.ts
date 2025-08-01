import { injectable, inject } from 'tsyringe';
import { Doctor, IDoctorRepository, DoctorNotFoundException } from '@nx-starter/domain';
import { TOKENS } from '@nx-starter/application-shared';

/**
 * Query handler for retrieving a doctor by ID
 * Follows CQRS pattern - read-only operations
 */
@injectable()
export class GetDoctorByIdQueryHandler {
  constructor(
    @inject(TOKENS.DoctorRepository)
    private doctorRepository: IDoctorRepository
  ) {}

  async execute(id: string): Promise<Doctor> {
    const doctor = await this.doctorRepository.getById(id);
    
    if (!doctor) {
      throw new DoctorNotFoundException(id);
    }
    
    return doctor;
  }
}
