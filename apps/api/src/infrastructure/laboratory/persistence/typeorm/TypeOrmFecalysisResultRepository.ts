import { injectable } from 'tsyringe';
import { Repository, DataSource } from 'typeorm';
import { FecalysisResult, FecalysisResultId, LabRequestId } from '@nx-starter/domain';
import { IFecalysisResultRepository, FecalysisResultRepositoryFilter } from '@nx-starter/domain';
import { FecalysisResultEntity } from './FecalysisResultEntity';

@injectable()
export class TypeOrmFecalysisResultRepository implements IFecalysisResultRepository {
  private repository: Repository<FecalysisResultEntity>;

  constructor(private dataSource: DataSource) {
    this.repository = this.dataSource.getRepository(FecalysisResultEntity);
  }

  async save(fecalysisResult: FecalysisResult): Promise<FecalysisResult> {
    const entity = this.domainToEntity(fecalysisResult);
    const savedEntity = await this.repository.save(entity);
    return this.entityToDomain(savedEntity);
  }

  async findById(id: FecalysisResultId): Promise<FecalysisResult | null> {
    const entity = await this.repository.findOne({ where: { id: id.value } });
    return entity ? this.entityToDomain(entity) : null;
  }

  async findAll(filter?: FecalysisResultRepositoryFilter): Promise<FecalysisResult[]> {
    const query = this.repository.createQueryBuilder('fecalysis');
    
    if (filter?.patientId) {
      query.andWhere('fecalysis.patientId = :patientId', { patientId: filter.patientId });
    }
    
    if (filter?.labRequestId) {
      query.andWhere('fecalysis.labRequestId = :labRequestId', { labRequestId: filter.labRequestId });
    }
    
    if (filter?.dateFrom) {
      query.andWhere('fecalysis.dateTaken >= :dateFrom', { dateFrom: filter.dateFrom });
    }
    
    if (filter?.dateTo) {
      query.andWhere('fecalysis.dateTaken <= :dateTo', { dateTo: filter.dateTo });
    }

    const entities = await query.getMany();
    return entities.map(entity => this.entityToDomain(entity));
  }

  async findByPatientId(patientId: string): Promise<FecalysisResult[]> {
    const entities = await this.repository.find({ 
      where: { patientId },
      order: { dateTaken: 'DESC' }
    });
    return entities.map(entity => this.entityToDomain(entity));
  }

  async findByLabRequestId(labRequestId: string): Promise<FecalysisResult[]> {
    const entities = await this.repository.find({ 
      where: { labRequestId },
      order: { dateTaken: 'DESC' }
    });
    return entities.map(entity => this.entityToDomain(entity));
  }

  async update(fecalysisResult: FecalysisResult): Promise<FecalysisResult> {
    const entity = this.domainToEntity(fecalysisResult);
    const updatedEntity = await this.repository.save(entity);
    return this.entityToDomain(updatedEntity);
  }

  async delete(id: FecalysisResultId): Promise<void> {
    await this.repository.delete(id.value);
  }

  private domainToEntity(fecalysisResult: FecalysisResult): Partial<FecalysisResultEntity> {
    return {
      id: fecalysisResult.id?.value,
      labRequestId: fecalysisResult.labRequestId.value,
      patientId: fecalysisResult.patientId,
      patientName: fecalysisResult.patientName,
      age: fecalysisResult.age,
      sex: fecalysisResult.sex,
      dateTaken: fecalysisResult.dateTaken,
      color: fecalysisResult.color,
      consistency: fecalysisResult.consistency,
      rbc: fecalysisResult.rbc,
      wbc: fecalysisResult.wbc,
      occultBlood: fecalysisResult.occultBlood,
      urobilinogen: fecalysisResult.urobilinogen,
      others: fecalysisResult.others,
      createdAt: fecalysisResult.createdAt,
      updatedAt: fecalysisResult.updatedAt,
    };
  }

  private entityToDomain(entity: FecalysisResultEntity): FecalysisResult {
    return FecalysisResult.fromPersistence(
      new LabRequestId(entity.labRequestId),
      entity.patientId,
      entity.patientName,
      entity.dateTaken,
      {
        age: entity.age,
        sex: entity.sex,
        color: entity.color,
        consistency: entity.consistency,
        rbc: entity.rbc,
        wbc: entity.wbc,
        occultBlood: entity.occultBlood,
        urobilinogen: entity.urobilinogen,
        others: entity.others,
      },
      entity.id,
      entity.createdAt,
      entity.updatedAt
    );
  }
}
