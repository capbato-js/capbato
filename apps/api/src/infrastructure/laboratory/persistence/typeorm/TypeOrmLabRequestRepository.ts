import { injectable, inject } from 'tsyringe';
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
import { IPatientRepository } from '@nx-starter/application-shared';
import { generateId } from '@nx-starter/utils-core';
import { LabRequestEntity } from './LabRequestEntity';
import { TOKENS } from '@nx-starter/application-shared';

@injectable()
export class TypeOrmLabRequestRepository implements ILabRequestRepository {
  private readonly repository: Repository<LabRequestEntity>;

  constructor(
    private dataSource: DataSource,
    @inject(TOKENS.PatientRepository) private patientRepository: IPatientRepository
  ) {
    this.repository = this.dataSource.getRepository(LabRequestEntity);
  }

  async save(labRequest: LabRequest): Promise<LabRequest> {
    const entity = this.domainToEntity(labRequest);
    // Generate ID if not present (for new entities)
    if (!entity.id) {
      entity.id = generateId();
    }
    const savedEntity = await this.repository.save(entity);
    return await this.entityToDomain(savedEntity);
  }

  async findById(id: LabRequestId): Promise<LabRequest | null> {
    const entity = await this.repository.findOne({
      where: { id: id.value }
    });
    return entity ? await this.entityToDomain(entity) : null;
  }

  async getById(id: string): Promise<LabRequest | null> {
    const entity = await this.repository.findOne({
      where: { id: id }
    });
    return entity ? await this.entityToDomain(entity) : null;
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

    return Promise.all(entities.map(entity => this.entityToDomain(entity)));
  }

  async findByPatientId(patientId: string): Promise<LabRequest[]> {
    const entities = await this.repository.find({
      where: { patientId },
      order: { requestDate: 'DESC' }
    });
    return Promise.all(entities.map(entity => this.entityToDomain(entity)));
  }

  async findCompleted(): Promise<LabRequest[]> {
    const entities = await this.repository.find({
      where: { status: 'completed' },
      order: { requestDate: 'DESC' }
    });
    return Promise.all(entities.map(entity => this.entityToDomain(entity)));
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

    return await this.entityToDomain(updatedEntity);
  }

  async delete(id: LabRequestId): Promise<void> {
    await this.repository.delete({ id: id.value });
  }

  private domainToEntity(labRequest: LabRequest): Partial<LabRequestEntity> {
    const entity: Partial<LabRequestEntity> = {
      patientId: labRequest.patientInfo.patientId,
      requestDate: labRequest.requestDate,
      status: labRequest.status.value,
      dateTaken: labRequest.dateTaken,
      others: labRequest.others,
      createdAt: labRequest.createdAt,
      updatedAt: labRequest.updatedAt
    };

    // Map grouped tests to individual entity boolean fields
    const tests = labRequest.tests.tests;
    
    // Routine Tests
    entity.routineCbcWithPlatelet = tests.routine.cbcWithPlatelet;
    entity.routinePregnancyTest = tests.routine.pregnancyTest;
    entity.routineUrinalysis = tests.routine.urinalysis;
    entity.routineFecalysis = tests.routine.fecalysis;
    entity.routineOccultBloodTest = tests.routine.occultBloodTest;
    
    // Serology Tests
    entity.serologyHepatitisBScreening = tests.serology.hepatitisBScreening;
    entity.serologyHepatitisAScreening = tests.serology.hepatitisAScreening;
    entity.serologyHepatitisCScreening = tests.serology.hepatitisCScreening;
    entity.serologyHepatitisProfile = tests.serology.hepatitisProfile;
    entity.serologyVdrlRpr = tests.serology.vdrlRpr;
    entity.serologyCrp = tests.serology.crp;
    entity.serologyDengueNs1 = tests.serology.dengueNs1;
    entity.serologyAso = tests.serology.aso;
    entity.serologyCrf = tests.serology.crf;
    entity.serologyRaRf = tests.serology.raRf;
    entity.serologyTumorMarkers = tests.serology.tumorMarkers;
    entity.serologyCa125 = tests.serology.ca125;
    entity.serologyCea = tests.serology.cea;
    entity.serologyPsa = tests.serology.psa;
    entity.serologyBetaHcg = tests.serology.betaHcg;
    
    // Blood Chemistry Tests
    entity.bloodChemistryFbs = tests.bloodChemistry.fbs;
    entity.bloodChemistryBun = tests.bloodChemistry.bun;
    entity.bloodChemistryCreatinine = tests.bloodChemistry.creatinine;
    entity.bloodChemistryBloodUricAcid = tests.bloodChemistry.bloodUricAcid;
    entity.bloodChemistryLipidProfile = tests.bloodChemistry.lipidProfile;
    entity.bloodChemistrySgot = tests.bloodChemistry.sgot;
    entity.bloodChemistrySgpt = tests.bloodChemistry.sgpt;
    entity.bloodChemistryAlkalinePhosphatase = tests.bloodChemistry.alkalinePhosphatase;
    entity.bloodChemistrySodium = tests.bloodChemistry.sodium;
    entity.bloodChemistryPotassium = tests.bloodChemistry.potassium;
    entity.bloodChemistryHba1c = tests.bloodChemistry.hba1c;
    
    // Miscellaneous Tests
    entity.miscEcg = tests.miscellaneous.ecg;
    
    // Thyroid Tests
    entity.thyroidT3 = tests.thyroid.t3;
    entity.thyroidT4 = tests.thyroid.t4;
    entity.thyroidFt3 = tests.thyroid.ft3;
    entity.thyroidFt4 = tests.thyroid.ft4;
    entity.thyroidTsh = tests.thyroid.tsh;

    if (labRequest.id) {
      entity.id = labRequest.id.value;
    }

    return entity;
  }

