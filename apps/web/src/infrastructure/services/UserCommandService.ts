import { injectable, inject } from 'tsyringe';
import { IUserApiService } from '../api/IUserApiService';
import { UserDto, UpdateUserDetailsCommand, TOKENS } from '@nx-starter/application-shared';

/**
 * Web-specific User Command Service
 * Handles user commands by making HTTP calls to the API
 * This follows the clean architecture pattern for the web layer
 */
@injectable()
export class UserCommandService {
  constructor(
    @inject(TOKENS.UserApiService)
    private readonly userApiService: IUserApiService
  ) {}

  async updateUserDetails(command: UpdateUserDetailsCommand): Promise<UserDto> {
    // Transform command to API request format
    const requestData = {
      firstName: command.firstName,
      lastName: command.lastName,
      email: command.email,
      role: command.role,
      mobile: command.mobile,
      // Doctor profile fields
      specialization: command.specialization,
      licenseNumber: command.licenseNumber,
      experienceYears: command.experienceYears,
      schedulePattern: command.schedulePattern,
    };

    return await this.userApiService.updateUserDetails(command.id, requestData);
  }
}
