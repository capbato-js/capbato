import { injectable } from 'tsyringe';
import { Repository, DataSource } from 'typeorm';
import { 
  ILabRequestRepository,
  LabRequestRepositoryFilter,
  LabRequest,
  LabRequestId,
  LabRequestPatientInfo,
  LabRequestTests,
  LabRequestStatus 
} from '@nx-starter/domain';
import { generateId } from '@nx-starter/utils-core';
import { LabRequestEntity } from './LabRequestEntity';

@injectable()
export class TypeOrmLabRequestRepository implements ILabRequestRepository {
  private readonly repository: Repository<LabRequestEntity>;

  constructor(private dataSource: DataSource) {
    this.repository = this.dataSource.getRepository(LabRequestEntity);
  }

  async save(labRequest: LabRequest): Promise<LabRequest> {
    const entity = this.domainToEntity(labRequest);
    // Generate ID if not present (for new entities)
    if (!entity.id) {
      entity.id = generateId();
    }
    const savedEntity = await this.repository.save(entity);
    return this.entityToDomain(savedEntity);
  }

  async findById(id: LabRequestId): Promise<LabRequest | null> {
    const entity = await this.repository.findOne({
      where: { id: id.value }
    });
    return entity ? this.entityToDomain(entity) : null;
  }

  async findAll(filter?: LabRequestRepositoryFilter): Promise<LabRequest[]> {
    const queryBuilder = this.repository.createQueryBuilder('lab_request');

    if (filter?.status) {
      queryBuilder.where('lab_request.status = :status', { status: filter.status });
    }

    if (filter?.patientId) {
      queryBuilder.andWhere('lab_request.patientId = :patientId', { 
        patientId: filter.patientId 
      });
    }

    if (filter?.dateFrom && filter?.dateTo) {
      queryBuilder.andWhere('lab_request.requestDate BETWEEN :dateFrom AND :dateTo', {
        dateFrom: filter.dateFrom,
        dateTo: filter.dateTo
      });
    }

    const entities = await queryBuilder
      .orderBy('lab_request.requestDate', 'DESC')
      .getMany();

    return entities.map(entity => this.entityToDomain(entity));
  }

  async findByPatientId(patientId: string): Promise<LabRequest[]> {
    const entities = await this.repository.find({
      where: { patientId },
      order: { requestDate: 'DESC' }
    });
    return entities.map(entity => this.entityToDomain(entity));
  }

  async findCompleted(): Promise<LabRequest[]> {
    const entities = await this.repository.find({
      where: { status: 'complete' },
      order: { requestDate: 'DESC' }
    });
    return entities.map(entity => this.entityToDomain(entity));
  }

  async update(labRequest: LabRequest): Promise<LabRequest> {
    if (!labRequest.id) {
      throw new Error('Lab request must have an ID to update');
    }

    const entity = this.domainToEntity(labRequest);
    await this.repository.update({ id: labRequest.id.value }, entity);
    
    const updatedEntity = await this.repository.findOne({
      where: { id: labRequest.id.value }
    });
    
    if (!updatedEntity) {
      throw new Error('Failed to update lab request');
    }

    return this.entityToDomain(updatedEntity);
  }

  async delete(id: LabRequestId): Promise<void> {
    await this.repository.delete({ id: id.value });
  }

  private domainToEntity(labRequest: LabRequest): Partial<LabRequestEntity> {
    const entity: Partial<LabRequestEntity> = {
      patientId: labRequest.patientInfo.patientId,
      patientName: labRequest.patientInfo.patientName,
      ageGender: labRequest.patientInfo.ageGender,
      requestDate: labRequest.requestDate,
      status: labRequest.status.value,
      dateTaken: labRequest.dateTaken,
      others: labRequest.others,
      createdAt: labRequest.createdAt,
      updatedAt: labRequest.updatedAt
    };

    // Map tests to entity fields
    const tests = labRequest.tests.tests;
    entity.cbcWithPlatelet = tests.cbcWithPlatelet;
    entity.pregnancyTest = tests.pregnancyTest;
    entity.urinalysis = tests.urinalysis;
    entity.fecalysis = tests.fecalysis;
    entity.occultBloodTest = tests.occultBloodTest;
    entity.hepaBScreening = tests.hepaBScreening;
    entity.hepaAScreening = tests.hepaAScreening;
    entity.hepatitisProfile = tests.hepatitisProfile;
    entity.vdrlRpr = tests.vdrlRpr;
    entity.dengueNs1 = tests.dengueNs1;
    entity.ca125CeaPsa = tests.ca125CeaPsa;
    entity.fbs = tests.fbs;
    entity.bun = tests.bun;
    entity.creatinine = tests.creatinine;
    entity.bloodUricAcid = tests.bloodUricAcid;
    entity.lipidProfile = tests.lipidProfile;
    entity.sgot = tests.sgot;
    entity.sgpt = tests.sgpt;
    entity.alp = tests.alp;
    entity.sodiumNa = tests.sodiumNa;
    entity.potassiumK = tests.potassiumK;
    entity.hbalc = tests.hbalc;
    entity.ecg = tests.ecg;
    entity.t3 = tests.t3;
    entity.t4 = tests.t4;
    entity.ft3 = tests.ft3;
    entity.ft4 = tests.ft4;
    entity.tsh = tests.tsh;

    if (labRequest.id) {
      entity.id = labRequest.id.value;
    }

    return entity;
  }

  private entityToDomain(entity: LabRequestEntity): LabRequest {
    const patientInfo = LabRequestPatientInfo.create({
      patientId: entity.patientId,
      patientName: entity.patientName,
      ageGender: entity.ageGender
    });

    const tests = LabRequestTests.create({
      cbcWithPlatelet: entity.cbcWithPlatelet,
      pregnancyTest: entity.pregnancyTest,
      urinalysis: entity.urinalysis,
      fecalysis: entity.fecalysis,
      occultBloodTest: entity.occultBloodTest,
      hepaBScreening: entity.hepaBScreening,
      hepaAScreening: entity.hepaAScreening,
      hepatitisProfile: entity.hepatitisProfile,
      vdrlRpr: entity.vdrlRpr,
      dengueNs1: entity.dengueNs1,
      ca125CeaPsa: entity.ca125CeaPsa,
      fbs: entity.fbs,
      bun: entity.bun,
      creatinine: entity.creatinine,
      bloodUricAcid: entity.bloodUricAcid,
      lipidProfile: entity.lipidProfile,
      sgot: entity.sgot,
      sgpt: entity.sgpt,
      alp: entity.alp,
      sodiumNa: entity.sodiumNa,
      potassiumK: entity.potassiumK,
      hbalc: entity.hbalc,
      ecg: entity.ecg,
      t3: entity.t3,
      t4: entity.t4,
      ft3: entity.ft3,
      ft4: entity.ft4,
      tsh: entity.tsh
    });

    const status = LabRequestStatus.create(entity.status as 'pending' | 'complete' | 'cancelled');

    return new LabRequest(
      patientInfo,
      entity.requestDate,
      tests,
      status,
      entity.id, // ID is already a string (dashless UUID)
      entity.dateTaken,
      entity.others,
      entity.createdAt,
      entity.updatedAt
    );
  }
}