  private async entityToDomain(entity: LabRequestEntity): Promise<LabRequest> {
    // Try to fetch complete patient information
    let patientInfo: LabRequestPatientInfo;
    
    try {
      const patient = await this.patientRepository.getById(entity.patientId);
      if (patient) {
        // Create enriched patient info with complete data
        patientInfo = LabRequestPatientInfo.create({
          patientId: entity.patientId,
          patientName: `${patient.firstName} ${patient.lastName}`.trim() || 'Unknown Patient',
          ageGender: 'Age/Gender', // TODO: Calculate from patient.dateOfBirth and patient.gender
          patientNumber: patient.patientNumber,
          firstName: patient.firstName,
          lastName: patient.lastName
        });
      } else {
        // Fallback to basic patient info if patient not found
        patientInfo = LabRequestPatientInfo.create({
          patientId: entity.patientId,
          patientName: 'Unknown Patient',
          ageGender: 'Unknown Age/Gender'
        });
      }
    } catch (error) {
      // Fallback to basic patient info if there's an error fetching patient
      console.warn(`Failed to fetch patient data for ID ${entity.patientId}:`, error);
      patientInfo = LabRequestPatientInfo.create({
        patientId: entity.patientId,
        patientName: 'Unknown Patient',
        ageGender: 'Unknown Age/Gender'
      });
    }

    const tests = LabRequestTests.create({
      routine: {
        cbcWithPlatelet: entity.routineCbcWithPlatelet,
        pregnancyTest: entity.routinePregnancyTest,
        urinalysis: entity.routineUrinalysis,
        fecalysis: entity.routineFecalysis,
        occultBloodTest: entity.routineOccultBloodTest,
      },
      serology: {
        hepatitisBScreening: entity.serologyHepatitisBScreening,
        hepatitisAScreening: entity.serologyHepatitisAScreening,
        hepatitisCScreening: entity.serologyHepatitisCScreening,
        hepatitisProfile: entity.serologyHepatitisProfile,
        vdrlRpr: entity.serologyVdrlRpr,
        crp: entity.serologyCrp,
        dengueNs1: entity.serologyDengueNs1,
        aso: entity.serologyAso,
        crf: entity.serologyCrf,
        raRf: entity.serologyRaRf,
        tumorMarkers: entity.serologyTumorMarkers,
        ca125: entity.serologyCa125,
        cea: entity.serologyCea,
        psa: entity.serologyPsa,
        betaHcg: entity.serologyBetaHcg,
      },
      bloodChemistry: {
        fbs: entity.bloodChemistryFbs,
        bun: entity.bloodChemistryBun,
        creatinine: entity.bloodChemistryCreatinine,
        bloodUricAcid: entity.bloodChemistryBloodUricAcid,
        lipidProfile: entity.bloodChemistryLipidProfile,
        sgot: entity.bloodChemistrySgot,
        sgpt: entity.bloodChemistrySgpt,
        alkalinePhosphatase: entity.bloodChemistryAlkalinePhosphatase,
        sodium: entity.bloodChemistrySodium,
        potassium: entity.bloodChemistryPotassium,
        hba1c: entity.bloodChemistryHba1c,
      },
      miscellaneous: {
        ecg: entity.miscEcg,
      },
      thyroid: {
        t3: entity.thyroidT3,
        t4: entity.thyroidT4,
        ft3: entity.thyroidFt3,
        ft4: entity.thyroidFt4,
        tsh: entity.thyroidTsh,
      },
    });

    const status = LabRequestStatus.create(entity.status as 'pending' | 'in_progress' | 'completed' | 'cancelled');

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
