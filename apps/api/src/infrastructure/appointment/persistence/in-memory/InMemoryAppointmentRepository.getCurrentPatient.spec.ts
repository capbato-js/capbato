import { describe, it, expect, beforeEach } from 'vitest';
import { InMemoryAppointmentRepository } from './InMemoryAppointmentRepository';
import { Appointment } from '@nx-starter/domain';

describe('InMemoryAppointmentRepository - getCurrentPatientAppointment', () => {
  let repository: InMemoryAppointmentRepository;

  beforeEach(() => {
    repository = new InMemoryAppointmentRepository();
  });

  it('should return the earliest non-completed appointment', async () => {
    // Arrange - Create appointments with different dates and statuses
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);

    // Create appointments (latest to earliest)
    const appointment1 = Appointment.create('patient-1', 'Checkup 1', nextWeek, '10:00', 'doctor-1');
    const appointment2 = Appointment.create('patient-2', 'Checkup 2', tomorrow, '14:00', 'doctor-1');
    const appointment3 = Appointment.create('patient-3', 'Checkup 3', tomorrow, '09:00', 'doctor-1');

    // Add them to repository
    await repository.create(appointment1);
    await repository.create(appointment2);
    await repository.create(appointment3);

    // Complete the earliest appointment
    const completedAppointment = appointment3.complete();
    await repository.update(appointment3.stringId!, completedAppointment);

    // Act
    const currentAppointment = await repository.getCurrentPatientAppointment();

    // Assert - Should return appointment2 (earliest non-completed)
    expect(currentAppointment).toBeDefined();
    expect(currentAppointment!.patientId).toBe('patient-2');
    expect(currentAppointment!.statusValue).toBe('confirmed');
  });

  it('should return undefined when all appointments are completed', async () => {
    // Arrange
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const appointment = Appointment.create('patient-1', 'Checkup', tomorrow, '10:00', 'doctor-1');
    const id = await repository.create(appointment);
    
    // Complete the appointment
    const completedAppointment = appointment.complete();
    await repository.update(id, completedAppointment);

    // Act
    const currentAppointment = await repository.getCurrentPatientAppointment();

    // Assert
    expect(currentAppointment).toBeUndefined();
  });

  it('should return undefined when no appointments exist', async () => {
    // Act
    const currentAppointment = await repository.getCurrentPatientAppointment();

    // Assert
    expect(currentAppointment).toBeUndefined();
  });

  it('should respect date and time ordering', async () => {
    // Arrange
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    // Create appointments with same date but different times
    const lateAppointment = Appointment.create('patient-1', 'Late checkup', tomorrow, '15:00', 'doctor-1');
    const earlyAppointment = Appointment.create('patient-2', 'Early checkup', tomorrow, '09:00', 'doctor-1');
    const midAppointment = Appointment.create('patient-3', 'Mid checkup', tomorrow, '12:00', 'doctor-1');

    // Add them in random order
    await repository.create(lateAppointment);
    await repository.create(earlyAppointment);
    await repository.create(midAppointment);

    // Act
    const currentAppointment = await repository.getCurrentPatientAppointment();

    // Assert - Should return the earliest appointment (09:00)
    expect(currentAppointment).toBeDefined();
    expect(currentAppointment!.patientId).toBe('patient-2');
    expect(currentAppointment!.timeValue).toBe('09:00');
  });
});