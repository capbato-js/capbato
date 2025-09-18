import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ScheduleApiService, ScheduleDtoApi } from './ScheduleApiService';
import { IHttpClient, HttpResponse } from '../http/IHttpClient';

describe('ScheduleApiService', () => {
  let service: ScheduleApiService;
  let mockHttpClient: IHttpClient;

  // Helper to create proper HttpResponse objects
  const createMockResponse = <T>(data: T): HttpResponse<T> => ({
    data,
    status: 200,
    statusText: 'OK',
    headers: {}
  });

  const mockScheduleDto: ScheduleDtoApi = {
    id: '1',
    doctorId: 'doc1',
    doctorName: 'Dr. Smith',
    date: '2023-12-25',
    time: '09:00',
    formattedDate: 'December 25, 2023',
    formattedTime: '9:00 AM',
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z'
  };

  const mockScheduleDto2: ScheduleDtoApi = {
    id: '2',
    doctorId: 'doc2',
    doctorName: 'Dr. Johnson',
    date: '2023-12-26',
    time: '14:00',
    formattedDate: 'December 26, 2023',
    formattedTime: '2:00 PM',
    createdAt: '2023-01-02T00:00:00Z',
    updatedAt: '2023-01-02T00:00:00Z'
  };

  beforeEach(() => {
    mockHttpClient = {
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      delete: vi.fn(),
      patch: vi.fn()
    };

    service = new ScheduleApiService(mockHttpClient);
  });

  describe('getAllSchedules', () => {
    it('should get all schedules with activeOnly=true by default', async () => {
      const mockResponse = createMockResponse({
        success: true,
        data: [mockScheduleDto, mockScheduleDto2]
      });

      vi.mocked(mockHttpClient.get).mockResolvedValue(mockResponse);

      const result = await service.getAllSchedules();

      expect(mockHttpClient.get).toHaveBeenCalledWith('/api/schedules?activeOnly=true');
      expect(result).toEqual([mockScheduleDto, mockScheduleDto2]);
      expect(result).toHaveLength(2);
      expect(result[0].doctorName).toBe('Dr. Smith');
      expect(result[1].doctorName).toBe('Dr. Johnson');
    });

    it('should get all schedules with activeOnly=false when specified', async () => {
      const mockResponse = createMockResponse({
        success: true,
        data: [mockScheduleDto]
      });

      vi.mocked(mockHttpClient.get).mockResolvedValue(mockResponse);

      const result = await service.getAllSchedules(false);

      expect(mockHttpClient.get).toHaveBeenCalledWith('/api/schedules?activeOnly=false');
      expect(result).toEqual([mockScheduleDto]);
    });

    it('should handle empty schedules response', async () => {
      const mockResponse = createMockResponse({
        success: true,
        data: []
      });

      vi.mocked(mockHttpClient.get).mockResolvedValue(mockResponse);

      const result = await service.getAllSchedules();

      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });

    it('should throw error when response is not successful', async () => {
      const mockResponse = createMockResponse({
        success: false,
        data: null
      });

      vi.mocked(mockHttpClient.get).mockResolvedValue(mockResponse);

      await expect(service.getAllSchedules()).rejects.toThrow('Failed to fetch schedules');
    });

    it('should throw error when data is null', async () => {
      const mockResponse = createMockResponse({
        success: true,
        data: null
      });

      vi.mocked(mockHttpClient.get).mockResolvedValue(mockResponse);

      await expect(service.getAllSchedules()).rejects.toThrow('Failed to fetch schedules');
    });

    it('should handle HTTP client errors', async () => {
      const error = new Error('Network error');
      vi.mocked(mockHttpClient.get).mockRejectedValue(error);

      await expect(service.getAllSchedules()).rejects.toThrow('Network error');
    });
  });

  describe('getSchedulesByDate', () => {
    it('should get schedules by specific date', async () => {
      const mockResponse = createMockResponse({
        success: true,
        data: [mockScheduleDto]
      });

      vi.mocked(mockHttpClient.get).mockResolvedValue(mockResponse);

      const result = await service.getSchedulesByDate('2023-12-25');

      expect(mockHttpClient.get).toHaveBeenCalledWith('/api/schedules/date/2023-12-25');
      expect(result).toEqual([mockScheduleDto]);
      expect(result[0].date).toBe('2023-12-25');
    });

    it('should handle empty date response', async () => {
      const mockResponse = createMockResponse({
        success: true,
        data: []
      });

      vi.mocked(mockHttpClient.get).mockResolvedValue(mockResponse);

      const result = await service.getSchedulesByDate('2023-12-31');

      expect(result).toEqual([]);
    });

    it('should throw error when response is not successful', async () => {
      const mockResponse = createMockResponse({
        success: false,
        data: null
      });

      vi.mocked(mockHttpClient.get).mockResolvedValue(mockResponse);

      await expect(service.getSchedulesByDate('2023-12-25')).rejects.toThrow('Failed to fetch schedules by date');
    });

    it('should handle various date formats', async () => {
      const mockResponse = createMockResponse({
        success: true,
        data: [mockScheduleDto]
      });

      vi.mocked(mockHttpClient.get).mockResolvedValue(mockResponse);

      await service.getSchedulesByDate('2023-01-01');
      expect(mockHttpClient.get).toHaveBeenCalledWith('/api/schedules/date/2023-01-01');

      await service.getSchedulesByDate('2023-12-31');
      expect(mockHttpClient.get).toHaveBeenCalledWith('/api/schedules/date/2023-12-31');
    });
  });

  describe('getSchedulesByDoctor', () => {
    it('should get schedules by doctor ID', async () => {
      const mockResponse = createMockResponse({
        success: true,
        data: [mockScheduleDto]
      });

      vi.mocked(mockHttpClient.get).mockResolvedValue(mockResponse);

      const result = await service.getSchedulesByDoctor('doc1');

      expect(mockHttpClient.get).toHaveBeenCalledWith('/api/schedules/doctor/doc1');
      expect(result).toEqual([mockScheduleDto]);
      expect(result[0].doctorId).toBe('doc1');
    });

    it('should handle doctor with no schedules', async () => {
      const mockResponse = createMockResponse({
        success: true,
        data: []
      });

      vi.mocked(mockHttpClient.get).mockResolvedValue(mockResponse);

      const result = await service.getSchedulesByDoctor('doc999');

      expect(result).toEqual([]);
    });

    it('should throw error when response is not successful', async () => {
      const mockResponse = createMockResponse({
        success: false,
        data: null
      });

      vi.mocked(mockHttpClient.get).mockResolvedValue(mockResponse);

      await expect(service.getSchedulesByDoctor('doc1')).rejects.toThrow('Failed to fetch schedules by doctor');
    });

    it('should handle multiple schedules for same doctor', async () => {
      const doctorSchedules = [
        { ...mockScheduleDto, id: '1', time: '09:00' },
        { ...mockScheduleDto, id: '2', time: '14:00' },
        { ...mockScheduleDto, id: '3', time: '16:00' }
      ];

      const mockResponse = createMockResponse({
        success: true,
        data: doctorSchedules
      });

      vi.mocked(mockHttpClient.get).mockResolvedValue(mockResponse);

      const result = await service.getSchedulesByDoctor('doc1');

      expect(result).toHaveLength(3);
      expect(result.every(schedule => schedule.doctorId === 'doc1')).toBe(true);
    });
  });

  describe('getTodayDoctor', () => {
    it('should get today\'s doctor information', async () => {
      const mockTodayDoctor = {
        doctorName: 'Dr. Today',
        scheduleId: 'schedule1',
        time: '10:00',
        formattedTime: '10:00 AM'
      };

      const mockResponse = createMockResponse({
        success: true,
        data: mockTodayDoctor
      });

      vi.mocked(mockHttpClient.get).mockResolvedValue(mockResponse);

      const result = await service.getTodayDoctor();

      expect(mockHttpClient.get).toHaveBeenCalledWith('/api/schedules/today');
      expect(result).toEqual(mockTodayDoctor);
      expect(result.doctorName).toBe('Dr. Today');
      expect(result.scheduleId).toBe('schedule1');
    });

    it('should handle today\'s doctor with minimal information', async () => {
      const mockTodayDoctor = {
        doctorName: 'Dr. Minimal'
      };

      const mockResponse = createMockResponse({
        success: true,
        data: mockTodayDoctor
      });

      vi.mocked(mockHttpClient.get).mockResolvedValue(mockResponse);

      const result = await service.getTodayDoctor();

      expect(result.doctorName).toBe('Dr. Minimal');
      expect(result.scheduleId).toBeUndefined();
      expect(result.time).toBeUndefined();
    });

    it('should throw error when response is not successful', async () => {
      const mockResponse = createMockResponse({
        success: false,
        data: null
      });

      vi.mocked(mockHttpClient.get).mockResolvedValue(mockResponse);

      await expect(service.getTodayDoctor()).rejects.toThrow('Failed to fetch today\'s doctor');
    });

    it('should throw error when data is null', async () => {
      const mockResponse = createMockResponse({
        success: true,
        data: null
      });

      vi.mocked(mockHttpClient.get).mockResolvedValue(mockResponse);

      await expect(service.getTodayDoctor()).rejects.toThrow('Failed to fetch today\'s doctor');
    });
  });

  describe('createSchedule', () => {
    it('should create a new schedule', async () => {
      const createData = {
        doctorId: 'doc1',
        date: '2023-12-25',
        time: '09:00'
      };

      const mockResponse = createMockResponse({
        success: true,
        data: mockScheduleDto
      });

      vi.mocked(mockHttpClient.post).mockResolvedValue(mockResponse);

      const result = await service.createSchedule(createData);

      expect(mockHttpClient.post).toHaveBeenCalledWith('/api/schedules', createData);
      expect(result).toEqual(mockScheduleDto);
      expect(result.doctorId).toBe('doc1');
      expect(result.date).toBe('2023-12-25');
      expect(result.time).toBe('09:00');
    });

    it('should handle schedule creation with various times', async () => {
      const timeSlots = ['08:00', '12:30', '16:45', '20:00'];

      for (const time of timeSlots) {
        const createData = {
          doctorId: 'doc1',
          date: '2023-12-25',
          time
        };

        const responseData = { ...mockScheduleDto, time };
        const mockResponse = createMockResponse({
          success: true,
          data: responseData
        });

        vi.mocked(mockHttpClient.post).mockResolvedValue(mockResponse);

        const result = await service.createSchedule(createData);

        expect(result.time).toBe(time);
      }
    });

    it('should throw error when creation fails', async () => {
      const createData = {
        doctorId: 'doc1',
        date: '2023-12-25',
        time: '09:00'
      };

      const mockResponse = createMockResponse({
        success: false,
        data: null
      });

      vi.mocked(mockHttpClient.post).mockResolvedValue(mockResponse);

      await expect(service.createSchedule(createData)).rejects.toThrow('Failed to create schedule');
    });

    it('should handle HTTP client errors during creation', async () => {
      const createData = {
        doctorId: 'doc1',
        date: '2023-12-25',
        time: '09:00'
      };

      const error = new Error('Network error');
      vi.mocked(mockHttpClient.post).mockRejectedValue(error);

      await expect(service.createSchedule(createData)).rejects.toThrow('Network error');
    });
  });

  describe('updateSchedule', () => {
    it('should update a schedule with all fields', async () => {
      const updateData = {
        doctorId: 'doc2',
        date: '2023-12-26',
        time: '14:00'
      };

      const mockResponse = createMockResponse({
        success: true
      });

      vi.mocked(mockHttpClient.put).mockResolvedValue(mockResponse);

      await service.updateSchedule('1', updateData);

      expect(mockHttpClient.put).toHaveBeenCalledWith('/api/schedules/1', updateData);
    });

    it('should update a schedule with partial fields', async () => {
      const updateData = {
        time: '15:00'
      };

      const mockResponse = createMockResponse({
        success: true
      });

      vi.mocked(mockHttpClient.put).mockResolvedValue(mockResponse);

      await service.updateSchedule('1', updateData);

      expect(mockHttpClient.put).toHaveBeenCalledWith('/api/schedules/1', updateData);
    });

    it('should update schedule with only doctor ID', async () => {
      const updateData = {
        doctorId: 'new-doc'
      };

      const mockResponse = createMockResponse({
        success: true
      });

      vi.mocked(mockHttpClient.put).mockResolvedValue(mockResponse);

      await service.updateSchedule('1', updateData);

      expect(mockHttpClient.put).toHaveBeenCalledWith('/api/schedules/1', updateData);
    });

    it('should update schedule with only date', async () => {
      const updateData = {
        date: '2023-12-30'
      };

      const mockResponse = createMockResponse({
        success: true
      });

      vi.mocked(mockHttpClient.put).mockResolvedValue(mockResponse);

      await service.updateSchedule('1', updateData);

      expect(mockHttpClient.put).toHaveBeenCalledWith('/api/schedules/1', updateData);
    });

    it('should throw error when update fails', async () => {
      const updateData = {
        time: '15:00'
      };

      const mockResponse = createMockResponse({
        success: false
      });

      vi.mocked(mockHttpClient.put).mockResolvedValue(mockResponse);

      await expect(service.updateSchedule('1', updateData)).rejects.toThrow('Failed to update schedule');
    });

    it('should handle HTTP client errors during update', async () => {
      const updateData = {
        time: '15:00'
      };

      const error = new Error('Update failed');
      vi.mocked(mockHttpClient.put).mockRejectedValue(error);

      await expect(service.updateSchedule('1', updateData)).rejects.toThrow('Update failed');
    });
  });

  describe('deleteSchedule', () => {
    it('should delete a schedule', async () => {
      const mockResponse = createMockResponse({
        success: true
      });

      vi.mocked(mockHttpClient.delete).mockResolvedValue(mockResponse);

      await service.deleteSchedule('1');

      expect(mockHttpClient.delete).toHaveBeenCalledWith('/api/schedules/1');
    });

    it('should delete schedule with different IDs', async () => {
      const scheduleIds = ['1', '999', 'abc123', 'schedule-uuid'];

      for (const id of scheduleIds) {
        const mockResponse = createMockResponse({
          success: true
        });

        vi.mocked(mockHttpClient.delete).mockResolvedValue(mockResponse);

        await service.deleteSchedule(id);

        expect(mockHttpClient.delete).toHaveBeenCalledWith(`/api/schedules/${id}`);
      }
    });

    it('should throw error when deletion fails', async () => {
      const mockResponse = createMockResponse({
        success: false
      });

      vi.mocked(mockHttpClient.delete).mockResolvedValue(mockResponse);

      await expect(service.deleteSchedule('1')).rejects.toThrow('Failed to delete schedule');
    });

    it('should handle HTTP client errors during deletion', async () => {
      const error = new Error('Deletion failed');
      vi.mocked(mockHttpClient.delete).mockRejectedValue(error);

      await expect(service.deleteSchedule('1')).rejects.toThrow('Deletion failed');
    });

    it('should handle non-existent schedule deletion gracefully', async () => {
      const error = new Error('Schedule not found');
      vi.mocked(mockHttpClient.delete).mockRejectedValue(error);

      await expect(service.deleteSchedule('nonexistent')).rejects.toThrow('Schedule not found');
    });
  });

  describe('error handling', () => {
    it('should handle malformed response data', async () => {
      const malformedResponse = createMockResponse('invalid json');

      vi.mocked(mockHttpClient.get).mockResolvedValue(malformedResponse);

      await expect(service.getAllSchedules()).rejects.toThrow();
    });

    it('should handle missing response data', async () => {
      // @ts-expect-error - Testing invalid response structure
      const emptyResponse: HttpResponse<unknown> = {
        status: 200,
        statusText: 'OK',
        headers: {}
      };

      vi.mocked(mockHttpClient.get).mockResolvedValue(emptyResponse);

      await expect(service.getAllSchedules()).rejects.toThrow();
    });

    it('should handle network timeouts', async () => {
      const timeoutError = new Error('Request timeout');
      vi.mocked(mockHttpClient.get).mockRejectedValue(timeoutError);

      await expect(service.getAllSchedules()).rejects.toThrow('Request timeout');
    });
  });

  describe('integration scenarios', () => {
    it('should handle complete schedule management workflow', async () => {
      // Create schedule
      const createData = {
        doctorId: 'doc1',
        date: '2023-12-25',
        time: '09:00'
      };

      const createResponse = createMockResponse({
        success: true,
        data: mockScheduleDto
      });

      vi.mocked(mockHttpClient.post).mockResolvedValue(createResponse);

      const created = await service.createSchedule(createData);
      expect(created.id).toBe('1');

      // Update schedule
      const updateData = { time: '10:00' };
      const updateResponse = createMockResponse({
        success: true
      });

      vi.mocked(mockHttpClient.put).mockResolvedValue(updateResponse);

      await service.updateSchedule(created.id, updateData);

      // Delete schedule
      const deleteResponse = createMockResponse({
        success: true
      });

      vi.mocked(mockHttpClient.delete).mockResolvedValue(deleteResponse);

      await service.deleteSchedule(created.id);

      expect(mockHttpClient.post).toHaveBeenCalledWith('/api/schedules', createData);
      expect(mockHttpClient.put).toHaveBeenCalledWith('/api/schedules/1', updateData);
      expect(mockHttpClient.delete).toHaveBeenCalledWith('/api/schedules/1');
    });

    it('should handle multiple concurrent requests', async () => {
      const responses = [
        createMockResponse({
          success: true,
          data: [mockScheduleDto]
        }),
        createMockResponse({
          success: true,
          data: [mockScheduleDto2]
        })
      ];

      vi.mocked(mockHttpClient.get)
        .mockResolvedValueOnce(responses[0])
        .mockResolvedValueOnce(responses[1]);

      const [allSchedules, doctorSchedules] = await Promise.all([
        service.getAllSchedules(),
        service.getSchedulesByDoctor('doc2')
      ]);

      expect(allSchedules).toEqual([mockScheduleDto]);
      expect(doctorSchedules).toEqual([mockScheduleDto2]);
    });
  });
});