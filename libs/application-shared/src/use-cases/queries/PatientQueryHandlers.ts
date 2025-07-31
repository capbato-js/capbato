import { injectable, inject } from 'tsyringe';
import { Patient } from '../../domain/Patient';
import { IPatientRepository } from '../../domain/IPatientRepository';
import { PatientNotFoundError } from '../../domain/PatientExceptions';
import type {
  GetPatientByIdQuery,
  GetAllPatientsQuery,
  GetPatientStatsQuery,
} from '../../dto/PatientQueries';
import type { PatientStatsDto } from '../../dto/PatientDto';
import { TOKENS } from '../../di/tokens';

/**
 * Query handler for getting all patients
 */
@injectable()
export class GetAllPatientsQueryHandler {
  constructor(
    @inject(TOKENS.PatientRepository) private patientRepository: IPatientRepository
  ) {}

  async execute(): Promise<Patient[]> {
    return await this.patientRepository.getAll();
  }
}

/**
 * Query handler for getting patient by ID
 */
@injectable()
export class GetPatientByIdQueryHandler {
  constructor(
    @inject(TOKENS.PatientRepository) private patientRepository: IPatientRepository
  ) {}

  async execute(query: GetPatientByIdQuery): Promise<Patient> {
    const patient = await this.patientRepository.getById(query.id);
    if (!patient) {
      throw new PatientNotFoundError(query.id);
    }
    return patient;
  }
}

/**
 * Query handler for getting patient statistics
 */
@injectable()
export class GetPatientStatsQueryHandler {
  constructor(
    @inject(TOKENS.PatientRepository) private patientRepository: IPatientRepository
  ) {}

  async execute(): Promise<PatientStatsDto> {
    const [total, genderCounts, ageCounts] = await Promise.all([
      this.patientRepository.getTotalCount(),
      this.patientRepository.getCountByGender(),
      this.patientRepository.getCountByAgeCategory(),
    ]);

    return {
      total,
      byGender: {
        male: genderCounts.male,
        female: genderCounts.female,
      },
      byAge: {
        children: ageCounts.children,
        adults: ageCounts.adults,
        seniors: ageCounts.seniors,
      },
    };
  }
}