import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AppointmentDomainService } from './AppointmentDomainService';
import { Appointment } from '../entities/Appointment';
import { IAppointmentRepository } from '../repositories/IAppointmentRepository';

// Mock repository
const mockAppointmentRepository: IAppointmentRepository = {
  getAll: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
  getById: vi.fn(),
  getByPatientId: vi.fn(),
  getTodayAppointments: vi.fn(),
  getTodayConfirmedAppointments: vi.fn(),
  getConfirmedAppointments: vi.fn(),
  getAppointmentsByDate: vi.fn(),
  getAppointmentsByDateRange: vi.fn(),
  getWeeklyAppointmentSummary: vi.fn(),
  checkTimeSlotAvailability: vi.fn(),
  checkPatientDuplicateAppointment: vi.fn(),
};

describe('AppointmentDomainService', () => {
  let appointmentDomainService: AppointmentDomainService;

  beforeEach(() => {
    appointmentDomainService = new AppointmentDomainService(mockAppointmentRepository);
    vi.clearAllMocks();
  });

  describe('Multiple appointments per day support', () => {
    it('should allow creating multiple appointments for the same patient on the same day', async () => {
      // Arrange
      const patientId = 'patient123';
      // Use tomorrow's date to avoid past date validation
      const appointmentDate = new Date();
      appointmentDate.setDate(appointmentDate.getDate() + 1);
      
      const firstAppointment = Appointment.create(
        patientId,
        'Checkup',
        appointmentDate,
        '09:00',
        'doctor123'
      );
      const secondAppointment = Appointment.create(
        patientId,
        'Follow-up',
        appointmentDate,
        '14:00',
        'doctor123'
      );

      // Mock time slot availability as available
      vi.mocked(mockAppointmentRepository.checkTimeSlotAvailability)
        .mockResolvedValue(true);

      // Mock duplicate appointment check to return false (no duplicate - new behavior)
      vi.mocked(mockAppointmentRepository.checkPatientDuplicateAppointment)
        .mockResolvedValue(false);

      // Act & Assert - should not throw any exceptions
      await expect(
        appointmentDomainService.validateAppointmentCreation(firstAppointment, 'John Doe')
      ).resolves.not.toThrow();

      await expect(
        appointmentDomainService.validateAppointmentCreation(secondAppointment, 'John Doe')
      ).resolves.not.toThrow();

      // Verify that duplicate appointment validation is no longer called
      expect(mockAppointmentRepository.checkPatientDuplicateAppointment).not.toHaveBeenCalled();
    });

    it('should allow updating appointments without duplicate validation', async () => {
      // Arrange
      const patientId = 'patient123';
      // Use tomorrow's date to avoid past date validation
      const appointmentDate = new Date();
      appointmentDate.setDate(appointmentDate.getDate() + 1);
      
      const appointment = Appointment.create(
        patientId,
        'Checkup',
        appointmentDate,
        '10:00',
        'doctor123'
      );

      // Mock time slot availability as available
      vi.mocked(mockAppointmentRepository.checkTimeSlotAvailability)
        .mockResolvedValue(true);

      // Act & Assert - should not throw any exceptions
      await expect(
        appointmentDomainService.validateAppointmentUpdate(appointment, 'appointment123', 'John Doe')
      ).resolves.not.toThrow();

      // Verify that duplicate appointment validation is no longer called
      expect(mockAppointmentRepository.checkPatientDuplicateAppointment).not.toHaveBeenCalled();
    });

    it('should still validate time slot availability', async () => {
      // Arrange
      const patientId = 'patient123';
      // Use tomorrow's date to avoid past date validation
      const appointmentDate = new Date();
      appointmentDate.setDate(appointmentDate.getDate() + 1);
      
      const appointment = Appointment.create(
        patientId,
        'Checkup',
        appointmentDate,
        '09:00',
        'doctor123'
      );

      // Mock time slot as unavailable
      vi.mocked(mockAppointmentRepository.checkTimeSlotAvailability)
        .mockResolvedValue(false);

      // Act & Assert - should still throw time slot unavailable exception
      await expect(
        appointmentDomainService.validateAppointmentCreation(appointment, 'John Doe')
      ).rejects.toThrow('Time slot at 09:00');

      // Verify time slot validation was called
      expect(mockAppointmentRepository.checkTimeSlotAvailability).toHaveBeenCalledWith(
        appointmentDate,
        '09:00',
        undefined
      );
    });

    it('validateNoDuplicateAppointment method should do nothing (backward compatibility)', async () => {
      // Arrange
      const patientId = 'patient123';
      const appointmentDate = new Date();
      appointmentDate.setDate(appointmentDate.getDate() + 1);

      // Act & Assert - should not throw any exceptions and not call repository
      await expect(
        appointmentDomainService.validateNoDuplicateAppointment(patientId, appointmentDate, undefined, 'John Doe')
      ).resolves.not.toThrow();

      // Verify repository method is not called since validation is disabled
      expect(mockAppointmentRepository.checkPatientDuplicateAppointment).not.toHaveBeenCalled();
    });
  });
});