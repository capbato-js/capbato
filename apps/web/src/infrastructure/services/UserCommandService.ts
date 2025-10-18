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
    // Note: We explicitly convert undefined to appropriate default values
    // because Axios strips undefined values from the request body
    const requestData = {
      firstName: command.firstName,
      lastName: command.lastName,
      email: command.email,
      role: command.role,
      mobile: command.mobile || '', // Convert undefined to empty string
      // Doctor profile fields - send even if empty/zero to ensure they're updated
      specialization: command.specialization || '',
      licenseNumber: command.licenseNumber || '',
      experienceYears: command.experienceYears || undefined, // Keep as undefined if not set
      schedulePattern: command.schedulePattern !== undefined ? command.schedulePattern : '', // Always include, default to empty string
    };

    return await this.userApiService.updateUserDetails(command.id, requestData);
  }
}
