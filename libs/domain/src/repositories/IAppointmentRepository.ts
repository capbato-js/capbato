import { Appointment } from '../entities/Appointment';

export interface AppointmentSummaryQuery {
  startDate?: string;
  endDate?: string;
  granularity?: 'daily' | 'weekly' | 'monthly';
}

export interface TopVisitReasonDto {
  reason: string;
  count: number;
  percentage: number;
}

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
  getWeeklyAppointmentSummary(query?: AppointmentSummaryQuery): Promise<{ date: string; totalCount: number; completedCount: number; cancelledCount: number }[]>;
  getTopVisitReasons(query?: { startDate?: string; endDate?: string; limit?: number }): Promise<TopVisitReasonDto[]>;
  checkTimeSlotAvailability(date: Date, time: string, excludeId?: string): Promise<boolean>;
  checkPatientDuplicateAppointment(patientId: string, date: Date, excludeId?: string): Promise<boolean>;
  getCurrentPatientAppointment(): Promise<Appointment | undefined>;
}
