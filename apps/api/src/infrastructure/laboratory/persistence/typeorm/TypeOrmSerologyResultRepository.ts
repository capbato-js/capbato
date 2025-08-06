import { injectable } from 'tsyringe';
import { Repository, DataSource } from 'typeorm';
import { SerologyResult, SerologyResultId, LabRequestId } from '@nx-starter/domain';
import { ISerologyResultRepository, SerologyResultRepositoryFilter } from '@nx-starter/domain';
import { SerologyResultEntity } from './SerologyResultEntity';

@injectable()
export class TypeOrmSerologyResultRepository implements ISerologyResultRepository {
  private repository: Repository<SerologyResultEntity>;

  constructor(private dataSource: DataSource) {
    this.repository = this.dataSource.getRepository(SerologyResultEntity);
  }

  async save(serologyResult: SerologyResult): Promise<SerologyResult> {
    const entity = this.domainToEntity(serologyResult);
    const savedEntity = await this.repository.save(entity);
    return this.entityToDomain(savedEntity);
  }

  async findById(id: SerologyResultId): Promise<SerologyResult | null> {
    const entity = await this.repository.findOne({ where: { id: id.value } });
    return entity ? this.entityToDomain(entity) : null;
  }

  async findAll(filter?: SerologyResultRepositoryFilter): Promise<SerologyResult[]> {
    const query = this.repository.createQueryBuilder('serology');
    
    if (filter?.patientId) {
      query.andWhere('serology.patientId = :patientId', { patientId: filter.patientId });
    }
    
    if (filter?.labRequestId) {
      query.andWhere('serology.labRequestId = :labRequestId', { labRequestId: filter.labRequestId });
    }
    
    if (filter?.dateFrom) {
      query.andWhere('serology.dateTaken >= :dateFrom', { dateFrom: filter.dateFrom });
    }
    
    if (filter?.dateTo) {
      query.andWhere('serology.dateTaken <= :dateTo', { dateTo: filter.dateTo });
    }

    const entities = await query.getMany();
    return entities.map(entity => this.entityToDomain(entity));
  }

  async findByPatientId(patientId: string): Promise<SerologyResult[]> {
    const entities = await this.repository.find({ 
      where: { patientId },
      order: { dateTaken: 'DESC' }
    });
    return entities.map(entity => this.entityToDomain(entity));
  }

  async findByLabRequestId(labRequestId: string): Promise<SerologyResult[]> {
    const entities = await this.repository.find({ 
      where: { labRequestId },
      order: { dateTaken: 'DESC' }
    });
    return entities.map(entity => this.entityToDomain(entity));
  }

  async update(serologyResult: SerologyResult): Promise<SerologyResult> {
    const entity = this.domainToEntity(serologyResult);
    const updatedEntity = await this.repository.save(entity);
    return this.entityToDomain(updatedEntity);
  }

  async delete(id: SerologyResultId): Promise<void> {
    await this.repository.delete(id.value);
  }

  private domainToEntity(serologyResult: SerologyResult): Partial<SerologyResultEntity> {
    return {
      id: serologyResult.id?.value,
      labRequestId: serologyResult.labRequestId.value,
      patientId: serologyResult.patientId,
      patientName: serologyResult.patientName,
      age: serologyResult.age,
      sex: serologyResult.sex,
      dateTaken: serologyResult.dateTaken,
      vdrl: serologyResult.vdrl,
      rpr: serologyResult.rpr,
      hbsag: serologyResult.hbsag,
      antiHcv: serologyResult.antiHcv,
      hivTest: serologyResult.hivTest,
      pregnancyTest: serologyResult.pregnancyTest,
      dengueNs1: serologyResult.dengueNs1,
      dengueTourniquet: serologyResult.dengueTourniquet,
      weilFelix: serologyResult.weilFelix,
      typhidot: serologyResult.typhidot,
      bloodType: serologyResult.bloodType,
      rhFactor: serologyResult.rhFactor,
      others: serologyResult.others,
      createdAt: serologyResult.createdAt,
      updatedAt: serologyResult.updatedAt,
    };
  }

  private entityToDomain(entity: SerologyResultEntity): SerologyResult {
    return SerologyResult.fromPersistence(
      new LabRequestId(entity.labRequestId),
      entity.patientId,
      entity.patientName,
      entity.dateTaken,
      {
        age: entity.age,
        sex: entity.sex,
        vdrl: entity.vdrl,
        rpr: entity.rpr,
        hbsag: entity.hbsag,
        antiHcv: entity.antiHcv,
        hivTest: entity.hivTest,
        pregnancyTest: entity.pregnancyTest,
        dengueNs1: entity.dengueNs1,
        dengueTourniquet: entity.dengueTourniquet,
        weilFelix: entity.weilFelix,
        typhidot: entity.typhidot,
        bloodType: entity.bloodType,
        rhFactor: entity.rhFactor,
        others: entity.others,
      },
      entity.id,
      entity.createdAt,
      entity.updatedAt
    );
  }
}
