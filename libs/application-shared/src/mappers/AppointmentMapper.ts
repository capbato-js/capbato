import { Appointment } from '@nx-starter/domain';
import type { AppointmentDto } from '../dto/AppointmentQueries';

/**
 * Mapper for converting between Appointment domain entities and DTOs
 * Static methods for data transformation following existing patterns
 */
export class AppointmentMapper {
  /**
   * Converts a single Appointment entity to DTO
   */
  static toDto(appointment: Appointment): AppointmentDto {
    return {
      id: appointment.stringId!,
      patientId: appointment.patientId,
      reasonForVisit: appointment.reasonForVisit,
      appointmentDate: appointment.appointmentDate.toISOString(),
      appointmentTime: appointment.timeValue,
      status: appointment.statusValue,
      doctorId: appointment.doctorId,
      createdAt: appointment.createdAt.toISOString(),
      updatedAt: appointment.updatedAt?.toISOString(),
    };
  }

  /**
   * Converts an array of Appointment entities to DTOs
   */
  static toDtoArray(appointments: Appointment[]): AppointmentDto[] {
    return appointments.map(appointment => this.toDto(appointment));
  }

  /**
   * Converts a plain object to Appointment entity
   * Used for ORM data mapping
   */
  static fromPlainObject(data: Record<string, any>): Appointment {
    return new Appointment(
      data['patientId'] || data['patient_id'],
      data['reasonForVisit'] || data['reason_for_visit'],
      new Date(data['appointmentDate'] || data['appointment_date']),
      data['appointmentTime'] || data['appointment_time'],
      data['doctorId'] || data['doctor_id'],
      data['status'],
      data['id'],
      new Date(data['createdAt'] || data['created_at'] || Date.now()),
      data['updatedAt'] || data['updated_at'] ? new Date(data['updatedAt'] || data['updated_at']) : undefined
    );
  }

  /**
   * Converts Appointment entity to plain object
   * Used for ORM data persistence
   */
  static toPlainObject(appointment: Appointment): Record<string, any> {
    return {
      id: appointment.stringId,
      patient_id: appointment.patientId,
      reason_for_visit: appointment.reasonForVisit,
      appointment_date: appointment.appointmentDate,
      appointment_time: appointment.timeValue,
      status: appointment.statusValue,
      doctor_id: appointment.doctorId,
      created_at: appointment.createdAt,
      updated_at: appointment.updatedAt,
    };
  }

  /**
   * Converts array of plain objects to Appointment entities
   */
  static fromPlainObjectArray(data: Record<string, any>[]): Appointment[] {
    return data.map(item => this.fromPlainObject(item));
  }

  /**
   * Converts array of Appointment entities to plain objects
   */
  static toPlainObjectArray(appointments: Appointment[]): Record<string, any>[] {
    return appointments.map(appointment => this.toPlainObject(appointment));
  }
}
