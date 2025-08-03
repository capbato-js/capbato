import { injectable, inject } from 'tsyringe';
import { IHttpClient } from '../http/IHttpClient';
import { getApiConfig } from './config/ApiConfig';
import { TOKENS } from '@nx-starter/application-shared';

/**
 * Schedule data transfer object matching the backend ScheduleDto
 */
export interface ScheduleDtoApi {
  id: string;
  doctorId: string;
  doctorName?: string;
  date: string; // ISO date string (YYYY-MM-DD)
  time: string; // 24-hour format (HH:MM)
  formattedDate?: string;
  formattedTime?: string;
  createdAt: string;
  updatedAt?: string;
}

/**
 * API service for schedule HTTP communications
 * Implements schedule service interface for web infrastructure
 */
@injectable()
export class ScheduleApiService {
  private readonly apiConfig = getApiConfig();

  constructor(
    @inject(TOKENS.HttpClient) private readonly httpClient: IHttpClient
  ) {}

  /**
   * Gets all schedules with doctor names populated
   */
  async getAllSchedules(activeOnly = true): Promise<ScheduleDtoApi[]> {
    const response = await this.httpClient.get<{ success: boolean; data: ScheduleDtoApi[] }>(
      `/api/schedules?activeOnly=${activeOnly}`
    );

    if (!response.data.success || !response.data.data) {
      throw new Error('Failed to fetch schedules');
    }

    return response.data.data;
  }

  /**
   * Gets schedules by date with doctor names populated
   */
  async getSchedulesByDate(date: string): Promise<ScheduleDtoApi[]> {
    const response = await this.httpClient.get<{ success: boolean; data: ScheduleDtoApi[] }>(
      `/api/schedules/date/${date}`
    );

    if (!response.data.success || !response.data.data) {
      throw new Error('Failed to fetch schedules by date');
    }

    return response.data.data;
  }

  /**
   * Gets schedules by doctor ID with doctor names populated
   */
  async getSchedulesByDoctor(doctorId: string): Promise<ScheduleDtoApi[]> {
    const response = await this.httpClient.get<{ success: boolean; data: ScheduleDtoApi[] }>(
      `/api/schedules/doctor/${doctorId}`
    );

    if (!response.data.success || !response.data.data) {
      throw new Error('Failed to fetch schedules by doctor');
    }

    return response.data.data;
  }

  /**
   * Gets today's doctor information
   */
  async getTodayDoctor(): Promise<{ doctorName: string; scheduleId?: string; time?: string; formattedTime?: string }> {
    const response = await this.httpClient.get<{ 
      success: boolean; 
      data: { doctorName: string; scheduleId?: string; time?: string; formattedTime?: string } 
    }>('/api/schedules/today');

    if (!response.data.success || !response.data.data) {
      throw new Error('Failed to fetch today\'s doctor');
    }

    return response.data.data;
  }

  /**
   * Creates a new schedule entry
   */
  async createSchedule(data: {
    doctorId: string;
    date: string;
    time: string;
  }): Promise<ScheduleDtoApi> {
    const response = await this.httpClient.post<{ success: boolean; data: ScheduleDtoApi }>(
      '/api/schedules',
      data
    );

    if (!response.data.success || !response.data.data) {
      throw new Error('Failed to create schedule');
    }

    return response.data.data;
  }

  /**
   * Updates a schedule entry
   */
  async updateSchedule(id: string, data: {
    doctorId?: string;
    date?: string;
    time?: string;
  }): Promise<void> {
    const response = await this.httpClient.put<{ success: boolean }>(
      `/api/schedules/${id}`,
      data
    );

    if (!response.data.success) {
      throw new Error('Failed to update schedule');
    }
  }

  /**
   * Deletes a schedule entry
   */
  async deleteSchedule(id: string): Promise<void> {
    const response = await this.httpClient.delete<{ success: boolean }>(
      `/api/schedules/${id}`
    );

    if (!response.data.success) {
      throw new Error('Failed to delete schedule');
    }
  }
}
