import { Appointment } from '@nx-starter/domain';
import type { AppointmentDto } from '../dto/AppointmentQueries';

/**
 * Mapper for converting between Appointment domain entities and DTOs
 * Static methods for data transformation following existing patterns
 */
export class AppointmentMapper {
  /**
   * Formats a Date object to YYYY-MM-DD string in local timezone
   * Avoids UTC conversion issues that can cause date shifts
   */
  private static formatDateToLocal(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  /**
   * Converts a single Appointment entity to DTO with optional populated patient and doctor data
   */
  static toDto(appointment: Appointment, patientData?: any, doctorData?: any): AppointmentDto {
    const baseDto: AppointmentDto = {
      id: appointment.stringId!,
      patient: undefined,
      doctor: undefined,
      reasonForVisit: appointment.reasonForVisit,
      appointmentDate: this.formatDateToLocal(appointment.appointmentDate), // Return simple YYYY-MM-DD format in local timezone
      appointmentTime: appointment.timeValue,
      appointmentNumber: appointment.appointmentNumber,
      status: appointment.statusValue,
      createdAt: appointment.createdAt.toISOString(),
      updatedAt: appointment.updatedAt?.toISOString(),
    };

    // If populated data is available, include it
    if (patientData && doctorData) {
      baseDto.patient = {
        id: patientData.id,
        patientNumber: patientData.patientNumber,
        firstName: patientData.firstName,
        lastName: patientData.lastName,
        middleName: patientData.middleName,
        fullName: `${patientData.firstName}${patientData.middleName ? ' ' + patientData.middleName : ''} ${patientData.lastName}`.trim(),
      };
      baseDto.doctor = {
        id: doctorData.id,
        firstName: doctorData.firstName,
        lastName: doctorData.lastName,
        fullName: `Dr. ${doctorData.firstName} ${doctorData.lastName}`.trim(),
        specialization: doctorData.specialization,
      };
    }
    
    return baseDto;
  }

  /**
   * Converts an array of Appointment entities to DTOs with populated data from repository
   */
  static toDtoArray(appointments: Appointment[]): AppointmentDto[] {
    return appointments.map(appointment => {
      // Access populated data if available
      const patientData = (appointment as any)._populatedPatient;
      const doctorData = (appointment as any)._populatedDoctor;
      
      return this.toDto(appointment, patientData, doctorData);
    });
  }

  /**
   * Converts a plain object to Appointment entity
   * Used for ORM data mapping with optional populated data
   */
  static fromPlainObject(data: Record<string, any>): Appointment {
    const appointment = Appointment.reconstruct(
      data['id'],
      data['patientId'] || data['patient_id'],
      data['reasonForVisit'] || data['reason_for_visit'],
      new Date(data['appointmentDate'] || data['appointment_date']),
      data['appointmentTime'] || data['appointment_time'],
      data['appointmentNumber'] || data['appointment_number'] || 0,
      data['doctorId'] || data['doctor_id'],
      data['status'],
      new Date(data['createdAt'] || data['created_at'] || Date.now()),
      data['updatedAt'] || data['updated_at'] ? new Date(data['updatedAt'] || data['updated_at']) : undefined
    );

    // Attach populated data if available (for enhanced DTOs)
    if (data['patient']) {
      (appointment as any)._populatedPatient = data['patient'];
    }
    if (data['doctor']) {
      (appointment as any)._populatedDoctor = data['doctor'];
    }

    return appointment;
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
      appointment_number: appointment.appointmentNumber,
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
