/**
 * Change Password Request DTO
 * Used for PUT /users/:id/password endpoint
 */
export interface ChangePasswordRequestDto {
  newPassword: string;
}
