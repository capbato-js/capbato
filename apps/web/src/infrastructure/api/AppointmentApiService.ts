import { injectable, inject } from 'tsyringe';
import { IHttpClient } from '../http/IHttpClient';
import { getApiConfig } from './config/ApiConfig';
import { AppointmentDto, TOKENS } from '@nx-starter/application-shared';

/**
 * API service for appointment HTTP communications
 * Implements appointment service interface for web infrastructure
 */
@injectable()
export class AppointmentApiService {
  private readonly apiConfig = getApiConfig();

  constructor(
    @inject(TOKENS.HttpClient) private readonly httpClient: IHttpClient
  ) {}

  /**
   * Creates a new appointment via API
   */
  async createAppointment(data: {
    patientId: string;
    reasonForVisit: string;
    appointmentDate: string; // ISO date string
    appointmentTime: string; // HH:MM format
    doctorId: string;
    status?: 'confirmed' | 'cancelled' | 'completed';
  }): Promise<AppointmentDto> {
    const response = await this.httpClient.post<{ success: boolean; data: AppointmentDto }>(
      this.apiConfig.endpoints.appointments.create,
      data
    );

    if (!response.data.success || !response.data.data) {
      throw new Error('Failed to create appointment');
    }

    return response.data.data;
  }

  /**
   * Gets all appointments
   */
  async getAllAppointments(): Promise<AppointmentDto[]> {
    const response = await this.httpClient.get<{ success: boolean; data: AppointmentDto[] }>(
      this.apiConfig.endpoints.appointments.all
    );

    if (!response.data.success || !response.data.data) {
      throw new Error('Failed to fetch appointments');
    }

    return response.data.data;
  }

  /**
   * Gets appointment by ID
   */
  async getAppointmentById(id: string): Promise<AppointmentDto> {
    const response = await this.httpClient.get<{ success: boolean; data: AppointmentDto }>(
      this.apiConfig.endpoints.appointments.byId(id)
    );

    if (!response.data.success || !response.data.data) {
      throw new Error('Failed to fetch appointment');
    }

    return response.data.data;
  }

  /**
   * Updates an appointment
   */
  async updateAppointment(id: string, data: {
    patientId?: string;
    reasonForVisit?: string;
    appointmentDate?: string;
    appointmentTime?: string;
    doctorId?: string;
    status?: 'confirmed' | 'cancelled' | 'completed';
  }): Promise<void> {
    const response = await this.httpClient.put<{ success: boolean }>(
      this.apiConfig.endpoints.appointments.update(id),
      data
    );

    if (!response.data.success) {
      throw new Error('Failed to update appointment');
    }
  }

  /**
   * Deletes an appointment
   */
  async deleteAppointment(id: string): Promise<void> {
    const response = await this.httpClient.delete<{ success: boolean }>(
      this.apiConfig.endpoints.appointments.delete(id)
    );

    if (!response.data.success) {
      throw new Error('Failed to delete appointment');
    }
  }

  /**
   * Confirms an appointment
   */
  async confirmAppointment(id: string): Promise<void> {
    const response = await this.httpClient.put<{ success: boolean }>(
      this.apiConfig.endpoints.appointments.confirm(id),
      {}
    );

    if (!response.data.success) {
      throw new Error('Failed to confirm appointment');
    }
  }

  /**
   * Cancels an appointment
   */
  async cancelAppointment(id: string): Promise<void> {
    const response = await this.httpClient.put<{ success: boolean }>(
      this.apiConfig.endpoints.appointments.cancel(id),
      {}
    );

    if (!response.data.success) {
      throw new Error('Failed to cancel appointment');
    }
  }
}
