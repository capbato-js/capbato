import { injectable, inject } from 'tsyringe';
import { IUserQueryService, UserDto, TOKENS } from '@nx-starter/application-shared';
import { IUserApiService } from '../api/IUserApiService';

/**
 * Web User Query Service Implementation
 * Implements the application service using the web API
 */
@injectable()
export class WebUserQueryService implements IUserQueryService {
  constructor(
    @inject(TOKENS.UserApiService)
    private userApiService: IUserApiService
  ) {}

  async getAllUsers(): Promise<UserDto[]> {
    return await this.userApiService.getAllUsers();
  }
}
