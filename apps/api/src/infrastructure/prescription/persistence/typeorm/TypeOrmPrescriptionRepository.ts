import { injectable } from 'tsyringe';
import { Repository, DataSource } from 'typeorm';
import { Prescription, Medication } from '@nx-starter/domain';
import type { IPrescriptionRepository } from '@nx-starter/domain';
import { PrescriptionEntity } from './PrescriptionEntity';
import { MedicationEntity } from './MedicationEntity';
import { generateId } from '@nx-starter/utils-core';

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
      relations: ['medications'],
      order: { createdAt: 'DESC' },
    });
    return entities.map(entity => this.toDomain(entity));
  }

  async create(prescription: Prescription): Promise<string> {
    const id = generateId();
    
    // Create prescription entity
    const prescriptionEntity = this.repository.create({
      id,
      patientId: prescription.patientId,
      doctorId: prescription.doctorId,
      prescribedDate: prescription.prescribedDate,
      expiryDate: prescription.expiryDate,
      quantity: prescription.quantity,
      additionalNotes: prescription.additionalNotes,
      status: prescription.status,
      createdAt: prescription.createdAt,
    });

    // Create medication entities
    const medicationEntities: MedicationEntity[] = prescription.medications.map(medication => {
      const medicationEntity = new MedicationEntity();
      medicationEntity.id = generateId();
      medicationEntity.prescriptionId = id;
      medicationEntity.prescription = prescriptionEntity;
      medicationEntity.medicationName = medication.medicationNameValue;
      medicationEntity.dosage = medication.dosageValue;
      medicationEntity.instructions = medication.instructionsValue;
      medicationEntity.frequency = medication.frequency;
      medicationEntity.duration = medication.duration;
      return medicationEntity;
    });

    prescriptionEntity.medications = medicationEntities;

    await this.repository.save(prescriptionEntity);
    return id;
  }

  async update(id: string, changes: Partial<Prescription>): Promise<void> {
    const entity = await this.repository.findOne({ 
      where: { id }, 
      relations: ['medications'] 
    });
    if (!entity) {
      throw new Error(`Prescription with ID ${id} not found`);
    }

    const updateData: Partial<PrescriptionEntity> = {};

    // Handle medications update
    if (changes.medications !== undefined) {
      // Remove existing medications
      const medicationRepository = this.dataSource.getRepository(MedicationEntity);
      await medicationRepository.delete({ prescriptionId: id });

      // Create new medications
      const newMedicationEntities: MedicationEntity[] = changes.medications.map(medication => {
        const medicationEntity = new MedicationEntity();
        medicationEntity.id = generateId();
        medicationEntity.prescriptionId = id;
        medicationEntity.medicationName = medication.medicationNameValue;
        medicationEntity.dosage = medication.dosageValue;
        medicationEntity.instructions = medication.instructionsValue;
        medicationEntity.frequency = medication.frequency;
        medicationEntity.duration = medication.duration;
        return medicationEntity;
      });

      entity.medications = newMedicationEntities;
    }

    if (changes.expiryDate !== undefined) {
      updateData.expiryDate = changes.expiryDate;
    }

    if (changes.quantity !== undefined) {
      updateData.quantity = changes.quantity;
    }

    if (changes.additionalNotes !== undefined) {
      updateData.additionalNotes = changes.additionalNotes;
    }

    if (changes.status !== undefined) {
      updateData.status = changes.status;
    }

    // Update prescription entity
    await this.repository.update(id, updateData);
    
    // Save medications if they were updated
    if (changes.medications !== undefined) {
      await this.repository.save(entity);
    }
  }

  async delete(id: string): Promise<void> {
    const result = await this.repository.delete(id);
    if (result.affected === 0) {
      throw new Error(`Prescription with ID ${id} not found`);
    }
  }

  async getById(id: string): Promise<Prescription | undefined> {
    const entity = await this.repository.findOne({ 
      where: { id },
      relations: ['medications']
    });
    return entity ? this.toDomain(entity) : undefined;
  }

  async getByPatientId(patientId: string): Promise<Prescription[]> {
    const entities = await this.repository.find({
      where: { patientId },
      relations: ['medications'],
      order: { createdAt: 'DESC' },
    });
    return entities.map(entity => this.toDomain(entity));
  }

  async getByDoctorId(doctorId: string): Promise<Prescription[]> {
    const entities = await this.repository.find({
      where: { doctorId },
      relations: ['medications'],
      order: { createdAt: 'DESC' },
    });
    return entities.map(entity => this.toDomain(entity));
  }

  async getActive(): Promise<Prescription[]> {
    const entities = await this.repository.find({
      where: { status: 'active' },
      relations: ['medications'],
      order: { createdAt: 'DESC' },
    });
    return entities.map(entity => this.toDomain(entity));
  }

  async getByStatus(status: 'active' | 'completed' | 'discontinued' | 'on-hold'): Promise<Prescription[]> {
    const entities = await this.repository.find({
      where: { status },
      relations: ['medications'],
      order: { createdAt: 'DESC' },
    });
    return entities.map(entity => this.toDomain(entity));
  }

  async getExpired(): Promise<Prescription[]> {
    const currentDate = new Date();
    const entities = await this.repository
      .createQueryBuilder('prescription')
      .leftJoinAndSelect('prescription.medications', 'medications')
      .where('prescription.expiryDate < :currentDate', { currentDate })
      .orderBy('prescription.createdAt', 'DESC')
      .getMany();
    return entities.map(entity => this.toDomain(entity));
  }

  async getByMedicationName(medicationName: string): Promise<Prescription[]> {
    const entities = await this.repository
      .createQueryBuilder('prescription')
      .leftJoinAndSelect('prescription.medications', 'medications')
      .where('medications.medicationName LIKE :medicationName', { 
        medicationName: `%${medicationName}%` 
      })
      .orderBy('prescription.createdAt', 'DESC')
      .getMany();
    return entities.map(entity => this.toDomain(entity));
  }

  /**
   * Maps database entity to domain entity
   */
  private toDomain(entity: PrescriptionEntity): Prescription {
    // Convert medication entities to domain entities
    const medications: Medication[] = entity.medications?.map(medicationEntity => 
      new Medication(
        medicationEntity.prescriptionId,
        medicationEntity.medicationName,
        medicationEntity.dosage,
        medicationEntity.instructions,
        medicationEntity.frequency,
        medicationEntity.duration,
        medicationEntity.id
      )
    ) || [];

    return new Prescription(
      entity.patientId,
      entity.doctorId,
      medications,
      entity.prescribedDate,
      entity.id,
      entity.expiryDate,
      entity.quantity,
      entity.additionalNotes,
      entity.status as 'active' | 'completed' | 'discontinued' | 'on-hold',
      entity.createdAt
    );
  }
}