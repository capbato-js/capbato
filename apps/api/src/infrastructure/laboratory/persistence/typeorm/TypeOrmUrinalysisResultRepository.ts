import { injectable } from 'tsyringe';
import { Repository, DataSource } from 'typeorm';
import { UrinalysisResult, UrinalysisResultId, LabRequestId } from '@nx-starter/domain';
import { IUrinalysisResultRepository, UrinalysisResultRepositoryFilter } from '@nx-starter/domain';
import { UrinalysisResultEntity } from './UrinalysisResultEntity';

@injectable()
export class TypeOrmUrinalysisResultRepository implements IUrinalysisResultRepository {
  private repository: Repository<UrinalysisResultEntity>;

  constructor(private dataSource: DataSource) {
    this.repository = this.dataSource.getRepository(UrinalysisResultEntity);
  }

  async save(urinalysisResult: UrinalysisResult): Promise<UrinalysisResult> {
    const entity = this.domainToEntity(urinalysisResult);
    const savedEntity = await this.repository.save(entity);
    return this.entityToDomain(savedEntity);
  }

  async findById(id: UrinalysisResultId): Promise<UrinalysisResult | null> {
    const entity = await this.repository.findOne({ where: { id: id.value } });
    return entity ? this.entityToDomain(entity) : null;
  }

  async findAll(filter?: UrinalysisResultRepositoryFilter): Promise<UrinalysisResult[]> {
    const query = this.repository.createQueryBuilder('urinalysis');
    
    if (filter?.patientId) {
      query.andWhere('urinalysis.patientId = :patientId', { patientId: filter.patientId });
    }
    
    if (filter?.labRequestId) {
      query.andWhere('urinalysis.labRequestId = :labRequestId', { labRequestId: filter.labRequestId });
    }
    
    if (filter?.dateFrom) {
      query.andWhere('urinalysis.dateTaken >= :dateFrom', { dateFrom: filter.dateFrom });
    }
    
    if (filter?.dateTo) {
      query.andWhere('urinalysis.dateTaken <= :dateTo', { dateTo: filter.dateTo });
    }

    const entities = await query.getMany();
    return entities.map(entity => this.entityToDomain(entity));
  }

  async findByPatientId(patientId: string): Promise<UrinalysisResult[]> {
    const entities = await this.repository.find({ 
      where: { patientId },
      order: { dateTaken: 'DESC' }
    });
    return entities.map(entity => this.entityToDomain(entity));
  }

  async findByLabRequestId(labRequestId: string): Promise<UrinalysisResult[]> {
    const entities = await this.repository.find({ 
      where: { labRequestId },
      order: { dateTaken: 'DESC' }
    });
    return entities.map(entity => this.entityToDomain(entity));
  }

  async update(urinalysisResult: UrinalysisResult): Promise<UrinalysisResult> {
    const entity = this.domainToEntity(urinalysisResult);
    const updatedEntity = await this.repository.save(entity);
    return this.entityToDomain(updatedEntity);
  }

  async delete(id: UrinalysisResultId): Promise<void> {
    await this.repository.delete(id.value);
  }

  private domainToEntity(urinalysisResult: UrinalysisResult): Partial<UrinalysisResultEntity> {
    return {
      id: urinalysisResult.id?.value,
      labRequestId: urinalysisResult.labRequestId.value,
      patientId: urinalysisResult.patientId,
      patientName: urinalysisResult.patientName,
      age: urinalysisResult.age,
      sex: urinalysisResult.sex,
      dateTaken: urinalysisResult.dateTaken,
      color: urinalysisResult.color,
      transparency: urinalysisResult.transparency,
      specificGravity: urinalysisResult.specificGravity,
      ph: urinalysisResult.ph,
      protein: urinalysisResult.protein,
      glucose: urinalysisResult.glucose,
      epithelialCells: urinalysisResult.epithelialCells,
      redCells: urinalysisResult.redCells,
      pusCells: urinalysisResult.pusCells,
      mucusThread: urinalysisResult.mucusThread,
      amorphousUrates: urinalysisResult.amorphousUrates,
      amorphousPhosphate: urinalysisResult.amorphousPhosphate,
      crystals: urinalysisResult.crystals,
      bacteria: urinalysisResult.bacteria,
      others: urinalysisResult.others,
      pregnancyTest: urinalysisResult.pregnancyTest,
      createdAt: urinalysisResult.createdAt,
      updatedAt: urinalysisResult.updatedAt,
    };
  }

  private entityToDomain(entity: UrinalysisResultEntity): UrinalysisResult {
    return UrinalysisResult.fromPersistence(
      new LabRequestId(entity.labRequestId),
      entity.patientId,
      entity.patientName,
      entity.dateTaken,
      {
        age: entity.age,
        sex: entity.sex,
        color: entity.color,
        transparency: entity.transparency,
        specificGravity: entity.specificGravity,
        ph: entity.ph,
        protein: entity.protein,
        glucose: entity.glucose,
        redCells: entity.redCells,
        pusCells: entity.pusCells,
        epithelialCells: entity.epithelialCells,
        bacteria: entity.bacteria,
        amorphousUrates: entity.amorphousUrates,
        others: entity.others,
      },
      entity.id,
      entity.createdAt,
      entity.updatedAt,
    );
  }
}
