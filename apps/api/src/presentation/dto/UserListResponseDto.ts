/**
 * User List Response DTO
 * Used for GET /users endpoint
 */
export interface UserListResponseDto {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string; // Keep for backward compatibility
  role: string;
  email: string;
  mobile?: string | null;
}
