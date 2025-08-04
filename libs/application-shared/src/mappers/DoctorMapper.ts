import { Doctor } from '@nx-starter/domain';
import { DoctorDto, DoctorSummaryDto } from '../dto/DoctorQueries';

// Define a User interface for the mapper (to avoid importing the full User entity)
interface UserForMapping {
  id: string;
  firstName: { value: string };
  lastName: { value: string };
  email: { value: string };
  username: { value: string };
  mobile?: { value: string };
  role: { value: string };
}

/**
 * Doctor Mapper
 * Handles transformations between Doctor domain entities and DTOs
 * 
 * Note: This mapper combines User + Doctor profile information to create complete DTOs
 */
export class DoctorMapper {
  /**
   * Convert Doctor domain entity + User to complete DTO for API responses
   */
  static toDto(doctor: Doctor, user: UserForMapping): DoctorDto {
    return {
      // Doctor Profile Fields
      id: doctor.stringId || '',
      userId: doctor.userId,
      specialization: doctor.specializationValue,
      // Contact info comes from User entity
      contactNumber: user.mobile?.value || '',
      formattedContactNumber: user.mobile?.value || '',
      licenseNumber: doctor.licenseNumber,
      yearsOfExperience: doctor.yearsOfExperience,
      isActive: doctor.isActive,
      
      // User Information
      firstName: user.firstName.value,
      lastName: user.lastName.value,
      fullName: `Dr. ${user.firstName.value} ${user.lastName.value}`,
      email: user.email.value,
      username: user.username.value,
      personalContactNumber: user.mobile?.value,
      role: user.role.value,
    };
  }

  /**
   * Convert Doctor domain entity + User to summary DTO (lightweight for listings)
   */
  static toSummaryDto(doctor: Doctor, user: UserForMapping): DoctorSummaryDto {
    return {
      id: doctor.stringId || '',
      userId: doctor.userId,
      fullName: `Dr. ${user.firstName.value} ${user.lastName.value}`,
      specialization: doctor.specializationValue,
      formattedContactNumber: user.mobile?.value || '',
      yearsOfExperience: doctor.yearsOfExperience,
      isActive: doctor.isActive,
    };
  }

  /**
   * Convert array of (Doctor, User) pairs to array of DTOs
   */
  static toDtoArray(doctorsWithUsers: Array<{ doctor: Doctor; user: UserForMapping }>): DoctorDto[] {
    return doctorsWithUsers.map(({ doctor, user }) => this.toDto(doctor, user));
  }

  /**
   * Convert array of (Doctor, User) pairs to array of summary DTOs
   */
  static toSummaryDtoArray(doctorsWithUsers: Array<{ doctor: Doctor; user: UserForMapping }>): DoctorSummaryDto[] {
    return doctorsWithUsers.map(({ doctor, user }) => this.toSummaryDto(doctor, user));
  }

  /**
   * Convert plain object from database/ORM to Doctor domain entity
   * This handles only the Doctor profile data - User data is handled separately
   */
  static fromPlainObject(data: {
    id?: string;
    doctorId?: string;
    DoctorID?: string;
    userId?: string;
    user_id?: string;
    specialization?: string;
    Specialization?: string;
    licenseNumber?: string;
    license_number?: string;
    yearsOfExperience?: number;
    years_of_experience?: number;
    isActive?: boolean;
    is_active?: boolean;
  }): Doctor {
    // Handle different field naming conventions (camelCase, snake_case, PascalCase)
    const id = data.id || data.doctorId || data.DoctorID;
    const userId = data.userId || data.user_id;
    const specialization = data.specialization || data.Specialization;
    const licenseNumber = data.licenseNumber || data.license_number;
    const yearsOfExperience = data.yearsOfExperience || data.years_of_experience;
    const isActive = data.isActive !== undefined ? data.isActive : 
                     data.is_active !== undefined ? data.is_active : true;

    if (!userId || !specialization) {
      throw new Error('Invalid doctor profile data: missing required fields (userId, specialization)');
    }

    return new Doctor(
      userId,
      specialization,
      id,
      licenseNumber,
      yearsOfExperience,
      isActive
    );
  }

  /**
   * Convert Doctor domain entity to plain object for database/ORM persistence
   */
  static toPlainObject(doctor: Doctor): {
    id?: string;
    userId: string;
    specialization: string;
    licenseNumber?: string;
    yearsOfExperience?: number;
    isActive: boolean;
  } {
    return {
      id: doctor.stringId,
      userId: doctor.userId,
      specialization: doctor.specializationValue,
      licenseNumber: doctor.licenseNumber,
      yearsOfExperience: doctor.yearsOfExperience,
      isActive: doctor.isActive,
    };
  }

  /**
   * Legacy compatibility method - creates display name like "Doe, John (Cardiology)"
   * This matches the format used in the appointments table: doctor_name column
   */
  static toLegacyDisplayName(doctor: Doctor, user: UserForMapping): string {
    return `${user.lastName.value}, ${user.firstName.value} (${doctor.specializationValue})`;
  }
}
