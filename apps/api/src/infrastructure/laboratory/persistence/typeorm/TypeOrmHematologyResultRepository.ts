import { injectable } from 'tsyringe';
import { Repository, DataSource } from 'typeorm';
import { HematologyResult, HematologyResultId, LabRequestId } from '@nx-starter/domain';
import { IHematologyResultRepository, HematologyResultRepositoryFilter } from '@nx-starter/domain';
import { HematologyResultEntity } from './HematologyResultEntity';

@injectable()
export class TypeOrmHematologyResultRepository implements IHematologyResultRepository {
  private repository: Repository<HematologyResultEntity>;

  constructor(private dataSource: DataSource) {
    this.repository = this.dataSource.getRepository(HematologyResultEntity);
  }

  async save(hematologyResult: HematologyResult): Promise<HematologyResult> {
    const entity = this.domainToEntity(hematologyResult);
    const savedEntity = await this.repository.save(entity);
    return this.entityToDomain(savedEntity);
  }

  async findById(id: HematologyResultId): Promise<HematologyResult | null> {
    const entity = await this.repository.findOne({ where: { id: id.value } });
    return entity ? this.entityToDomain(entity) : null;
  }

  async findAll(filter?: HematologyResultRepositoryFilter): Promise<HematologyResult[]> {
    const query = this.repository.createQueryBuilder('hematology');
    
    if (filter?.patientId) {
      query.andWhere('hematology.patientId = :patientId', { patientId: filter.patientId });
    }
    
    if (filter?.labRequestId) {
      query.andWhere('hematology.labRequestId = :labRequestId', { labRequestId: filter.labRequestId });
    }
    
    if (filter?.dateFrom) {
      query.andWhere('hematology.dateTaken >= :dateFrom', { dateFrom: filter.dateFrom });
    }
    
    if (filter?.dateTo) {
      query.andWhere('hematology.dateTaken <= :dateTo', { dateTo: filter.dateTo });
    }

    const entities = await query.getMany();
    return entities.map(entity => this.entityToDomain(entity));
  }

  async findByPatientId(patientId: string): Promise<HematologyResult[]> {
    const entities = await this.repository.find({ 
      where: { patientId },
      order: { dateTaken: 'DESC' }
    });
    return entities.map(entity => this.entityToDomain(entity));
  }

  async findByLabRequestId(labRequestId: string): Promise<HematologyResult[]> {
    const entities = await this.repository.find({ 
      where: { labRequestId },
      order: { dateTaken: 'DESC' }
    });
    return entities.map(entity => this.entityToDomain(entity));
  }

  async update(hematologyResult: HematologyResult): Promise<HematologyResult> {
    const entity = this.domainToEntity(hematologyResult);
    const updatedEntity = await this.repository.save(entity);
    return this.entityToDomain(updatedEntity);
  }

  async delete(id: HematologyResultId): Promise<void> {
    await this.repository.delete(id.value);
  }

  private domainToEntity(hematologyResult: HematologyResult): Partial<HematologyResultEntity> {
    return {
      id: hematologyResult.id?.value,
      labRequestId: hematologyResult.labRequestId.value,
      patientId: hematologyResult.patientId,
      patientName: hematologyResult.patientName,
      age: hematologyResult.age,
      sex: hematologyResult.sex,
      dateTaken: hematologyResult.dateTaken,
      hemoglobin: hematologyResult.hemoglobin,
      hematocrit: hematologyResult.hematocrit,
      rbc: hematologyResult.rbc,
      wbc: hematologyResult.wbc,
      plateletCount: hematologyResult.plateletCount,
      neutrophils: hematologyResult.neutrophils,
      lymphocytes: hematologyResult.lymphocytes,
      monocytes: hematologyResult.monocytes,
      eosinophils: hematologyResult.eosinophils,
      basophils: hematologyResult.basophils,
      mcv: hematologyResult.mcv,
      mch: hematologyResult.mch,
      mchc: hematologyResult.mchc,
      esr: hematologyResult.esr,
      createdAt: hematologyResult.createdAt,
      updatedAt: hematologyResult.updatedAt,
    };
  }

  private entityToDomain(entity: HematologyResultEntity): HematologyResult {
    return HematologyResult.fromPersistence(
      new LabRequestId(entity.labRequestId),
      entity.patientId,
      entity.patientName,
      entity.dateTaken,
      {
        age: entity.age,
        sex: entity.sex,
        hemoglobin: entity.hemoglobin,
        hematocrit: entity.hematocrit,
        rbc: entity.rbc,
        wbc: entity.wbc,
        plateletCount: entity.plateletCount,
        neutrophils: entity.neutrophils,
        lymphocytes: entity.lymphocytes,
        monocytes: entity.monocytes,
        eosinophils: entity.eosinophils,
        basophils: entity.basophils,
        mcv: entity.mcv,
        mch: entity.mch,
        mchc: entity.mchc,
        esr: entity.esr,
      },
      entity.id,
      entity.createdAt,
      entity.updatedAt
    );
  }
}
