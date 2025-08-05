import { injectable } from 'tsyringe';
import { Repository, DataSource } from 'typeorm';
import { 
  IBloodChemistryRepository,
  BloodChemistryRepositoryFilter,
  BloodChemistry,
  BloodChemistryId,
  BloodChemistryPatientInfo,
  BloodChemistryResults
} from '@nx-starter/domain';
import { generateId } from '@nx-starter/utils-core';
import { BloodChemistryEntity } from './BloodChemistryEntity';

@injectable()
export class TypeOrmBloodChemistryRepository implements IBloodChemistryRepository {
  private readonly repository: Repository<BloodChemistryEntity>;

  constructor(private dataSource: DataSource) {
    this.repository = this.dataSource.getRepository(BloodChemistryEntity);
  }

  async save(bloodChemistry: BloodChemistry): Promise<BloodChemistry> {
    const entity = this.domainToEntity(bloodChemistry);
    // Generate ID if not present (for new entities)
    if (!entity.id) {
      entity.id = generateId();
    }
    const savedEntity = await this.repository.save(entity);
    return this.entityToDomain(savedEntity);
  }

  async findById(id: BloodChemistryId): Promise<BloodChemistry | null> {
    const entity = await this.repository.findOne({
      where: { id: id.value }
    });
    return entity ? this.entityToDomain(entity) : null;
  }

  async findAll(filter?: BloodChemistryRepositoryFilter): Promise<BloodChemistry[]> {
    const queryBuilder = this.repository.createQueryBuilder('blood_chem');

    if (filter?.status) {
      queryBuilder.where('blood_chem.status = :status', { status: filter.status });
    }

    if (filter?.patientId) {
      queryBuilder.andWhere('blood_chem.patientId = :patientId', { 
        patientId: filter.patientId 
      });
    }

    if (filter?.dateFrom && filter?.dateTo) {
      queryBuilder.andWhere('blood_chem.requestDate BETWEEN :dateFrom AND :dateTo', {
        dateFrom: filter.dateFrom,
        dateTo: filter.dateTo
      });
    }

    const entities = await queryBuilder
      .orderBy('blood_chem.requestDate', 'DESC')
      .getMany();

    return entities.map(entity => this.entityToDomain(entity));
  }

  async findByPatientId(patientId: string): Promise<BloodChemistry[]> {
    const entities = await this.repository.find({
      where: { patientId },
      order: { requestDate: 'DESC' }
    });
    return entities.map(entity => this.entityToDomain(entity));
  }

  async findCompleted(): Promise<BloodChemistry[]> {
    const entities = await this.repository.find({
      where: { status: 'complete' },
      order: { requestDate: 'DESC' }
    });
    return entities.map(entity => this.entityToDomain(entity));
  }

  async update(bloodChemistry: BloodChemistry): Promise<BloodChemistry> {
    if (!bloodChemistry.id) {
      throw new Error('Blood chemistry must have an ID to update');
    }

    const entity = this.domainToEntity(bloodChemistry);
    await this.repository.update({ id: bloodChemistry.id.value }, entity);
    
    const updatedEntity = await this.repository.findOne({
      where: { id: bloodChemistry.id.value }
    });
    
    if (!updatedEntity) {
      throw new Error('Failed to update blood chemistry');
    }

    return this.entityToDomain(updatedEntity);
  }

  async delete(id: BloodChemistryId): Promise<void> {
    await this.repository.delete({ id: id.value });
  }

  private domainToEntity(bloodChemistry: BloodChemistry): Partial<BloodChemistryEntity> {
    const entity: Partial<BloodChemistryEntity> = {
      patientId: `BC-${Date.now()}`, // Generate a simple patient ID since it's not in the domain
      patientName: bloodChemistry.patientInfo.patientName,
      ageGender: `${bloodChemistry.patientInfo.age}/${bloodChemistry.patientInfo.sex}`,
      requestDate: bloodChemistry.dateTaken, // Use dateTaken as requestDate for now
      status: 'complete', // Default status since BloodChemistry doesn't have status
      dateTaken: bloodChemistry.dateTaken,
      others: '', // Default empty since not in domain
      createdAt: bloodChemistry.createdAt,
      updatedAt: bloodChemistry.updatedAt
    };

    // Map results to entity fields - convert numbers to strings for database
    const results = bloodChemistry.results.results;
    entity.fbs = results.fbs?.toString();
    entity.bun = results.bun?.toString();
    entity.creatinine = results.creatinine?.toString();
    entity.bloodUricAcid = results.uricAcid?.toString(); // Map uricAcid to bloodUricAcid
    entity.lipidProfile = results.cholesterol ? `Cholesterol: ${results.cholesterol}` : undefined; // Composite field
    entity.sgot = results.sgot?.toString();
    entity.sgpt = results.sgpt?.toString();
    entity.alp = results.alkPhosphatase?.toString(); // Map alkPhosphatase to alp
    entity.sodiumNa = results.sodium?.toString(); // Map sodium to sodiumNa
    entity.potassiumK = results.potassium?.toString(); // Map potassium to potassiumK
    entity.hbalc = results.hbalc?.toString();

    if (bloodChemistry.id) {
      entity.id = bloodChemistry.id.value;
    }

    return entity;
  }

  private entityToDomain(entity: BloodChemistryEntity): BloodChemistry {
    const patientInfo = new BloodChemistryPatientInfo({
      patientName: entity.patientName,
      age: parseInt(entity.ageGender.split('/')[0]) || 0,
      sex: entity.ageGender.split('/')[1] || 'unknown'
    });

    const results = new BloodChemistryResults({
      fbs: entity.fbs ? parseFloat(entity.fbs) : undefined,
      bun: entity.bun ? parseFloat(entity.bun) : undefined,
      creatinine: entity.creatinine ? parseFloat(entity.creatinine) : undefined,
      uricAcid: entity.bloodUricAcid ? parseFloat(entity.bloodUricAcid) : undefined,
      cholesterol: entity.lipidProfile ? parseFloat(entity.lipidProfile.replace(/[^\d.]/g, '')) || undefined : undefined,
      sgot: entity.sgot ? parseFloat(entity.sgot) : undefined,
      sgpt: entity.sgpt ? parseFloat(entity.sgpt) : undefined,
      alkPhosphatase: entity.alp ? parseFloat(entity.alp) : undefined,
      sodium: entity.sodiumNa ? parseFloat(entity.sodiumNa) : undefined,
      potassium: entity.potassiumK ? parseFloat(entity.potassiumK) : undefined,
      hbalc: entity.hbalc ? parseFloat(entity.hbalc) : undefined
    });

    return BloodChemistry.reconstruct(
      entity.id, // ID is already a string (dashless UUID)
      patientInfo,
      entity.dateTaken || entity.requestDate,
      results,
      entity.createdAt,
      entity.updatedAt
    );
  }
}
