import { injectable } from 'tsyringe';
import { Repository, DataSource } from 'typeorm';
import { ILabTestResultRepository, LabTestResult } from '@nx-starter/domain';
import { LabTestResultEntity } from './LabTestResultEntity';

@injectable()
export class TypeOrmLabTestResultRepository implements ILabTestResultRepository {
  constructor(private dataSource: DataSource) {}

  private get repository(): Repository<LabTestResultEntity> {
    return this.dataSource.getRepository(LabTestResultEntity);
  }

  async create(labTestResult: LabTestResult): Promise<LabTestResult> {
    const entity = this.toEntity(labTestResult);
    const savedEntity = await this.repository.save(entity);
    return this.toDomain(savedEntity);
  }

  async getById(id: string): Promise<LabTestResult | undefined> {
    const entity = await this.repository.findOne({ where: { id } });
    return entity ? this.toDomain(entity) : undefined;
  }

  async getByLabRequestId(labRequestId: string): Promise<LabTestResult | undefined> {
    const entity = await this.repository.findOne({ where: { labRequestId } });
    return entity ? this.toDomain(entity) : undefined;
  }

  async getByPatientId(patientId: string): Promise<LabTestResult[]> {
    const entities = await this.repository.find({ 
      where: { patientId },
      order: { dateTested: 'DESC' }
    });
    return entities.map(entity => this.toDomain(entity));
  }

  async update(labTestResult: LabTestResult): Promise<LabTestResult> {
    if (!labTestResult.id) {
      throw new Error('Cannot update lab test result without ID');
    }
    
    const entity = this.toEntity(labTestResult);
    const savedEntity = await this.repository.save(entity);
    return this.toDomain(savedEntity);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete({ id });
  }

  async getAll(): Promise<LabTestResult[]> {
    const entities = await this.repository.find({
      order: { dateTested: 'DESC' }
    });
    return entities.map(entity => this.toDomain(entity));
  }

  private toEntity(domain: LabTestResult): LabTestResultEntity {
    const entity = new LabTestResultEntity();
    
    entity.id = domain.id!;
    entity.labRequestId = domain.labRequestId;
    entity.patientId = domain.patientId;
    entity.dateTested = domain.dateTested;
    entity.remarks = domain.remarks;

    // Map blood chemistry results
    if (domain.bloodChemistry) {
      entity.resultBloodFbs = domain.bloodChemistry.fbs;
      entity.resultBloodBun = domain.bloodChemistry.bun;
      entity.resultBloodCreatinine = domain.bloodChemistry.creatinine;
      entity.resultBloodUricAcid = domain.bloodChemistry.uricAcid;
      entity.resultBloodCholesterol = domain.bloodChemistry.cholesterol;
      entity.resultBloodTriglycerides = domain.bloodChemistry.triglycerides;
      entity.resultBloodHdl = domain.bloodChemistry.hdl;
      entity.resultBloodLdl = domain.bloodChemistry.ldl;
      entity.resultBloodVldl = domain.bloodChemistry.vldl;
      entity.resultBloodSodium = domain.bloodChemistry.sodium;
      entity.resultBloodPotassium = domain.bloodChemistry.potassium;
      entity.resultBloodSgot = domain.bloodChemistry.sgot;
      entity.resultBloodSgpt = domain.bloodChemistry.sgpt;
      entity.resultBloodAlkPhosphatase = domain.bloodChemistry.alkPhosphatase;
      entity.resultBloodHba1c = domain.bloodChemistry.hba1c;
    }

    // Map urinalysis results
    if (domain.urinalysis) {
      entity.resultUrineColor = domain.urinalysis.color;
      entity.resultUrineTransparency = domain.urinalysis.transparency;
      entity.resultUrineSpecificGravity = domain.urinalysis.specificGravity;
      entity.resultUrinePh = domain.urinalysis.ph;
      entity.resultUrineProtein = domain.urinalysis.protein;
      entity.resultUrineGlucose = domain.urinalysis.glucose;
      entity.resultUrineEpithelialCells = domain.urinalysis.epithelialCells;
      entity.resultUrineRedCells = domain.urinalysis.redCells;
      entity.resultUrinePusCells = domain.urinalysis.pusCells;
      entity.resultUrineMucusThread = domain.urinalysis.mucusThread;
      entity.resultUrineAmorphousUrates = domain.urinalysis.amorphousUrates;
      entity.resultUrineAmorphousPhosphate = domain.urinalysis.amorphousPhosphate;
      entity.resultUrineCrystals = domain.urinalysis.crystals;
      entity.resultUrineBacteria = domain.urinalysis.bacteria;
      entity.resultUrineOthers = domain.urinalysis.others;
      entity.resultUrinePregnancyTest = domain.urinalysis.pregnancyTest;
    }

    return entity;
  }

