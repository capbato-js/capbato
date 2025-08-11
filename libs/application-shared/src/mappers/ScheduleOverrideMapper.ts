import { DoctorScheduleOverride, OverrideDate, DoctorId, OverrideReason } from '@nx-starter/domain';
import { ScheduleOverrideDto } from '../dto/ScheduleOverrideCommands';

/**
 * Interface for plain object representation of DoctorScheduleOverride
 */
interface ScheduleOverridePlainObject {
  id: string;
  date: string;
  originalDoctorId: string | null;
  assignedDoctorId: string;
  reason: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Mapper for transforming DoctorScheduleOverride entities to DTOs and vice versa
 * Follows the existing pattern from TodoMapper
 */
export class ScheduleOverrideMapper {
  /**
   * Converts a DoctorScheduleOverride entity to a DTO
   */
  static toDto(override: DoctorScheduleOverride): ScheduleOverrideDto {
    return {
      id: override.id,
      date: override.date.value,
      originalDoctorId: override.originalDoctorId?.value || null,
      assignedDoctorId: override.assignedDoctorId.value,
      reason: override.reason.value,
      createdAt: override.createdAt.toISOString(),
      updatedAt: override.updatedAt.toISOString(),
    };
  }

  /**
   * Converts an array of DoctorScheduleOverride entities to DTOs
   */
  static toDtoArray(overrides: DoctorScheduleOverride[]): ScheduleOverrideDto[] {
    return overrides.map(override => this.toDto(override));
  }

  /**
   * Converts a plain object to DoctorScheduleOverride entity
   * Used for database deserialization
   */
  static fromPlainObject(data: ScheduleOverridePlainObject): DoctorScheduleOverride {
    return new DoctorScheduleOverride(
      data.id, // Use existing ID from database
      new OverrideDate(data.date),
      new DoctorId(data.assignedDoctorId),
      new OverrideReason(data.reason),
      data.originalDoctorId ? new DoctorId(data.originalDoctorId) : null,
      data.createdAt,
      data.updatedAt
    );
  }

  /**
   * Converts DoctorScheduleOverride entity to plain object
   * Used for database serialization
   */
  static toPlainObject(override: DoctorScheduleOverride): ScheduleOverridePlainObject {
    return {
      id: override.id,
      date: override.date.value,
      originalDoctorId: override.originalDoctorId?.value || null,
      assignedDoctorId: override.assignedDoctorId.value,
      reason: override.reason.value,
      createdAt: override.createdAt,
      updatedAt: override.updatedAt,
    };
  }
}
