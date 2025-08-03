import { injectable } from 'tsyringe';
import { Repository, DataSource } from 'typeorm';
import { Doctor, IDoctorRepository } from '@nx-starter/domain';
import { DoctorMapper } from '@nx-starter/application-shared';
import { generateId } from '@nx-starter/utils-core';
import { DoctorEntity } from './DoctorEntity';

/**
 * TypeORM implementation of IDoctorRepository
 * Handles doctor profile persistence using TypeORM and relational databases
 * 
 * This repository manages doctor profiles that are linked to User entities
 * via userId foreign key relationships.
 */
@injectable()
export class TypeOrmDoctorRepository implements IDoctorRepository {
  private repository: Repository<DoctorEntity>;

  constructor(private dataSource: DataSource) {
    this.repository = dataSource.getRepository(DoctorEntity);
  }

  async getAll(): Promise<Doctor[]> {
    const entities = await this.repository.find();
    return entities.map(entity => this.entityToDomain(entity));
  }

  async getById(id: string): Promise<Doctor | null> {
    const entity = await this.repository.findOne({
      where: { id }
    });
    return entity ? this.entityToDomain(entity) : null;
  }

  async getByUserId(userId: string): Promise<Doctor | null> {
    const entity = await this.repository.findOne({
      where: { userId }
    });
    return entity ? this.entityToDomain(entity) : null;
  }

  async existsByUserId(userId: string): Promise<boolean> {
    const count = await this.repository.count({
      where: { userId }
    });
    return count > 0;
  }

  async getActiveDoctors(): Promise<Doctor[]> {
    const entities = await this.repository.find({
      where: { isActive: true }
    });
    return entities.map(entity => this.entityToDomain(entity));
  }

  async getBySpecialization(specialization: string): Promise<Doctor[]> {
    const entities = await this.repository.find({
      where: { specialization }
    });
    return entities.map(entity => this.entityToDomain(entity));
  }

  async create(doctor: Doctor): Promise<Doctor> {
    const plainObject = DoctorMapper.toPlainObject(doctor);
    const entity = this.repository.create({
      id: generateId(), // Generate dashless UUID manually
      userId: plainObject.userId,
      specialization: plainObject.specialization,
      licenseNumber: plainObject.licenseNumber,
      yearsOfExperience: plainObject.yearsOfExperience,
      isActive: plainObject.isActive,
    });
    
    const savedEntity = await this.repository.save(entity);
    return this.entityToDomain(savedEntity);
  }

  async update(doctor: Doctor): Promise<Doctor> {
    if (!doctor.stringId) {
      throw new Error('Doctor profile ID is required for update operation');
    }

    const plainObject = DoctorMapper.toPlainObject(doctor);
    await this.repository.update(doctor.stringId, {
      specialization: plainObject.specialization,
      licenseNumber: plainObject.licenseNumber,
      yearsOfExperience: plainObject.yearsOfExperience,
      isActive: plainObject.isActive,
    });

    const updatedEntity = await this.repository.findOne({
      where: { id: doctor.stringId }
    });

    if (!updatedEntity) {
      throw new Error(`Doctor profile with ID ${doctor.stringId} not found after update`);
    }

    return this.entityToDomain(updatedEntity);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async exists(id: string): Promise<boolean> {
    const count = await this.repository.count({
      where: { id }
    });
    return count > 0;
  }

  /**
   * Convert TypeORM entity to domain entity
   */
  private entityToDomain(entity: DoctorEntity): Doctor {
    return DoctorMapper.fromPlainObject({
      id: entity.id, // ID is already dashless since we use @PrimaryColumn('varchar') + generateId()
      userId: entity.userId,
      specialization: entity.specialization,
      licenseNumber: entity.licenseNumber,
      yearsOfExperience: entity.yearsOfExperience,
      isActive: entity.isActive,
    });
  }
}
