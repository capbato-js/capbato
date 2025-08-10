import { describe, it, expect, beforeEach } from 'vitest';
import { InMemoryAppointmentRepository } from './InMemoryAppointmentRepository';
import { Appointment } from '@nx-starter/domain';

describe('InMemoryAppointmentRepository - Multiple Appointments', () => {
  let repository: InMemoryAppointmentRepository;

  beforeEach(() => {
    repository = new InMemoryAppointmentRepository();
  });

  it('should allow multiple appointments for the same patient on the same day', async () => {
    // Arrange
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const appointment1 = Appointment.create(
      'patient123',
      'Morning checkup',
      tomorrow,
      '09:00',
      'doctor123'
    );
    
    const appointment2 = Appointment.create(
      'patient123',
      'Afternoon follow-up',
      tomorrow,
      '14:00',
      'doctor123'
    );

    // Act
    const id1 = await repository.create(appointment1);
    const id2 = await repository.create(appointment2);

    // Assert
    expect(id1).toBeDefined();
    expect(id2).toBeDefined();
    expect(id1).not.toBe(id2);

    // Verify both appointments exist
    const allAppointments = await repository.getAll();
    expect(allAppointments).toHaveLength(2);

    // Verify both appointments are for the same patient and date
    const patientAppointments = await repository.getByPatientId('patient123');
    expect(patientAppointments).toHaveLength(2);
    
    // Verify appointments are on the same date
    const appointmentsOnDate = await repository.getAppointmentsByDate(tomorrow);
    expect(appointmentsOnDate).toHaveLength(2);
  });

  it('should return false for duplicate appointment checks (new behavior)', async () => {
    // Arrange
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const appointment = Appointment.create(
      'patient123',
      'Checkup',
      tomorrow,
      '09:00',
      'doctor123'
    );

    await repository.create(appointment);

    // Act
    const hasDuplicate = await repository.checkPatientDuplicateAppointment(
      'patient123',
      tomorrow
    );

    // Assert - should return false even though there's an existing appointment
    expect(hasDuplicate).toBe(false);
  });

  it('should still validate time slot availability correctly', async () => {
    // Arrange
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // Create 3 appointments at the same time (within the 4 appointment limit)
    const appointments = [
      Appointment.create('patient1', 'Checkup 1', tomorrow, '09:00', 'doctor123'),
      Appointment.create('patient2', 'Checkup 2', tomorrow, '09:00', 'doctor123'),
      Appointment.create('patient3', 'Checkup 3', tomorrow, '09:00', 'doctor123'),
    ];

    for (const appointment of appointments) {
      await repository.create(appointment);
    }

    // Act & Assert - should still be available (limit is 4)
    const isAvailable = await repository.checkTimeSlotAvailability(tomorrow, '09:00');
    expect(isAvailable).toBe(true);

    // Add one more appointment to reach the limit
    const appointment4 = Appointment.create('patient4', 'Checkup 4', tomorrow, '09:00', 'doctor123');
    await repository.create(appointment4);

    // Now should be unavailable (reached limit of 4)
    const isStillAvailable = await repository.checkTimeSlotAvailability(tomorrow, '09:00');
    expect(isStillAvailable).toBe(false);
  });
});