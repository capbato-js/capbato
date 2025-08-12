import { injectable, inject } from 'tsyringe';
import { User, IUserRepository, NameFormattingService, IDoctorRepository, Doctor, DoctorSchedulePattern } from '@nx-starter/domain';
import type { UpdateUserDetailsCommand } from '../../dto/UserCommands';
import { CreateDoctorProfileCommand } from '../../dto/DoctorCommands';
import { CreateDoctorProfileCommandSchema } from '../../validation/DoctorValidationSchemas';
import { TOKENS } from '../../di/tokens';

/**
 * Use case for updating user details
 * Handles all business logic and validation for user profile updates
 * Now includes doctor profile management when role is 'doctor'
 */
@injectable()
export class UpdateUserDetailsUseCase {
  constructor(
    @inject(TOKENS.UserRepository) private userRepository: IUserRepository,
    @inject(TOKENS.DoctorRepository) private doctorRepository: IDoctorRepository
  ) {}

  async execute(command: UpdateUserDetailsCommand): Promise<User> {
    // Get existing user
    const existingUser = await this.userRepository.getById(command.id);
    if (!existingUser) {
      throw new Error(`User with ID ${command.id} not found`);
    }

    // Check if user currently has a doctor profile
    const existingDoctorProfile = await this.doctorRepository.getByUserId(command.id);
    const hadDoctorRole = existingUser.role.value === 'doctor';
    const willHaveDoctorRole = command.role === 'doctor';

    // Prepare the user updates - convert to value object format for the repository
    const updates: Record<string, { value: any } | undefined> = {};

    if (command.firstName !== undefined) {
      updates['firstName'] = { value: NameFormattingService.formatToProperCase(command.firstName) };
    }

    if (command.lastName !== undefined) {
      updates['lastName'] = { value: NameFormattingService.formatToProperCase(command.lastName) };
    }

    if (command.email !== undefined) {
      updates['email'] = { value: command.email };
    }

    if (command.mobile !== undefined) {
      updates['mobile'] = command.mobile ? { value: command.mobile } : undefined;
    }

    if (command.role !== undefined) {
      updates['role'] = { value: command.role };
    }

    // Persist user changes first
    await this.userRepository.update(command.id, updates);

    // Handle doctor profile logic
    if (willHaveDoctorRole) {
      // User role is 'doctor' - need to handle doctor profile
      if (existingDoctorProfile) {
        // Update existing doctor profile
        await this.updateDoctorProfile(existingDoctorProfile, command);
      } else {
        // Create new doctor profile (role changed to doctor or new doctor user)
        await this.createDoctorProfile(command.id, command);
      }
    } else if (hadDoctorRole && !willHaveDoctorRole && existingDoctorProfile) {
      // User role changed from 'doctor' to something else - optionally delete/deactivate doctor profile
      // For now, we'll leave the doctor profile but it won't be active since user role changed
      // In a production system, you might want to soft-delete or archive the doctor profile
      console.warn(`User ${command.id} role changed from 'doctor' to '${command.role}'. Doctor profile preserved but inactive.`);
    }

    // Return updated user
    const updatedUser = await this.userRepository.getById(command.id);
    if (!updatedUser) {
      throw new Error('Failed to retrieve updated user');
    }

    return updatedUser;
  }

  /**
   * Create new doctor profile for user
   */
  private async createDoctorProfile(userId: string, command: UpdateUserDetailsCommand): Promise<void> {
    // Validate required doctor profile fields
    if (!command.specialization) {
      throw new Error('Specialization is required when role is doctor');
    }

    // Prepare doctor profile command
    const doctorProfileCommand: CreateDoctorProfileCommand = {
      userId: userId,
      specialization: command.specialization,
      licenseNumber: command.licenseNumber || undefined,
      yearsOfExperience: command.experienceYears || undefined,
      schedulePattern: command.schedulePattern || 'Mon-Fri: 9:00 AM - 5:00 PM', // Default pattern
    };

    // Validate doctor profile data
    const validatedDoctorCommand = CreateDoctorProfileCommandSchema.parse(doctorProfileCommand);

    // Parse schedule pattern
    let schedulePattern: DoctorSchedulePattern;
    try {
      schedulePattern = DoctorSchedulePattern.fromString(validatedDoctorCommand.schedulePattern);
    } catch {
      throw new Error(`Invalid schedule pattern: ${validatedDoctorCommand.schedulePattern}`);
    }

    // Create doctor entity using constructor (same pattern as CreateDoctorProfileCommandHandler)
    const doctor = new Doctor(
      validatedDoctorCommand.userId,
      validatedDoctorCommand.specialization,
      undefined, // id will be generated
      validatedDoctorCommand.licenseNumber,
      validatedDoctorCommand.yearsOfExperience,
      true, // isActive defaults to true
      schedulePattern
    );

    await this.doctorRepository.create(doctor);
  }

  /**
   * Update existing doctor profile
   */
  private async updateDoctorProfile(existingDoctor: Doctor, command: UpdateUserDetailsCommand): Promise<void> {
    let updatedDoctor = existingDoctor;
    let hasChanges = false;

    // Update specialization if provided and different
    if (command.specialization !== undefined && command.specialization !== existingDoctor.specialization.value) {
      updatedDoctor = updatedDoctor.updateSpecialization(command.specialization);
      hasChanges = true;
    }

    // Update license number if provided and different
    if (command.licenseNumber !== undefined && command.licenseNumber !== existingDoctor.licenseNumber) {
      updatedDoctor = updatedDoctor.updateLicenseNumber(command.licenseNumber);
      hasChanges = true;
    }

    // Update years of experience if provided and different
    if (command.experienceYears !== undefined && command.experienceYears !== existingDoctor.yearsOfExperience) {
      updatedDoctor = updatedDoctor.updateExperience(command.experienceYears);
      hasChanges = true;
    }

    // Update schedule pattern if provided and different
    if (command.schedulePattern !== undefined) {
      const currentPatternString = existingDoctor.schedulePattern?.toString() || '';
      if (command.schedulePattern !== currentPatternString) {
        try {
          updatedDoctor = updatedDoctor.updateSchedulePattern(command.schedulePattern);
          hasChanges = true;
        } catch (error) {
          throw new Error(`Invalid schedule pattern: ${command.schedulePattern}`);
        }
      }
    }

    // Only persist if something actually changed
    if (hasChanges) {
      await this.doctorRepository.update(updatedDoctor);
    }
  }
}