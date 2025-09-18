import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AppointmentApiService } from './AppointmentApiService';
import { IHttpClient } from '../http/IHttpClient';
import { AppointmentDto } from '@nx-starter/application-shared';

// Mock the API config module
vi.mock('./config/ApiConfig', () => ({
  getApiConfig: vi.fn(() => ({
    endpoints: {
      appointments: {
        create: '/api/appointments',
        all: '/api/appointments',
        byId: (id: string) => `/api/appointments/${id}`,
        byPatientId: (patientId: string) => `/api/appointments/patient/${patientId}`,
        update: (id: string) => `/api/appointments/${id}`,
        delete: (id: string) => `/api/appointments/${id}`,
        confirm: (id: string) => `/api/appointments/${id}/confirm`,
        cancel: (id: string) => `/api/appointments/${id}/cancel`,
        complete: (id: string) => `/api/appointments/${id}/complete`,
        reconfirm: (id: string) => `/api/appointments/${id}/reconfirm`,
        todayConfirmed: '/api/appointments/today/confirmed',
      },
    },
  })),
}));

describe('AppointmentApiService', () => {
  let appointmentApiService: AppointmentApiService;
  let mockHttpClient: IHttpClient;

  // Mock appointment DTOs for testing
  const mockAppointmentDto: AppointmentDto = {
    id: 'appointment-123',
    patient: {
      id: 'patient-456',
      patientNumber: 'P001',
      firstName: 'John',
      lastName: 'Doe',
      middleName: 'Michael',
      fullName: 'John Michael Doe',
    },
    doctor: {
      id: 'doctor-789',
      firstName: 'Jane',
      lastName: 'Smith',
      fullName: 'Dr. Jane Smith',
      specialization: 'Cardiology',
    },
    reasonForVisit: 'Regular checkup',
    appointmentDate: '2024-01-15',
    appointmentTime: '10:00',
    status: 'confirmed',
    createdAt: '2024-01-10T08:00:00.000Z',
    updatedAt: '2024-01-10T08:00:00.000Z',
  };

  const mockAppointmentList: AppointmentDto[] = [
    mockAppointmentDto,
    {
      ...mockAppointmentDto,
      id: 'appointment-124',
      reasonForVisit: 'Follow-up visit',
      status: 'completed',
    },
  ];

  beforeEach(() => {
    // Create mock HTTP client
    mockHttpClient = {
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      delete: vi.fn(),
      patch: vi.fn(),
    };

    // Create service instance with mocked dependencies
    appointmentApiService = new AppointmentApiService(mockHttpClient);
  });

  describe('createAppointment', () => {
    const appointmentData = {
      patientId: 'patient-456',
      reasonForVisit: 'Regular checkup',
      appointmentDate: '2024-01-15',
      appointmentTime: '10:00',
      doctorId: 'doctor-789',
      status: 'confirmed' as const,
    };

    it('should successfully create an appointment', async () => {
      // Arrange
      const mockResponse = {
        success: true,
        data: mockAppointmentDto,
      };
      vi.mocked(mockHttpClient.post).mockResolvedValue({ 
        data: mockResponse,
        status: 200,
        statusText: 'OK',
        headers: {}
      });

      // Act
      const result = await appointmentApiService.createAppointment(appointmentData);

      // Assert
      expect(mockHttpClient.post).toHaveBeenCalledWith(
        '/api/appointments',
        appointmentData
      );
      expect(result).toEqual(mockAppointmentDto);
    });

    it('should handle failed creation response', async () => {
      // Arrange
      const mockResponse = {
        success: false,
        data: null,
      };
      vi.mocked(mockHttpClient.post).mockResolvedValue({
        data: mockResponse,
        status: 200,
        statusText: 'OK',
        headers: {}
      });

      // Act & Assert
      await expect(
        appointmentApiService.createAppointment(appointmentData)
      ).rejects.toThrow('Failed to create appointment');
    });

    it('should handle API error response with specific error message', async () => {
      // Arrange
      const errorMessage = 'Doctor is not available at this time';
      const mockError = {
        response: {
          data: {
            error: errorMessage,
          },
        },
      };
      vi.mocked(mockHttpClient.post).mockRejectedValue(mockError);

      // Act & Assert
      await expect(
        appointmentApiService.createAppointment(appointmentData)
      ).rejects.toThrow(errorMessage);
    });

    it('should handle generic error response', async () => {
      // Arrange
      const genericError = new Error('Network error');
      vi.mocked(mockHttpClient.post).mockRejectedValue(genericError);

      // Act & Assert
      await expect(
        appointmentApiService.createAppointment(appointmentData)
      ).rejects.toThrow('Network error');
    });

    it('should create appointment without optional status', async () => {
      // Arrange
      const appointmentDataWithoutStatus = {
        patientId: 'patient-456',
        reasonForVisit: 'Regular checkup',
        appointmentDate: '2024-01-15',
        appointmentTime: '10:00',
        doctorId: 'doctor-789',
      };
      const mockResponse = {
        success: true,
        data: mockAppointmentDto,
      };
      vi.mocked(mockHttpClient.post).mockResolvedValue({
        data: mockResponse,
        status: 200,
        statusText: 'OK',
        headers: {}
      });

      // Act
      const result = await appointmentApiService.createAppointment(appointmentDataWithoutStatus);

      // Assert
      expect(mockHttpClient.post).toHaveBeenCalledWith(
        '/api/appointments',
        appointmentDataWithoutStatus
      );
      expect(result).toEqual(mockAppointmentDto);
    });
  });

  describe('getAllAppointments', () => {
    it('should successfully fetch all appointments', async () => {
      // Arrange
      const mockResponse = {
        success: true,
        data: mockAppointmentList,
      };
      vi.mocked(mockHttpClient.get).mockResolvedValue({
        data: mockResponse,
        status: 200,
        statusText: 'OK',
        headers: {}
      });

      // Act
      const result = await appointmentApiService.getAllAppointments();

      // Assert
      expect(mockHttpClient.get).toHaveBeenCalledWith('/api/appointments');
      expect(result).toEqual(mockAppointmentList);
    });

    it('should handle failed response', async () => {
      // Arrange
      const mockResponse = {
        success: false,
        data: null,
      };
      vi.mocked(mockHttpClient.get).mockResolvedValue({
        data: mockResponse,
        status: 200,
        statusText: 'OK',
        headers: {}
      });

      // Act & Assert
      await expect(appointmentApiService.getAllAppointments()).rejects.toThrow(
        'Failed to fetch appointments'
      );
    });
  });

  describe('getTodayConfirmedAppointments', () => {
    it('should successfully fetch today\'s confirmed appointments', async () => {
      // Arrange
      const todayConfirmedAppointments = [mockAppointmentDto];
      const mockResponse = {
        success: true,
        data: todayConfirmedAppointments,
      };
      vi.mocked(mockHttpClient.get).mockResolvedValue({
        data: mockResponse,
        status: 200,
        statusText: 'OK',
        headers: {}
      });

      // Act
      const result = await appointmentApiService.getTodayConfirmedAppointments();

      // Assert
      expect(mockHttpClient.get).toHaveBeenCalledWith('/api/appointments/today/confirmed');
      expect(result).toEqual(todayConfirmedAppointments);
    });

    it('should handle failed response', async () => {
      // Arrange
      const mockResponse = {
        success: false,
        data: null,
      };
      vi.mocked(mockHttpClient.get).mockResolvedValue({
        data: mockResponse,
        status: 200,
        statusText: 'OK',
        headers: {}
      });

      // Act & Assert
      await expect(appointmentApiService.getTodayConfirmedAppointments()).rejects.toThrow(
        'Failed to fetch today\'s confirmed appointments'
      );
    });
  });

  describe('getAppointmentById', () => {
    const appointmentId = 'appointment-123';

    it('should successfully fetch appointment by ID', async () => {
      // Arrange
      const mockResponse = {
        success: true,
        data: mockAppointmentDto,
      };
      vi.mocked(mockHttpClient.get).mockResolvedValue({
        data: mockResponse,
        status: 200,
        statusText: 'OK',
        headers: {}
      });

      // Act
      const result = await appointmentApiService.getAppointmentById(appointmentId);

      // Assert
      expect(mockHttpClient.get).toHaveBeenCalledWith(`/api/appointments/${appointmentId}`);
      expect(result).toEqual(mockAppointmentDto);
    });

    it('should handle failed response', async () => {
      // Arrange
      const mockResponse = {
        success: false,
        data: null,
      };
      vi.mocked(mockHttpClient.get).mockResolvedValue({
        data: mockResponse,
        status: 200,
        statusText: 'OK',
        headers: {}
      });

      // Act & Assert
      await expect(
        appointmentApiService.getAppointmentById(appointmentId)
      ).rejects.toThrow('Failed to fetch appointment');
    });
  });

  describe('getAppointmentsByPatientId', () => {
    const patientId = 'patient-456';

    it('should successfully fetch appointments by patient ID', async () => {
      // Arrange
      const mockResponse = {
        success: true,
        data: mockAppointmentList,
      };
      vi.mocked(mockHttpClient.get).mockResolvedValue({
        data: mockResponse,
        status: 200,
        statusText: 'OK',
        headers: {}
      });

      // Act
      const result = await appointmentApiService.getAppointmentsByPatientId(patientId);

      // Assert
      expect(mockHttpClient.get).toHaveBeenCalledWith(`/api/appointments/patient/${patientId}`);
      expect(result).toEqual(mockAppointmentList);
    });

    it('should handle failed response', async () => {
      // Arrange
      const mockResponse = {
        success: false,
        data: null,
      };
      vi.mocked(mockHttpClient.get).mockResolvedValue({
        data: mockResponse,
        status: 200,
        statusText: 'OK',
        headers: {}
      });

      // Act & Assert
      await expect(
        appointmentApiService.getAppointmentsByPatientId(patientId)
      ).rejects.toThrow('Failed to fetch appointments for patient');
    });
  });

  describe('updateAppointment', () => {
    const appointmentId = 'appointment-123';
    const updateData = {
      patientId: 'patient-789',
      reasonForVisit: 'Updated reason',
      appointmentDate: '2024-01-20',
      appointmentTime: '11:00',
      doctorId: 'doctor-456',
      status: 'confirmed' as const,
    };

    it('should successfully update an appointment', async () => {
      // Arrange
      const mockResponse = {
        success: true,
      };
      vi.mocked(mockHttpClient.put).mockResolvedValue({
        data: mockResponse,
        status: 200,
        statusText: 'OK',
        headers: {}
      });

      // Act
      await appointmentApiService.updateAppointment(appointmentId, updateData);

      // Assert
      expect(mockHttpClient.put).toHaveBeenCalledWith(
        `/api/appointments/${appointmentId}`,
        updateData
      );
    });

    it('should handle failed update response', async () => {
      // Arrange
      const mockResponse = {
        success: false,
      };
      vi.mocked(mockHttpClient.put).mockResolvedValue({
        data: mockResponse,
        status: 200,
        statusText: 'OK',
        headers: {}
      });

      // Act & Assert
      await expect(
        appointmentApiService.updateAppointment(appointmentId, updateData)
      ).rejects.toThrow('Failed to update appointment');
    });

    it('should update appointment with partial data', async () => {
      // Arrange
      const partialUpdateData = {
        reasonForVisit: 'Updated reason only',
        status: 'completed' as const,
      };
      const mockResponse = {
        success: true,
      };
      vi.mocked(mockHttpClient.put).mockResolvedValue({
        data: mockResponse,
        status: 200,
        statusText: 'OK',
        headers: {}
      });

      // Act
      await appointmentApiService.updateAppointment(appointmentId, partialUpdateData);

      // Assert
      expect(mockHttpClient.put).toHaveBeenCalledWith(
        `/api/appointments/${appointmentId}`,
        partialUpdateData
      );
    });
  });

  describe('deleteAppointment', () => {
    const appointmentId = 'appointment-123';

    it('should successfully delete an appointment', async () => {
      // Arrange
      const mockResponse = {
        success: true,
      };
      vi.mocked(mockHttpClient.delete).mockResolvedValue({
        data: mockResponse,
        status: 200,
        statusText: 'OK',
        headers: {}
      });

      // Act
      await appointmentApiService.deleteAppointment(appointmentId);

      // Assert
      expect(mockHttpClient.delete).toHaveBeenCalledWith(`/api/appointments/${appointmentId}`);
    });

    it('should handle failed delete response', async () => {
      // Arrange
      const mockResponse = {
        success: false,
      };
      vi.mocked(mockHttpClient.delete).mockResolvedValue({
        data: mockResponse,
        status: 200,
        statusText: 'OK',
        headers: {}
      });

      // Act & Assert
      await expect(
        appointmentApiService.deleteAppointment(appointmentId)
      ).rejects.toThrow('Failed to delete appointment');
    });
  });

  describe('confirmAppointment', () => {
    const appointmentId = 'appointment-123';

    it('should successfully confirm an appointment', async () => {
      // Arrange
      const mockResponse = {
        success: true,
      };
      vi.mocked(mockHttpClient.put).mockResolvedValue({
        data: mockResponse,
        status: 200,
        statusText: 'OK',
        headers: {}
      });

      // Act
      await appointmentApiService.confirmAppointment(appointmentId);

      // Assert
      expect(mockHttpClient.put).toHaveBeenCalledWith(
        `/api/appointments/${appointmentId}/confirm`,
        {}
      );
    });

    it('should handle failed confirm response', async () => {
      // Arrange
      const mockResponse = {
        success: false,
      };
      vi.mocked(mockHttpClient.put).mockResolvedValue({
        data: mockResponse,
        status: 200,
        statusText: 'OK',
        headers: {}
      });

      // Act & Assert
      await expect(
        appointmentApiService.confirmAppointment(appointmentId)
      ).rejects.toThrow('Failed to confirm appointment');
    });
  });

  describe('cancelAppointment', () => {
    const appointmentId = 'appointment-123';

    it('should successfully cancel an appointment', async () => {
      // Arrange
      const mockResponse = {
        success: true,
      };
      vi.mocked(mockHttpClient.put).mockResolvedValue({
        data: mockResponse,
        status: 200,
        statusText: 'OK',
        headers: {}
      });

      // Act
      await appointmentApiService.cancelAppointment(appointmentId);

      // Assert
      expect(mockHttpClient.put).toHaveBeenCalledWith(
        `/api/appointments/${appointmentId}/cancel`,
        {}
      );
    });

    it('should handle failed cancel response', async () => {
      // Arrange
      const mockResponse = {
        success: false,
      };
      vi.mocked(mockHttpClient.put).mockResolvedValue({
        data: mockResponse,
        status: 200,
        statusText: 'OK',
        headers: {}
      });

      // Act & Assert
      await expect(
        appointmentApiService.cancelAppointment(appointmentId)
      ).rejects.toThrow('Failed to cancel appointment');
    });
  });

  describe('completeAppointment', () => {
    const appointmentId = 'appointment-123';

    it('should successfully complete an appointment', async () => {
      // Arrange
      const mockResponse = {
        success: true,
      };
      vi.mocked(mockHttpClient.put).mockResolvedValue({
        data: mockResponse,
        status: 200,
        statusText: 'OK',
        headers: {}
      });

      // Act
      await appointmentApiService.completeAppointment(appointmentId);

      // Assert
      expect(mockHttpClient.put).toHaveBeenCalledWith(
        `/api/appointments/${appointmentId}/complete`,
        {}
      );
    });

    it('should handle failed complete response', async () => {
      // Arrange
      const mockResponse = {
        success: false,
      };
      vi.mocked(mockHttpClient.put).mockResolvedValue({
        data: mockResponse,
        status: 200,
        statusText: 'OK',
        headers: {}
      });

      // Act & Assert
      await expect(
        appointmentApiService.completeAppointment(appointmentId)
      ).rejects.toThrow('Failed to complete appointment');
    });
  });

  describe('reconfirmAppointment', () => {
    const appointmentId = 'appointment-123';

    it('should successfully reconfirm an appointment', async () => {
      // Arrange
      const mockResponse = {
        success: true,
      };
      vi.mocked(mockHttpClient.put).mockResolvedValue({
        data: mockResponse,
        status: 200,
        statusText: 'OK',
        headers: {}
      });

      // Act
      await appointmentApiService.reconfirmAppointment(appointmentId);

      // Assert
      expect(mockHttpClient.put).toHaveBeenCalledWith(
        `/api/appointments/${appointmentId}/reconfirm`,
        {}
      );
    });

    it('should handle failed reconfirm response', async () => {
      // Arrange
      const mockResponse = {
        success: false,
      };
      vi.mocked(mockHttpClient.put).mockResolvedValue({
        data: mockResponse,
        status: 200,
        statusText: 'OK',
        headers: {}
      });

      // Act & Assert
      await expect(
        appointmentApiService.reconfirmAppointment(appointmentId)
      ).rejects.toThrow('Failed to reconfirm appointment');
    });
  });

  describe('error handling edge cases', () => {
    it('should handle network errors gracefully', async () => {
      // Arrange
      const networkError = new Error('NETWORK_ERROR');
      vi.mocked(mockHttpClient.get).mockRejectedValue(networkError);

      // Act & Assert
      await expect(appointmentApiService.getAllAppointments()).rejects.toThrow(
        'NETWORK_ERROR'
      );
    });

    it('should handle undefined response data', async () => {
      // Arrange
      const mockResponse = {
        data: undefined,
        status: 200,
        statusText: 'OK',
        headers: {}
      };
      vi.mocked(mockHttpClient.get).mockResolvedValue(mockResponse);

      // Act & Assert
      await expect(appointmentApiService.getAllAppointments()).rejects.toThrow(
        "Cannot read properties of undefined (reading 'success')"
      );
    });

    it('should handle null data in successful response', async () => {
      // Arrange
      const mockResponse = {
        success: true,
        data: null,
      };
      vi.mocked(mockHttpClient.get).mockResolvedValue({
        data: mockResponse,
        status: 200,
        statusText: 'OK',
        headers: {}
      });

      // Act & Assert
      await expect(appointmentApiService.getAllAppointments()).rejects.toThrow(
        'Failed to fetch appointments'
      );
    });

    it('should handle empty array responses correctly', async () => {
      // Arrange
      const mockResponse = {
        success: true,
        data: [],
      };
      vi.mocked(mockHttpClient.get).mockResolvedValue({
        data: mockResponse,
        status: 200,
        statusText: 'OK',
        headers: {}
      });

      // Act
      const result = await appointmentApiService.getAllAppointments();

      // Assert
      expect(result).toEqual([]);
    });
  });

  describe('HTTP method usage verification', () => {
    it('should use correct HTTP methods for different operations', async () => {
      // Arrange
      const mockSuccessResponse = { 
        data: { success: true },
        status: 200,
        statusText: 'OK',
        headers: {}
      };
      const mockDataResponse = { 
        data: { success: true, data: [] },
        status: 200,
        statusText: 'OK',
        headers: {}
      };
      vi.mocked(mockHttpClient.post).mockResolvedValue(mockDataResponse);
      vi.mocked(mockHttpClient.get).mockResolvedValue(mockDataResponse);
      vi.mocked(mockHttpClient.put).mockResolvedValue(mockSuccessResponse);
      vi.mocked(mockHttpClient.delete).mockResolvedValue(mockSuccessResponse);

      const appointmentData = {
        patientId: 'patient-456',
        reasonForVisit: 'Regular checkup',
        appointmentDate: '2024-01-15',
        appointmentTime: '10:00',
        doctorId: 'doctor-789',
      };

      // Act & Assert - POST for create
      await appointmentApiService.createAppointment(appointmentData);
      expect(mockHttpClient.post).toHaveBeenCalled();

      // Act & Assert - GET for read operations
      await appointmentApiService.getAllAppointments();
      await appointmentApiService.getAppointmentById('123');
      await appointmentApiService.getAppointmentsByPatientId('456');
      await appointmentApiService.getTodayConfirmedAppointments();
      expect(vi.mocked(mockHttpClient.get)).toHaveBeenCalledTimes(4);

      // Act & Assert - PUT for updates
      await appointmentApiService.updateAppointment('123', appointmentData);
      await appointmentApiService.confirmAppointment('123');
      await appointmentApiService.cancelAppointment('123');
      await appointmentApiService.completeAppointment('123');
      await appointmentApiService.reconfirmAppointment('123');
      expect(vi.mocked(mockHttpClient.put)).toHaveBeenCalledTimes(5);

      // Act & Assert - DELETE for deletion
      await appointmentApiService.deleteAppointment('123');
      expect(vi.mocked(mockHttpClient.delete)).toHaveBeenCalledTimes(1);
    });
  });

  describe('endpoint URL construction', () => {
    it('should construct correct endpoint URLs for dynamic routes', async () => {
      // Arrange
      const mockResponse = { 
        data: { success: true, data: [] },
        status: 200,
        statusText: 'OK',
        headers: {}
      };
      vi.mocked(mockHttpClient.get).mockResolvedValue(mockResponse);

      // Act
      await appointmentApiService.getAppointmentById('test-id-123');
      await appointmentApiService.getAppointmentsByPatientId('patient-456');

      // Assert
      expect(mockHttpClient.get).toHaveBeenCalledWith('/api/appointments/test-id-123');
      expect(mockHttpClient.get).toHaveBeenCalledWith('/api/appointments/patient/patient-456');
    });
  });
});