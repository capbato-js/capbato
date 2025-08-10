import { Appointment } from '../entities/Appointment';

export interface IAppointmentRepository {
  getAll(): Promise<Appointment[]>;
  create(appointment: Appointment): Promise<string>;
  update(id: string, changes: Partial<Appointment>): Promise<void>;
  delete(id: string): Promise<void>;
  getById(id: string): Promise<Appointment | undefined>;
  getByPatientId(patientId: string): Promise<Appointment[]>;
  getTodayAppointments(): Promise<Appointment[]>;
  getTodayConfirmedAppointments(): Promise<Appointment[]>;
  getConfirmedAppointments(): Promise<Appointment[]>;
  getAppointmentsByDate(date: Date): Promise<Appointment[]>;
  getAppointmentsByDateRange(startDate: Date, endDate: Date): Promise<Appointment[]>;
  getWeeklyAppointmentSummary(): Promise<{ date: string; count: number }[]>;
  checkTimeSlotAvailability(date: Date, time: string, excludeId?: string): Promise<boolean>;
  checkPatientDuplicateAppointment(patientId: string, date: Date, excludeId?: string): Promise<boolean>;
  getCurrentPatientAppointment(): Promise<Appointment | undefined>;
}
