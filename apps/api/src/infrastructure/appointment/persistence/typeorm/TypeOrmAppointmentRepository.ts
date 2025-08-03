import { injectable } from 'tsyringe';
import { Repository, DataSource, Between } from 'typeorm';
import { Appointment } from '@nx-starter/domain';
import type { IAppointmentRepository } from '@nx-starter/domain';
import { AppointmentMapper } from '@nx-starter/application-shared';
import { AppointmentEntity } from './AppointmentEntity';
import { generateId } from '@nx-starter/utils-core';

/**
 * TypeORM implementation of IAppointmentRepository
 * Supports MySQL, PostgreSQL, SQLite via TypeORM
 */
@injectable()
export class TypeOrmAppointmentRepository implements IAppointmentRepository {
  private repository: Repository<AppointmentEntity>;

  constructor(private dataSource: DataSource) {
    this.repository = this.dataSource.getRepository(AppointmentEntity);
  }

  async getAll(): Promise<Appointment[]> {
    const entities = await this.repository.find({
      order: { createdAt: 'DESC' },
    });
    return entities.map(this.toDomain);
  }

  async create(appointment: Appointment): Promise<string> {
    const id = generateId();
    const entity = this.repository.create({
      id,
      patientId: appointment.patientId,
      reasonForVisit: appointment.reasonForVisit,
      appointmentDate: appointment.appointmentDate,
      appointmentTime: appointment.timeValue,
      status: appointment.statusValue,
      doctorId: appointment.doctorId,
      createdAt: appointment.createdAt,
    });

    await this.repository.save(entity);
    return id;
  }

  async update(id: string, changes: Partial<Appointment>): Promise<void> {
    const entity = await this.repository.findOne({ where: { id } });
    if (!entity) {
      throw new Error(`Appointment with ID ${id} not found`);
    }

    const updateData: Partial<AppointmentEntity> = {};

    if (changes.patientId !== undefined) updateData.patientId = changes.patientId;
    if (changes.reasonForVisit !== undefined) updateData.reasonForVisit = changes.reasonForVisit;
    if (changes.appointmentDate !== undefined) updateData.appointmentDate = changes.appointmentDate;
    if (changes.appointmentTime !== undefined) {
      updateData.appointmentTime = typeof changes.appointmentTime === 'string' 
        ? changes.appointmentTime 
        : (changes.appointmentTime as { value: string }).value;
    }
    if (changes.statusValue !== undefined) updateData.status = changes.statusValue;
    if (changes.doctorId !== undefined) updateData.doctorId = changes.doctorId;
    
    updateData.updatedAt = new Date();

    await this.repository.update(id, updateData);
  }

  async delete(id: string): Promise<void> {
    const result = await this.repository.delete(id);
    if (result.affected === 0) {
      throw new Error(`Appointment with ID ${id} not found`);
    }
  }

  async getById(id: string): Promise<Appointment | undefined> {
    const entity = await this.repository.findOne({ where: { id } });
    return entity ? this.toDomain(entity) : undefined;
  }

  async getByPatientId(patientId: string): Promise<Appointment[]> {
    const entities = await this.repository.find({
      where: { patientId },
      order: { appointmentDate: 'DESC', appointmentTime: 'DESC' },
    });
    return entities.map(this.toDomain);
  }

  async getTodayAppointments(): Promise<Appointment[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const entities = await this.repository.find({
      where: {
        appointmentDate: Between(today, tomorrow),
      },
      order: { appointmentTime: 'ASC' },
    });
    return entities.map(this.toDomain);
  }

  async getTodayConfirmedAppointments(): Promise<Appointment[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const entities = await this.repository.find({
      where: {
        appointmentDate: Between(today, tomorrow),
        status: 'confirmed',
      },
      order: { appointmentTime: 'ASC' },
    });
    return entities.map(this.toDomain);
  }

  async getConfirmedAppointments(): Promise<Appointment[]> {
    const entities = await this.repository.find({
      where: { status: 'confirmed' },
      order: { appointmentDate: 'ASC', appointmentTime: 'ASC' },
    });
    return entities.map(this.toDomain);
  }

  async getAppointmentsByDate(date: Date): Promise<Appointment[]> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const entities = await this.repository.find({
      where: {
        appointmentDate: Between(startOfDay, endOfDay),
      },
      order: { appointmentTime: 'ASC' },
    });
    return entities.map(this.toDomain);
  }

  async getAppointmentsByDateRange(startDate: Date, endDate: Date): Promise<Appointment[]> {
    const entities = await this.repository.find({
      where: {
        appointmentDate: Between(startDate, endDate),
      },
      order: { appointmentDate: 'ASC', appointmentTime: 'ASC' },
    });
    return entities.map(this.toDomain);
  }

  async getWeeklyAppointmentSummary(): Promise<{ date: string; count: number }[]> {
    const today = new Date();
    const sixDaysAgo = new Date(today);
    sixDaysAgo.setDate(today.getDate() - 6);
    sixDaysAgo.setHours(0, 0, 0, 0);

    const result = await this.repository
      .createQueryBuilder('appointment')
      .select('DATE(appointment.appointmentDate)', 'date')
      .addSelect('COUNT(*)', 'count')
      .where('appointment.status = :status', { status: 'confirmed' })
      .andWhere('appointment.appointmentDate >= :startDate', { startDate: sixDaysAgo })
      .groupBy('DATE(appointment.appointmentDate)')
      .orderBy('date', 'ASC')
      .getRawMany();

    return result.map(row => ({
      date: row.date,
      count: parseInt(row.count, 10),
    }));
  }

  async checkTimeSlotAvailability(date: Date, time: string, excludeId?: string): Promise<boolean> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const queryBuilder = this.repository
      .createQueryBuilder('appointment')
      .where('appointment.appointmentDate BETWEEN :startOfDay AND :endOfDay', { startOfDay, endOfDay })
      .andWhere('appointment.appointmentTime = :time', { time })
      .andWhere('appointment.status = :status', { status: 'confirmed' });

    if (excludeId) {
      queryBuilder.andWhere('appointment.id != :excludeId', { excludeId });
    }

    const count = await queryBuilder.getCount();
    
    // Allow up to 4 confirmed appointments per time slot (based on legacy logic)
    return count < 4;
  }

  async checkPatientDuplicateAppointment(patientId: string, date: Date, excludeId?: string): Promise<boolean> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const queryBuilder = this.repository
      .createQueryBuilder('appointment')
      .where('appointment.patientId = :patientId', { patientId })
      .andWhere('appointment.appointmentDate BETWEEN :startOfDay AND :endOfDay', { startOfDay, endOfDay })
      .andWhere('appointment.status = :status', { status: 'confirmed' });

    if (excludeId) {
      queryBuilder.andWhere('appointment.id != :excludeId', { excludeId });
    }

    const count = await queryBuilder.getCount();
    return count > 0;
  }

  private toDomain(entity: AppointmentEntity): Appointment {
    // Convert HH:MM:SS back to HH:MM format if needed
    const timeValue = entity.appointmentTime.includes(':') && entity.appointmentTime.split(':').length === 3
      ? entity.appointmentTime.substring(0, 5) // Extract HH:MM from HH:MM:SS
      : entity.appointmentTime;

    return AppointmentMapper.fromPlainObject({
      id: entity.id,
      patient_id: entity.patientId,
      reason_for_visit: entity.reasonForVisit,
      appointment_date: entity.appointmentDate,
      appointment_time: timeValue,
      status: entity.status,
      doctor_id: entity.doctorId,
      created_at: entity.createdAt,
      updated_at: entity.updatedAt,
    });
  }
}