  private toDomain(entity: LabTestResultEntity): LabTestResult {
    // Map blood chemistry results
    const bloodChemistry = this.hasBloodChemistryResults(entity) ? {
      fbs: entity.resultBloodFbs,
      bun: entity.resultBloodBun,
      creatinine: entity.resultBloodCreatinine,
      uricAcid: entity.resultBloodUricAcid,
      cholesterol: entity.resultBloodCholesterol,
      triglycerides: entity.resultBloodTriglycerides,
      hdl: entity.resultBloodHdl,
      ldl: entity.resultBloodLdl,
      vldl: entity.resultBloodVldl,
      sodium: entity.resultBloodSodium,
      potassium: entity.resultBloodPotassium,
      sgot: entity.resultBloodSgot,
      sgpt: entity.resultBloodSgpt,
      alkPhosphatase: entity.resultBloodAlkPhosphatase,
      hba1c: entity.resultBloodHba1c,
    } : undefined;

    // Map urinalysis results
    const urinalysis = this.hasUrinalysisResults(entity) ? {
      color: entity.resultUrineColor,
      transparency: entity.resultUrineTransparency,
      specificGravity: entity.resultUrineSpecificGravity,
      ph: entity.resultUrinePh,
      protein: entity.resultUrineProtein,
      glucose: entity.resultUrineGlucose,
      epithelialCells: entity.resultUrineEpithelialCells,
      redCells: entity.resultUrineRedCells,
      pusCells: entity.resultUrinePusCells,
      mucusThread: entity.resultUrineMucusThread,
      amorphousUrates: entity.resultUrineAmorphousUrates,
      amorphousPhosphate: entity.resultUrineAmorphousPhosphate,
      crystals: entity.resultUrineCrystals,
      bacteria: entity.resultUrineBacteria,
      others: entity.resultUrineOthers,
      pregnancyTest: entity.resultUrinePregnancyTest,
    } : undefined;

    return new LabTestResult(
      entity.labRequestId,
      entity.patientId,
      entity.dateTested!,
      bloodChemistry,
      urinalysis,
      undefined, // hematology
      undefined, // fecalysis  
      undefined, // serology
      entity.remarks,
      entity.id,
      entity.createdAt,
      entity.updatedAt
    );
  }

  private hasBloodChemistryResults(entity: LabTestResultEntity): boolean {
    return !!(
      entity.resultBloodFbs ||
      entity.resultBloodBun ||
      entity.resultBloodCreatinine ||
      entity.resultBloodUricAcid ||
      entity.resultBloodCholesterol ||
      entity.resultBloodTriglycerides ||
      entity.resultBloodHdl ||
      entity.resultBloodLdl ||
      entity.resultBloodVldl ||
      entity.resultBloodSodium ||
      entity.resultBloodPotassium ||
      entity.resultBloodSgot ||
      entity.resultBloodSgpt ||
      entity.resultBloodAlkPhosphatase ||
      entity.resultBloodHba1c
    );
  }

  private hasUrinalysisResults(entity: LabTestResultEntity): boolean {
    return !!(
      entity.resultUrineColor ||
      entity.resultUrineTransparency ||
      entity.resultUrineSpecificGravity ||
      entity.resultUrinePh ||
      entity.resultUrineProtein ||
      entity.resultUrineGlucose ||
      entity.resultUrineEpithelialCells ||
      entity.resultUrineRedCells ||
      entity.resultUrinePusCells ||
      entity.resultUrineMucusThread ||
      entity.resultUrineAmorphousUrates ||
      entity.resultUrineAmorphousPhosphate ||
      entity.resultUrineCrystals ||
      entity.resultUrineBacteria ||
      entity.resultUrineOthers ||
      entity.resultUrinePregnancyTest
    );
  }
}