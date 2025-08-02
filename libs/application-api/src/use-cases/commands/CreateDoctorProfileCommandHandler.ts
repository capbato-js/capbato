import { injectable, inject } from 'tsyringe';
import { 
  Doctor, 
  IDoctorRepository, 
  IUserRepository
} from '@nx-starter/domain';

/**
 * Command interface for creating doctor profiles
 * This matches the shared interface but is defined locally to avoid circular dependencies
 */
export interface CreateDoctorProfileCommand {
  userId: string;
  specialization: string;
  licenseNumber?: string;
  yearsOfExperience?: number;
}

/**
 * Command Handler for creating doctor profiles
 * Follows CQRS pattern for clear separation of command operations
 */
@injectable()
export class CreateDoctorProfileCommandHandler {
  constructor(
    @inject('IDoctorRepository') private doctorRepository: IDoctorRepository,
    @inject('IUserRepository') private userRepository: IUserRepository
  ) {}

  async execute(command: CreateDoctorProfileCommand): Promise<Doctor> {
    // Validate that user exists
    const user = await this.userRepository.getById(command.userId);
    if (!user) {
      throw new Error(`User with ID ${command.userId} not found`);
    }

    // Check if doctor profile already exists for this user
    const existingDoctor = await this.doctorRepository.getByUserId(command.userId);
    if (existingDoctor) {
      throw new Error(`Doctor profile already exists for user ${command.userId}`);
    }

    // Create doctor domain entity using constructor
    const doctor = new Doctor(
      command.userId,
      command.specialization,
      undefined, // id will be generated
      command.licenseNumber,
      command.yearsOfExperience,
      true // isActive defaults to true
    );

    // Save to repository
    const savedDoctor = await this.doctorRepository.create(doctor);
    
    return savedDoctor;
  }
}
