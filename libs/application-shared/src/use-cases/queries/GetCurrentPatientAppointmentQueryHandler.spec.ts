import { describe, it, expect, beforeEach, vi } from 'vitest';
import { GetCurrentPatientAppointmentQueryHandler } from './GetCurrentPatientAppointmentQueryHandler';
import { Appointment } from '@nx-starter/domain';
import type { IAppointmentRepository } from '@nx-starter/domain';

describe('GetCurrentPatientAppointmentQueryHandler', () => {
  let handler: GetCurrentPatientAppointmentQueryHandler;
  let mockRepository: IAppointmentRepository;

  beforeEach(() => {
    mockRepository = {
      getCurrentPatientAppointment: vi.fn()
    } as unknown as IAppointmentRepository;
    
    handler = new GetCurrentPatientAppointmentQueryHandler(mockRepository);
  });

  it('should return the current patient appointment from repository', async () => {
    // Arrange
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 1); // Tomorrow
    
    const mockAppointment = Appointment.create(
      'patient-123',
      'Regular checkup',
      futureDate,
      '09:00',
      'doctor-456'
    );
    
    (mockRepository.getCurrentPatientAppointment as any).mockResolvedValue(mockAppointment);

    // Act
    const result = await handler.execute();

    // Assert
    expect(result).toBe(mockAppointment);
    expect(mockRepository.getCurrentPatientAppointment).toHaveBeenCalledOnce();
  });

  it('should return undefined when no current appointment exists', async () => {
    // Arrange
    (mockRepository.getCurrentPatientAppointment as any).mockResolvedValue(undefined);

    // Act
    const result = await handler.execute();

    // Assert
    expect(result).toBeUndefined();
    expect(mockRepository.getCurrentPatientAppointment).toHaveBeenCalledOnce();
  });
});