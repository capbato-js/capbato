import { injectable, inject } from 'tsyringe';
import { Controller, Get, Put, Param, Body, HttpCode, CurrentUser } from 'routing-controllers';
import { TOKENS, ChangeUserPasswordCommand, UserMapper, UserIdSchema, DeactivateUserCommand } from '@nx-starter/application-shared';
import { GetAllUsersQueryHandler } from '@nx-starter/application-api';
import { ChangeUserPasswordUseCase } from '@nx-starter/application-api';
import { UpdateUserDetailsUseCase, DeactivateUserUseCase } from '@nx-starter/application-shared';
import { ApiResponseBuilder } from '../dto/ApiResponse';
import { UserListResponseDto } from '../dto/UserListResponseDto';
import { ChangePasswordRequestDto } from '../dto/ChangePasswordRequestDto';
import { UpdateUserDetailsRequestDto } from '@nx-starter/application-shared';
import { UserValidationService } from '@nx-starter/application-shared';

interface CurrentUserPayload {
  id: string;
  role: string;
  email: string;
}

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
    private changeUserPasswordUseCase: ChangeUserPasswordUseCase,
    @inject(TOKENS.UpdateUserDetailsUseCase)
    private updateUserDetailsUseCase: UpdateUserDetailsUseCase,
    @inject(TOKENS.DeactivateUserUseCase)
    private deactivateUserUseCase: DeactivateUserUseCase,
    @inject(TOKENS.UserValidationService)
    private validationService: UserValidationService
  ) {}

  /**
   * GET /api/users - Get all users
   */
  @Get('/')
  async getAllUsers(): Promise<{ success: boolean; data: UserListResponseDto[] }> {
    const users = await this.getAllUsersQueryHandler.execute();
    // Map to response DTOs (id, firstName, lastName, fullName, role, email, mobile)
    const userList: UserListResponseDto[] = users.map(user => ({
      id: user.id,
      firstName: user.firstName.value,
      lastName: user.lastName.value,
      fullName: user.fullName, // Keep for backward compatibility
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

  /**
   * PUT /api/users/:id - Update user details
   */
  @Put('/:id')
  @HttpCode(200)
  async updateUserDetails(
    @Param('id') id: string,
    @Body() body: UpdateUserDetailsRequestDto
  ) {
    // Validate the ID parameter
    const validatedId = UserIdSchema.parse(id);

    // Validate the combined data (body + id) using the validation service
    const validatedData = this.validationService.validateUpdateDetailsCommand({
      ...body,
      id: validatedId,
    });

    const user = await this.updateUserDetailsUseCase.execute(validatedData);
    const userDto = UserMapper.toUpdateResponseDto(user);

    return ApiResponseBuilder.success(userDto);
  }

  /**
   * PUT /api/users/:id/deactivate - Deactivate user account
   */
  @Put('/:id/deactivate')
  @HttpCode(200)
  async deactivateUser(
    @Param('id') id: string,
    @CurrentUser() currentUser: CurrentUserPayload
  ) {
    // Validate the ID parameter
    const validatedId = UserIdSchema.parse(id);

    const command: DeactivateUserCommand = {
      userId: validatedId,
      requestingUserId: currentUser.id
    };
    await this.deactivateUserUseCase.execute(command);

    return ApiResponseBuilder.success({ message: 'User account deactivated successfully.' });
  }
}
