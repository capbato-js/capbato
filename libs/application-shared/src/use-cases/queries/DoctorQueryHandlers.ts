import { injectable, inject } from 'tsyringe';
import type { IDoctorRepository, IUserRepository } from '@nx-starter/domain';
import type {
  GetDoctorByIdQuery,
  GetDoctorByUserIdQuery,
  GetActiveDoctorsQuery,
  GetAllDoctorsQuery,
  GetDoctorsBySpecializationQuery,
  DoctorDto,
  DoctorSummaryDto,
} from '../../dto/DoctorQueries';
import { DoctorMapper } from '../../mappers/DoctorMapper';
import { TOKENS } from '../../di/tokens';

/**
 * Query handler for getting all doctors with their user information
 */
@injectable()
export class GetAllDoctorsQueryHandler {
  constructor(
    @inject(TOKENS.DoctorRepository) private doctorRepository: IDoctorRepository,
    @inject(TOKENS.UserRepository) private userRepository: IUserRepository
  ) {}

  async execute(query?: GetAllDoctorsQuery): Promise<DoctorDto[]> {
    // Get doctors based on filter criteria
    const doctors = query?.activeOnly 
      ? await this.doctorRepository.getActiveDoctors()
      : await this.doctorRepository.getAll();

    // Get corresponding users for each doctor
    const doctorsWithUsers = [];
    for (const doctor of doctors) {
      const user = await this.userRepository.getById(doctor.userId);
      if (user) {
        doctorsWithUsers.push({ doctor, user });
      }
    }

    return DoctorMapper.toDtoArray(doctorsWithUsers);
  }

  /**
   * Get summary information for listings (lighter payload)
   */
  async getSummary(query?: GetAllDoctorsQuery): Promise<DoctorSummaryDto[]> {
    const doctors = query?.activeOnly 
      ? await this.doctorRepository.getActiveDoctors()
      : await this.doctorRepository.getAll();

    const doctorsWithUsers = [];
    for (const doctor of doctors) {
      const user = await this.userRepository.getById(doctor.userId);
      if (user) {
        doctorsWithUsers.push({ doctor, user });
      }
    }

    return DoctorMapper.toSummaryDtoArray(doctorsWithUsers);
  }
}

/**
 * Query handler for getting doctor by profile ID
 */
@injectable()
export class GetDoctorByIdQueryHandler {
  constructor(
    @inject(TOKENS.DoctorRepository) private doctorRepository: IDoctorRepository,
    @inject(TOKENS.UserRepository) private userRepository: IUserRepository
  ) {}

  async execute(query: GetDoctorByIdQuery): Promise<DoctorDto | null> {
    const doctor = await this.doctorRepository.getById(query.id);
    if (!doctor) {
      return null;
    }

    const user = await this.userRepository.getById(doctor.userId);
    if (!user) {
      throw new Error(`User not found for doctor profile: ${doctor.userId}`);
    }

    return DoctorMapper.toDto(doctor, user);
  }
}

/**
 * Query handler for getting doctor by user ID
 */
@injectable()
export class GetDoctorByUserIdQueryHandler {
  constructor(
    @inject(TOKENS.DoctorRepository) private doctorRepository: IDoctorRepository,
    @inject(TOKENS.UserRepository) private userRepository: IUserRepository
  ) {}

  async execute(query: GetDoctorByUserIdQuery): Promise<DoctorDto | null> {
    const doctor = await this.doctorRepository.getByUserId(query.userId);
    if (!doctor) {
      return null;
    }

    const user = await this.userRepository.getById(doctor.userId);
    if (!user) {
      throw new Error(`User not found for doctor profile: ${doctor.userId}`);
    }

    return DoctorMapper.toDto(doctor, user);
  }
}

/**
 * Query handler for checking if a user has a doctor profile
 */
@injectable()
export class CheckDoctorProfileExistsQueryHandler {
  constructor(
    @inject(TOKENS.DoctorRepository) private doctorRepository: IDoctorRepository
  ) {}

  async execute(userId: string): Promise<boolean> {
    return await this.doctorRepository.existsByUserId(userId);
  }
}

/**
 * Query handler for getting doctors by specialization
 */
@injectable()
export class GetDoctorsBySpecializationQueryHandler {
  constructor(
    @inject(TOKENS.DoctorRepository) private doctorRepository: IDoctorRepository,
    @inject(TOKENS.UserRepository) private userRepository: IUserRepository
  ) {}

  async execute(query: GetDoctorsBySpecializationQuery, activeOnly = true): Promise<DoctorDto[]> {
    const allDoctors = activeOnly 
      ? await this.doctorRepository.getActiveDoctors()
      : await this.doctorRepository.getAll();

    // Filter by specialization
    const filteredDoctors = allDoctors.filter(
      doctor => doctor.specializationValue.toLowerCase() === query.specialization.toLowerCase()
    );

    // Get corresponding users
    const doctorsWithUsers = [];
    for (const doctor of filteredDoctors) {
      const user = await this.userRepository.getById(doctor.userId);
      if (user) {
        doctorsWithUsers.push({ doctor, user });
      }
    }

    return DoctorMapper.toDtoArray(doctorsWithUsers);
  }
}

/**
 * Query handler for generating legacy display names
 * Used for appointment system compatibility
 */
@injectable()
export class GetDoctorLegacyDisplayNameQueryHandler {
  constructor(
    @inject(TOKENS.DoctorRepository) private doctorRepository: IDoctorRepository,
    @inject(TOKENS.UserRepository) private userRepository: IUserRepository
  ) {}

  async execute(doctorId: string): Promise<string | null> {
    const doctor = await this.doctorRepository.getById(doctorId);
    if (!doctor) {
      return null;
    }

    const user = await this.userRepository.getById(doctor.userId);
    if (!user) {
      return null;
    }

    return DoctorMapper.toLegacyDisplayName(doctor, user);
  }
}
