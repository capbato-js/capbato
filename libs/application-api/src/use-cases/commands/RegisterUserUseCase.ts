import { injectable, inject } from 'tsyringe';
import { User, IUserRepository, UserDomainService, IDoctorRepository } from '@nx-starter/domain';
import { generateUUID } from '@nx-starter/utils-core';
import { RegisterUserCommand, TOKENS, CreateDoctorProfileCommandSchema, CreateDoctorProfileCommand } from '@nx-starter/application-shared';
import { NameFormattingService } from '@nx-starter/domain';
import { IPasswordHashingService } from '../../services/PasswordHashingService';
import { CreateDoctorProfileCommandHandler } from './CreateDoctorProfileCommandHandler';

/**
 * Register User Use Case
 * Handles user registration following Clean Architecture principles
 */
@injectable()
export class RegisterUserUseCase {
  constructor(
    @inject(TOKENS.UserRepository)
    private userRepository: IUserRepository,
    @inject(TOKENS.PasswordHashingService)
    private passwordHashingService: IPasswordHashingService,
    @inject(TOKENS.DoctorRepository)
    private doctorRepository: IDoctorRepository,
    private createDoctorProfileCommandHandler: CreateDoctorProfileCommandHandler
  ) {
    // Domain services are instantiated manually, not injected
    this.userDomainService = new UserDomainService(this.userRepository);
  }

  private userDomainService: UserDomainService;

  /**
   * Executes user registration
   * 1. Check email uniqueness
   * 2. Generate unique username from email
   * 3. Generate UUID early (needed for doctor profile validation)
   * 4. If role is 'doctor', validate doctor profile data FIRST
   * 5. Hash the password  
   * 6. Create user entity with domain validation
   * 7. Persist user
   * 8. If role is 'doctor', create doctor profile (already validated)
   * 9. Returns created user
   */
  async execute(command: RegisterUserCommand): Promise<User> {
    // 1. Check email uniqueness (throws domain exception if exists)
    await this.userDomainService.validateEmailUniqueness(command.email);

    // 2. Generate unique username from email
    const username = await this.userDomainService.generateUniqueUsername(command.email);

    // 3. Generate UUID early (needed for doctor profile validation)
    const userId = generateUUID();

    // 4. If role is 'doctor', validate doctor profile data FIRST (before creating user)
    let validatedDoctorCommand: CreateDoctorProfileCommand | null = null;
    if (command.role === 'doctor') {
      // schedulePattern is now optional - doctors can be created without a schedule pattern

      // Prepare doctor profile command with required fields
      const doctorProfileCommand = {
        userId: userId, // Use the generated UUID for validation
        specialization: command.specialization || 'General Medicine',
        licenseNumber: command.licenseNumber || undefined,
        yearsOfExperience: command.experienceYears || undefined,
        schedulePattern: command.schedulePattern || undefined, // Optional - can be undefined or empty
      };

      // Validate doctor profile data using the same validation as the dedicated endpoint
      // This will throw ZodError if validation fails, preventing user creation
      validatedDoctorCommand = CreateDoctorProfileCommandSchema.parse(doctorProfileCommand) as CreateDoctorProfileCommand;
    }

    // 5. Hash the password
    const hashedPassword = await this.passwordHashingService.hash(command.password);

    // 6. Format names using NameFormattingService
    const formattedFirstName = NameFormattingService.formatToProperCase(command.firstName);
    const formattedLastName = NameFormattingService.formatToProperCase(command.lastName);

    // 7. Create user entity with domain validation (using pre-generated UUID)
    const user = User.create(
      userId,
      formattedFirstName,
      formattedLastName,
      command.email,
      username,
      hashedPassword,
      command.role,
      command.mobile
    );

    // 8. Persist user (only after doctor profile validation passed)
    await this.userRepository.create(user);

    // 9. If role is 'doctor', create doctor profile (validation already passed)
    if (command.role === 'doctor' && validatedDoctorCommand) {
      // UUID already set during validation, no need to update
      
      // Create doctor profile with pre-validated data
      await this.createDoctorProfileCommandHandler.execute(validatedDoctorCommand);
    }

    // 10. Return created user
    return user;
  }
}