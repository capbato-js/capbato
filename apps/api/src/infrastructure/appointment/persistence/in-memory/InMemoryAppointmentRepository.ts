import { injectable } from 'tsyringe';
import { Appointment } from '@nx-starter/domain';
import type { IAppointmentRepository } from '@nx-starter/domain';
import { generateId } from '@nx-starter/utils-core';

/**
 * In-memory implementation of IAppointmentRepository
 * Useful for development and testing
 */
@injectable()
export class InMemoryAppointmentRepository implements IAppointmentRepository {
  private appointments: Map<string, Appointment> = new Map();

  async getAll(): Promise<Appointment[]> {
    return Array.from(this.appointments.values()).sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  async create(appointment: Appointment): Promise<string> {
    const id = generateId();
    const appointmentWithId = Appointment.reconstruct(
      id,
      appointment.patientId,
      appointment.reasonForVisit,
      appointment.appointmentDate,
      appointment.appointmentTime,
      appointment.doctorId,
      appointment.statusValue,
      appointment.createdAt
    );

    this.appointments.set(id, appointmentWithId);
    return id;
  }

  async update(id: string, changes: Partial<Appointment>): Promise<void> {
    const existingAppointment = this.appointments.get(id);
    if (!existingAppointment) {
      throw new Error(`Appointment with ID ${id} not found`);
    }

    // Create updated appointment with changes
    const updatedAppointment = Appointment.reconstruct(
      id,
      changes.patientId ?? existingAppointment.patientId,
      changes.reasonForVisit ?? existingAppointment.reasonForVisit,
      changes.appointmentDate ?? existingAppointment.appointmentDate,
      changes.appointmentTime ?? existingAppointment.appointmentTime,
      changes.doctorId ?? existingAppointment.doctorId,
      changes.statusValue ?? existingAppointment.statusValue,
      existingAppointment.createdAt,
      new Date() // updatedAt
    );

    this.appointments.set(id, updatedAppointment);
  }

  async delete(id: string): Promise<void> {
    const deleted = this.appointments.delete(id);
    if (!deleted) {
      throw new Error(`Appointment with ID ${id} not found`);
    }
  }

  async getById(id: string): Promise<Appointment | undefined> {
    return this.appointments.get(id);
  }

  async getByPatientId(patientId: string): Promise<Appointment[]> {
    return Array.from(this.appointments.values())
      .filter(appointment => appointment.patientId === patientId)
      .sort((a, b) => b.appointmentDate.getTime() - a.appointmentDate.getTime());
  }

  async getTodayAppointments(): Promise<Appointment[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    return Array.from(this.appointments.values())
      .filter(appointment => {
        const appointmentDate = new Date(appointment.appointmentDate);
        appointmentDate.setHours(0, 0, 0, 0);
        return appointmentDate.getTime() === today.getTime();
      })
      .sort((a, b) => a.appointmentTime.toMinutes() - b.appointmentTime.toMinutes());
  }

  async getTodayConfirmedAppointments(): Promise<Appointment[]> {
    const todayAppointments = await this.getTodayAppointments();
    return todayAppointments.filter(appointment => appointment.isConfirmed());
  }

  async getConfirmedAppointments(): Promise<Appointment[]> {
    return Array.from(this.appointments.values())
      .filter(appointment => appointment.isConfirmed())
      .sort((a, b) => a.appointmentDate.getTime() - b.appointmentDate.getTime());
  }

  async getAppointmentsByDate(date: Date): Promise<Appointment[]> {
    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);

    return Array.from(this.appointments.values())
      .filter(appointment => {
        const appointmentDate = new Date(appointment.appointmentDate);
        appointmentDate.setHours(0, 0, 0, 0);
        return appointmentDate.getTime() === targetDate.getTime();
      })
      .sort((a, b) => a.appointmentTime.toMinutes() - b.appointmentTime.toMinutes());
  }

  async getAppointmentsByDateRange(startDate: Date, endDate: Date): Promise<Appointment[]> {
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    return Array.from(this.appointments.values())
      .filter(appointment => {
        const appointmentTime = appointment.appointmentDate.getTime();
        return appointmentTime >= start.getTime() && appointmentTime <= end.getTime();
      })
      .sort((a, b) => a.appointmentDate.getTime() - b.appointmentDate.getTime());
  }

  async getWeeklyAppointmentSummary(): Promise<{ date: string; count: number }[]> {
    const today = new Date();
    const sixDaysAgo = new Date(today);
    sixDaysAgo.setDate(today.getDate() - 6);
    sixDaysAgo.setHours(0, 0, 0, 0);

    const confirmedAppointments = await this.getConfirmedAppointments();
    const weeklyAppointments = confirmedAppointments.filter(appointment => 
      appointment.appointmentDate.getTime() >= sixDaysAgo.getTime()
    );

    // Group by date
    const dateGroups = new Map<string, number>();
    weeklyAppointments.forEach(appointment => {
      const dateString = appointment.appointmentDate.toISOString().split('T')[0];
      dateGroups.set(dateString, (dateGroups.get(dateString) || 0) + 1);
    });

    // Convert to array and sort by date
    return Array.from(dateGroups.entries())
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }

  async checkTimeSlotAvailability(date: Date, time: string, excludeId?: string): Promise<boolean> {
    const appointmentsOnDate = await this.getAppointmentsByDate(date);
    const conflictingAppointments = appointmentsOnDate.filter(appointment => {
      if (excludeId && appointment.stringId === excludeId) {
        return false; // Exclude the appointment being updated
      }
      return appointment.timeValue === time && appointment.isConfirmed();
    });

    // Allow up to 4 confirmed appointments per time slot (based on legacy logic)
    return conflictingAppointments.length < 4;
  }

  async checkPatientDuplicateAppointment(patientId: string, date: Date, excludeId?: string): Promise<boolean> {
    // Note: Patients are now allowed to have multiple appointments per day
    // This method always returns false (no duplicate) to support the new business requirement
    // Time slot conflicts are still prevented by checkTimeSlotAvailability method
    return false;
  }

  async getCurrentPatientAppointment(): Promise<Appointment | undefined> {
    const allAppointments = Array.from(this.appointments.values())
      .sort((a, b) => {
        // Sort by date first, then by time
        const dateComparison = a.appointmentDate.getTime() - b.appointmentDate.getTime();
        if (dateComparison !== 0) return dateComparison;
        return a.appointmentTime.toMinutes() - b.appointmentTime.toMinutes();
      });

    // Find first active appointment (exclude completed and cancelled appointments)
    return allAppointments.find(appointment => 
      !appointment.isCompleted() && !appointment.isCancelled()
    );
  }
}
