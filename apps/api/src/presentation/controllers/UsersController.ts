import { injectable, inject } from 'tsyringe';
import { Controller, Get, Put, Param, Body, HttpCode } from 'routing-controllers';
import { TOKENS, ChangeUserPasswordCommand } from '@nx-starter/application-shared';
import { GetAllUsersQueryHandler } from '@nx-starter/application-api';
import { ChangeUserPasswordUseCase } from '@nx-starter/application-api';
import { ApiResponseBuilder } from '../dto/ApiResponse';
import { UserListResponseDto } from '../dto/UserListResponseDto';
import { ChangePasswordRequestDto } from '../dto/ChangePasswordRequestDto';

/**
 * Users Controller
 * Handles user management endpoints (excluding registration)
 */
@Controller('/users')
@injectable()
export class UsersController {
  constructor(
    @inject(TOKENS.GetAllUsersQueryHandler)
    private getAllUsersQueryHandler: GetAllUsersQueryHandler,
    @inject(TOKENS.ChangeUserPasswordUseCase)
    private changeUserPasswordUseCase: ChangeUserPasswordUseCase
  ) {}

  /**
   * GET /api/users - Get all users
   */
  @Get('/')
  async getAllUsers(): Promise<{ success: boolean; data: UserListResponseDto[] }> {
    const users = await this.getAllUsersQueryHandler.execute();
    // Map to response DTOs (id, fullName, role, email, mobile)
    const userList: UserListResponseDto[] = users.map(user => ({
      id: user.id,
      fullName: user.fullName,
      role: user.role.value,
      email: user.email.value,
      mobile: user.mobile?.value || null,
    }));
    return ApiResponseBuilder.success(userList);
  }

  /**
   * PUT /api/users/:id/password - Change user password
   */
  @Put('/:id/password')
  @HttpCode(200)
  async changePassword(
    @Param('id') id: string,
    @Body() body: ChangePasswordRequestDto
  ) {
    const command: ChangeUserPasswordCommand = { userId: id, newPassword: body.newPassword };
    await this.changeUserPasswordUseCase.execute(command);
    return ApiResponseBuilder.success({ message: 'Password updated.' });
  }
}
