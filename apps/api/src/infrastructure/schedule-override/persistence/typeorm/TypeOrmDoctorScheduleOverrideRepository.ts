import { Repository, DataSource, Between } from 'typeorm';
import { injectable } from 'tsyringe';
import { DoctorScheduleOverride } from '@nx-starter/domain';
import type { IDoctorScheduleOverrideRepository } from '@nx-starter/domain';
import { ScheduleOverrideMapper } from '@nx-starter/application-shared';
import { DoctorScheduleOverrideEntity } from './DoctorScheduleOverrideEntity';

/**
 * TypeORM implementation of IDoctorScheduleOverrideRepository
 * Handles persistence operations for schedule overrides using TypeORM
 */
@injectable()
export class TypeOrmDoctorScheduleOverrideRepository implements IDoctorScheduleOverrideRepository {
  private repository: Repository<DoctorScheduleOverrideEntity>;

  constructor(private dataSource: DataSource) {
    this.repository = this.dataSource.getRepository(DoctorScheduleOverrideEntity);
  }

  async getAll(): Promise<DoctorScheduleOverride[]> {
    const entities = await this.repository.find({
      order: { date: 'ASC' }
    });
    return entities.map(entity => this.toDomain(entity));
  }

  async getByDate(date: string): Promise<DoctorScheduleOverride | null> {
    console.log('getByDate called with date:', date);
    const entity = await this.repository.findOne({
      where: { date }
    });
    console.log('Found entity:', entity);
    return entity ? this.toDomain(entity) : null;
  }

  async getByDateRange(startDate: string, endDate: string): Promise<DoctorScheduleOverride[]> {
    const entities = await this.repository.find({
      where: {
        date: Between(startDate, endDate)
      },
      order: { date: 'ASC' }
    });
    return entities.map(entity => this.toDomain(entity));
  }

  async getByDoctorId(doctorId: string): Promise<DoctorScheduleOverride[]> {
    const entities = await this.repository.find({
      where: { assignedDoctorId: doctorId },
      order: { date: 'ASC' }
    });
    return entities.map(entity => this.toDomain(entity));
  }

  async getById(id: string): Promise<DoctorScheduleOverride | null> {
    const entity = await this.repository.findOne({
      where: { id }
    });
    return entity ? this.toDomain(entity) : null;
  }

  async create(override: DoctorScheduleOverride): Promise<DoctorScheduleOverride> {
    const entity = this.toEntity(override);
    const savedEntity = await this.repository.save(entity);
    return this.toDomain(savedEntity);
  }

  async update(override: DoctorScheduleOverride): Promise<DoctorScheduleOverride> {
    const entity = this.toEntity(override);
    
    // Use update() method to update existing record, then fetch the updated entity
    await this.repository.update(entity.id, {
      date: entity.date,
      originalDoctorId: entity.originalDoctorId,
      assignedDoctorId: entity.assignedDoctorId,
      reason: entity.reason,
      updatedAt: entity.updatedAt
    });
    
    // Fetch the updated entity
    const updatedEntity = await this.repository.findOne({
      where: { id: entity.id }
    });
    
    if (!updatedEntity) {
      throw new Error(`Schedule override with ID ${entity.id} not found after update`);
    }
    
    return this.toDomain(updatedEntity);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async deleteByDate(date: string): Promise<void> {
    await this.repository.delete({ date });
  }

  async existsByDate(date: string): Promise<boolean> {
    const count = await this.repository.count({
      where: { date }
    });
    return count > 0;
  }

  async getByDates(dates: string[]): Promise<DoctorScheduleOverride[]> {
    if (dates.length === 0) {
      return [];
    }

    const entities = await this.repository
      .createQueryBuilder('override')
      .where('override.date IN (:...dates)', { dates })
      .orderBy('override.date', 'ASC')
      .getMany();

    return entities.map(entity => this.toDomain(entity));
  }

  /**
   * Convert domain entity to TypeORM entity
   */
  private toEntity(domain: DoctorScheduleOverride): DoctorScheduleOverrideEntity {
    const entity = new DoctorScheduleOverrideEntity();
    entity.id = domain.id;
    entity.date = domain.date.value;
    entity.originalDoctorId = domain.originalDoctorId?.value || null;
    entity.assignedDoctorId = domain.assignedDoctorId.value;
    entity.reason = domain.reason.value;
    entity.createdAt = domain.createdAt;
    entity.updatedAt = domain.updatedAt;
    return entity;
  }

  /**
   * Convert TypeORM entity to domain entity
   */
  private toDomain(entity: DoctorScheduleOverrideEntity): DoctorScheduleOverride {
    return ScheduleOverrideMapper.fromPlainObject({
      id: entity.id,
      date: entity.date,
      originalDoctorId: entity.originalDoctorId,
      assignedDoctorId: entity.assignedDoctorId,
      reason: entity.reason,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  }
}
