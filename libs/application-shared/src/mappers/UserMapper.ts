import { User, NameFormattingService } from '@nx-starter/domain';
import { UserDto, RegisterUserResponseDto, LoginUserResponseDto } from '../dto/UserDto';

/**
 * User Mapper
 * Maps between User domain entities and DTOs
 */
export class UserMapper {
  
  /**
   * Maps User entity to UserDto
   */
  static toDto(user: User): UserDto {
    return {
      id: user.id,
      firstName: user.firstName.value,
      lastName: user.lastName.value,
      email: user.email.value,
      username: user.username.value,
      role: user.role.value,
      mobile: user.mobile?.value,
      createdAt: user.createdAt,
    };
  }

  /**
   * Maps User entity to RegisterUserResponseDto
   */
  static toRegisterResponseDto(user: User): RegisterUserResponseDto {
    return {
      id: user.id,
      firstName: user.firstName.value,
      lastName: user.lastName.value,
      email: user.email.value,
      username: user.username.value,
      role: user.role.value,
      mobile: user.mobile?.value,
      createdAt: user.createdAt,
    };
  }

  /**
   * Maps User entity and token to LoginUserResponseDto
   */
  static toLoginResponseDto(token: string, user: User): LoginUserResponseDto {
    return {
      token,
      user: {
        id: user.id,
        firstName: user.firstName.value,
        lastName: user.lastName.value,
        email: user.email.value,
        username: user.username.value,
        role: user.role.value,
        mobile: user.mobile?.value,
      },
    };
  }

  /**
   * Maps User entity to update response DTO (same as regular DTO)
   */
  static toUpdateResponseDto(user: User): UserDto {
    return this.toDto(user);
  }

  /**
   * Maps array of User entities to array of UserDtos
   */
  static toDtoArray(users: User[]): UserDto[] {
    return users.map(user => this.toDto(user));
  }

  /**
   * Maps plain object to User entity (for repository layer)
   */
  static fromPlainObject(plainObject: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    username: string;
    hashedPassword: string;
    role: string;
    mobile?: string;
    createdAt: Date;
  }): User {
    return User.create(
      plainObject.id,
      NameFormattingService.formatToProperCase(plainObject.firstName),
      NameFormattingService.formatToProperCase(plainObject.lastName),
      plainObject.email,
      plainObject.username,
      plainObject.hashedPassword,
      plainObject.role,
      plainObject.mobile
    );
  }
}