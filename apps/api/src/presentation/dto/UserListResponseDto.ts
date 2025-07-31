/**
 * User List Response DTO
 * Used for GET /users endpoint
 */
export interface UserListResponseDto {
  id: string;
  fullName: string;
  role: string;
  mobile?: string | null;
}
