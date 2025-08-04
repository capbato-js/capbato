/**
 * User Data Transfer Objects
 * For transferring user data between application layers
 */

export interface UserDto {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  role: string;
  mobile?: string;
  createdAt: Date;
}

export interface RegisterUserResponseDto {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  role: string;
  mobile?: string;
  createdAt: Date;
}

export interface LoginUserResponseDto {
  token: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    username: string;
    role: string;
    mobile?: string;
  };
}

export type UserResponse = {
  success: boolean;
  data: UserDto;
};

export type UserOperationResponse = {
  success: boolean;
  data: { message: string };
};