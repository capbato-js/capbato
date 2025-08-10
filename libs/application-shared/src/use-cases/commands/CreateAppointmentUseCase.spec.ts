import { describe, it, expect, beforeEach, vi } from 'vitest';
import { CreateAppointmentUseCase } from './CreateAppointmentUseCase';
import type { CreateAppointmentCommand } from '../../dto/AppointmentCommands';

// Mock all dependencies
const mockAppointmentRepository = {
  create: vi.fn(),
  checkTimeSlotAvailability: vi.fn(),
  checkPatientDuplicateAppointment: vi.fn(),
};

const mockScheduleRepository = {
  create: vi.fn(),
};

const mockDoctorRepository = {
  getById: vi.fn(),
};

const mockPatientRepository = {
  getById: vi.fn(),
};

describe('CreateAppointmentUseCase - Multiple Appointments', () => {
  let useCase: CreateAppointmentUseCase;

  beforeEach(() => {
    useCase = new CreateAppointmentUseCase(
      mockAppointmentRepository as any,
      mockScheduleRepository as any,
      mockDoctorRepository as any,
      mockPatientRepository as any
    );
    vi.clearAllMocks();
  });

  it('should create multiple appointments for the same patient on the same day', async () => {
    // Arrange
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const firstCommand: CreateAppointmentCommand = {
      patientId: 'patient123',
      reasonForVisit: 'Morning checkup',
      appointmentDate: tomorrow,
      appointmentTime: '09:00',
      doctorId: 'doctor123',
      status: 'confirmed'
    };

    const secondCommand: CreateAppointmentCommand = {
      patientId: 'patient123',
      reasonForVisit: 'Afternoon follow-up', 
      appointmentDate: tomorrow,
      appointmentTime: '14:00',
      doctorId: 'doctor123',
      status: 'confirmed'
    };

    // Mock patient repository to return patient data
    mockPatientRepository.getById.mockResolvedValue({
      id: 'patient123',
      fullName: 'John Doe'
    });

    // Mock time slot availability (both times are available)
    mockAppointmentRepository.checkTimeSlotAvailability.mockResolvedValue(true);

    // Mock duplicate appointment check (should not be called due to our changes)
    mockAppointmentRepository.checkPatientDuplicateAppointment.mockResolvedValue(false);

    // Mock appointment creation to return IDs
    mockAppointmentRepository.create
      .mockResolvedValueOnce('appointment1')
      .mockResolvedValueOnce('appointment2');

    // Act
    const firstAppointment = await useCase.execute(firstCommand);
    const secondAppointment = await useCase.execute(secondCommand);

    // Assert
    expect(firstAppointment).toBeDefined();
    expect(secondAppointment).toBeDefined();
    expect(firstAppointment.patientId).toBe('patient123');
    expect(secondAppointment.patientId).toBe('patient123');
    expect(firstAppointment.timeValue).toBe('09:00');
    expect(secondAppointment.timeValue).toBe('14:00');

    // Verify both appointments were created
    expect(mockAppointmentRepository.create).toHaveBeenCalledTimes(2);
    
    // Verify time slot validation was called for both
    expect(mockAppointmentRepository.checkTimeSlotAvailability).toHaveBeenCalledTimes(2);
    
    // Verify duplicate appointment validation was NOT called (new behavior)
    expect(mockAppointmentRepository.checkPatientDuplicateAppointment).not.toHaveBeenCalled();
  });

  it('should still prevent appointments with unavailable time slots', async () => {
    // Arrange
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const command: CreateAppointmentCommand = {
      patientId: 'patient123',
      reasonForVisit: 'Checkup',
      appointmentDate: tomorrow,
      appointmentTime: '09:00',
      doctorId: 'doctor123',
      status: 'confirmed'
    };

    // Mock patient repository
    mockPatientRepository.getById.mockResolvedValue({
      id: 'patient123',
      fullName: 'John Doe'
    });

    // Mock time slot as unavailable
    mockAppointmentRepository.checkTimeSlotAvailability.mockResolvedValue(false);

    // Act & Assert
    await expect(useCase.execute(command)).rejects.toThrow('Time slot at 09:00');

    // Verify appointment was not created
    expect(mockAppointmentRepository.create).not.toHaveBeenCalled();
  });
});