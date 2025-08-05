import { injectable } from 'tsyringe';
import { Repository, DataSource } from 'typeorm';
import { Prescription } from '@nx-starter/domain';
import type { IPrescriptionRepository } from '@nx-starter/domain';
import { PrescriptionEntity } from './PrescriptionEntity';
import { PrescriptionMapper } from '@nx-starter/application-shared';
import { generateUUID } from '@nx-starter/utils-core';

/**
 * TypeORM implementation of IPrescriptionRepository
 * Supports MySQL, PostgreSQL, SQLite via TypeORM
 */
@injectable()
export class TypeOrmPrescriptionRepository implements IPrescriptionRepository {
  private repository: Repository<PrescriptionEntity>;

  constructor(private dataSource: DataSource) {
    this.repository = this.dataSource.getRepository(PrescriptionEntity);
  }

  async getAll(): Promise<Prescription[]> {
    const entities = await this.repository.find({
      order: { createdAt: 'DESC' },
    });
    return entities.map(this.toDomain);
  }

  async create(prescription: Prescription): Promise<string> {
    const id = generateUUID();
    const entity = this.repository.create({
      id,
      patientId: prescription.patientId,
      doctorId: prescription.doctorId,
      medicationName: prescription.medicationNameValue,
      dosage: prescription.dosageValue,
      instructions: prescription.instructionsValue,
      prescribedDate: prescription.prescribedDate,
      expiryDate: prescription.expiryDate,
      isActive: prescription.isActive,
      createdAt: prescription.createdAt,
    });

    await this.repository.save(entity);
    return id;
  }

  async update(id: string, changes: Partial<Prescription>): Promise<void> {
    const entity = await this.repository.findOne({ where: { id } });
    if (!entity) {
      throw new Error(`Prescription with ID ${id} not found`);
    }

    const updateData: Partial<PrescriptionEntity> = {};

    if (changes.medicationName) {
      updateData.medicationName = changes.medicationName.value;
    }

    if (changes.dosage) {
      updateData.dosage = changes.dosage.value;
    }

    if (changes.instructions) {
      updateData.instructions = changes.instructions.value;
    }

    if (changes.expiryDate !== undefined) {
      updateData.expiryDate = changes.expiryDate;
    }

    if (changes.isActive !== undefined) {
      updateData.isActive = changes.isActive;
    }

    await this.repository.update(id, updateData);
  }

  async delete(id: string): Promise<void> {
    const result = await this.repository.delete(id);
    if (result.affected === 0) {
      throw new Error(`Prescription with ID ${id} not found`);
    }
  }

  async getById(id: string): Promise<Prescription | undefined> {
    const entity = await this.repository.findOne({ where: { id } });
    return entity ? this.toDomain(entity) : undefined;
  }

  async getByPatientId(patientId: string): Promise<Prescription[]> {
    const entities = await this.repository.find({
      where: { patientId },
      order: { createdAt: 'DESC' },
    });
    return entities.map(this.toDomain);
  }

  async getByDoctorId(doctorId: string): Promise<Prescription[]> {
    const entities = await this.repository.find({
      where: { doctorId },
      order: { createdAt: 'DESC' },
    });
    return entities.map(this.toDomain);
  }

  async getActive(): Promise<Prescription[]> {
    const entities = await this.repository.find({
      where: { isActive: true },
      order: { createdAt: 'DESC' },
    });
    return entities.map(this.toDomain);
  }

  async getExpired(): Promise<Prescription[]> {
    const currentDate = new Date();
    const entities = await this.repository
      .createQueryBuilder('prescription')
      .where('prescription.expiryDate < :currentDate', { currentDate })
      .orderBy('prescription.createdAt', 'DESC')
      .getMany();
    return entities.map(this.toDomain);
  }

  async getByMedicationName(medicationName: string): Promise<Prescription[]> {
    const entities = await this.repository.find({
      where: { medicationName },
      order: { createdAt: 'DESC' },
    });
    return entities.map(this.toDomain);
  }

  /**
   * Maps database entity to domain entity
   */
  private toDomain(entity: PrescriptionEntity): Prescription {
    return PrescriptionMapper.fromPlainObject({
      id: entity.id,
      patientId: entity.patientId,
      doctorId: entity.doctorId,
      medicationName: entity.medicationName,
      dosage: entity.dosage,
      instructions: entity.instructions,
      prescribedDate: entity.prescribedDate,
      expiryDate: entity.expiryDate,
      isActive: entity.isActive,
      createdAt: entity.createdAt,
    });
  }
}