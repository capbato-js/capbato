import { injectable } from 'tsyringe';
import { Repository, DataSource } from 'typeorm';
import { Schedule, ScheduleId } from '@nx-starter/domain';
import type { IScheduleRepository } from '@nx-starter/domain';
import { ScheduleEntity } from './ScheduleEntity';
import { generateUUID } from '@nx-starter/utils-core';

/**
 * TypeORM implementation of IScheduleRepository
 * Supports MySQL, PostgreSQL, SQLite via TypeORM
 */
@injectable()
export class TypeOrmScheduleRepository implements IScheduleRepository {
  private repository: Repository<ScheduleEntity>;

  constructor(private dataSource: DataSource) {
    this.repository = this.dataSource.getRepository(ScheduleEntity);
  }

  async getAll(activeOnly?: boolean): Promise<Schedule[]> {
    let query = this.repository.createQueryBuilder('schedule');
    
    if (activeOnly) {
      const today = new Date().toISOString().split('T')[0];
      query = query.where('schedule.date >= :today', { today });
    }
    
    const entities = await query
      .orderBy('schedule.date', 'ASC')
      .addOrderBy('schedule.time', 'ASC')
      .getMany();
      
    return entities.map(this.toDomain);
  }

  async create(schedule: Schedule): Promise<Schedule> {
    const id = generateUUID();
    const entity = this.repository.create({
      id,
      doctorId: schedule.doctorIdString,
      date: schedule.dateString,
      time: schedule.timeString,
      createdAt: schedule.createdAt,
      updatedAt: schedule.updatedAt,
    });

    const savedEntity = await this.repository.save(entity);
    return this.toDomain(savedEntity);
  }

  async getById(id: ScheduleId): Promise<Schedule | undefined> {
    const entity = await this.repository.findOne({ 
      where: { id: id.value } 
    });
    return entity ? this.toDomain(entity) : undefined;
  }

  async getByDate(date: string): Promise<Schedule[]> {
    const entities = await this.repository.find({
      where: { date },
      order: { time: 'ASC' },
    });
    return entities.map(this.toDomain);
  }

  async getByDoctorName(doctorName: string): Promise<Schedule[]> {
    // This method is deprecated - use getByDoctorId instead
    // For backward compatibility, we'll search in the deprecated doctorName field
    const entities = await this.repository.createQueryBuilder('schedule')
      .where('LOWER(schedule.doctorName) LIKE LOWER(:doctorName)', { 
        doctorName: `%${doctorName}%` 
      })
      .orderBy('schedule.date', 'ASC')
      .addOrderBy('schedule.time', 'ASC')
      .getMany();
      
    return entities.map(this.toDomain);
  }

  async getByDoctorId(doctorId: string): Promise<Schedule[]> {
    const entities = await this.repository.find({
      where: { doctorId },
      order: { date: 'ASC', time: 'ASC' },
    });
    return entities.map(this.toDomain);
  }

  async getTodaySchedules(): Promise<Schedule[]> {
    const today = new Date().toISOString().split('T')[0];
    return this.getByDate(today);
  }

  async getTodayFirstDoctor(): Promise<Schedule | undefined> {
    const today = new Date().toISOString().split('T')[0];
    const entity = await this.repository.findOne({
      where: { date: today },
      order: { time: 'ASC' },
    });
    return entity ? this.toDomain(entity) : undefined;
  }

  async update(schedule: Schedule): Promise<Schedule> {
    if (!schedule.id) {
      throw new Error('Cannot update schedule without ID');
    }

    const entity = await this.repository.findOne({ 
      where: { id: schedule.id.value } 
    });
    
    if (!entity) {
      throw new Error(`Schedule with ID ${schedule.id.value} not found`);
    }

    // Update entity with new values
    entity.doctorId = schedule.doctorIdString;
    entity.date = schedule.dateString;
    entity.time = schedule.timeString;
    entity.updatedAt = new Date();

    const savedEntity = await this.repository.save(entity);
    return this.toDomain(savedEntity);
  }

  async delete(id: ScheduleId): Promise<boolean> {
    const result = await this.repository.delete({ id: id.value });
    return (result.affected ?? 0) > 0;
  }

  async exists(id: ScheduleId): Promise<boolean> {
    const count = await this.repository.count({ 
      where: { id: id.value } 
    });
    return count > 0;
  }

  async findConflicts(schedule: Schedule): Promise<Schedule[]> {
    let query = this.repository.createQueryBuilder('schedule')
      .where('schedule.doctorId = :doctorId', { 
        doctorId: schedule.doctorIdString 
      })
      .andWhere('schedule.date = :date', { 
        date: schedule.dateString 
      });

    // If schedule has an ID, exclude it from conflicts
    if (schedule.id) {
      query = query.andWhere('schedule.id != :id', { id: schedule.id.value });
    }

    const entities = await query.getMany();
    const allSchedules = entities.map(this.toDomain);
    
    // Filter using domain logic for time conflicts
    return allSchedules.filter(existingSchedule => 
      schedule.conflictsWith(existingSchedule)
    );
  }

  async getStats(): Promise<{
    total: number;
    today: number;
    upcoming: number;
    uniqueDoctors: number;
  }> {
    const today = new Date().toISOString().split('T')[0];
    
    const [total, today_count, upcoming, uniqueDoctorsResult] = await Promise.all([
      this.repository.count(),
      this.repository.count({ where: { date: today } }),
      this.repository.count({
        where: { date: require('typeorm').MoreThanOrEqual(today) }
      }),
      this.repository.createQueryBuilder('schedule')
        .select('COUNT(DISTINCT schedule.doctorId)', 'count')
        .getRawOne()
    ]);

    return {
      total,
      today: today_count,
      upcoming,
      uniqueDoctors: parseInt(uniqueDoctorsResult?.count || '0'),
    };
  }

  /**
   * Convert TypeORM entity to domain entity
   */
  private toDomain(entity: ScheduleEntity): Schedule {
    return new Schedule(
      entity.doctorId,
      entity.date,
      entity.time,
      entity.id,
      entity.createdAt,
      entity.updatedAt
    );
  }

  /**
   * Convert domain entity to TypeORM entity (for testing/seeding)
   */
  toEntity(schedule: Schedule): Partial<ScheduleEntity> {
    return {
      id: schedule.stringId,
      doctorId: schedule.doctorIdString,
      date: schedule.dateString,
      time: schedule.timeString,
      createdAt: schedule.createdAt,
      updatedAt: schedule.updatedAt,
    };
  }
}