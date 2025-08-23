import { injectable } from 'tsyringe';
import { Repository, DataSource } from 'typeorm';
import { ILabTestResultRepository, LabTestResult } from '@nx-starter/domain';
import { v4 as uuidv4 } from 'uuid';
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
    
    // Generate ID if not present
    entity.id = domain.id || uuidv4().replace(/-/g, '');
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

    // Map hematology results
    if (domain.hematology) {
      entity.resultHematologyHematocrit = domain.hematology.hematocrit;
      entity.resultHematologyHemoglobin = domain.hematology.hemoglobin;
      entity.resultHematologyRbc = domain.hematology.rbc;
      entity.resultHematologyWbc = domain.hematology.wbc;
      entity.resultHematologySegmenters = domain.hematology.segmenters;
      entity.resultHematologyLymphocyte = domain.hematology.lymphocyte;
      entity.resultHematologyMonocyte = domain.hematology.monocyte;
      entity.resultHematologyBasophils = domain.hematology.basophils;
      entity.resultHematologyEosinophils = domain.hematology.eosinophils;
      entity.resultHematologyPlatelet = domain.hematology.platelet;
      entity.resultHematologyOthers = domain.hematology.others;
    }

    // Map fecalysis results
    if (domain.fecalysis) {
      entity.resultFecalColor = domain.fecalysis.color;
      entity.resultFecalConsistency = domain.fecalysis.consistency;
      entity.resultFecalRbc = domain.fecalysis.rbc;
      entity.resultFecalWbc = domain.fecalysis.wbc;
      entity.resultFecalOccultBlood = domain.fecalysis.occultBlood;
      entity.resultFecalUrobilinogen = domain.fecalysis.urobilinogen;
      entity.resultFecalOthers = domain.fecalysis.others;
    }

    // Map serology results
    if (domain.serology) {
      entity.resultSerologyFt3 = domain.serology.ft3;
      entity.resultSerologyFt4 = domain.serology.ft4;
      entity.resultSerologyTsh = domain.serology.tsh;
    }

    // Map dengue results
    if (domain.dengue) {
      entity.resultDengueIgg = domain.dengue.igg;
      entity.resultDengueIgm = domain.dengue.igm;
      entity.resultDengueNs1 = domain.dengue.ns1;
    }

    // Map ECG results
    if (domain.ecg) {
      entity.resultEcgAv = domain.ecg.av;
      entity.resultEcgQrs = domain.ecg.qrs;
      entity.resultEcgAxis = domain.ecg.axis;
      entity.resultEcgPr = domain.ecg.pr;
      entity.resultEcgQt = domain.ecg.qt;
      entity.resultEcgStT = domain.ecg.stT;
      entity.resultEcgRhythm = domain.ecg.rhythm;
      entity.resultEcgOthers = domain.ecg.others;
      entity.resultEcgInterpretation = domain.ecg.interpretation;
      entity.resultEcgInterpreter = domain.ecg.interpreter;
    }

    // Map coagulation results
    if (domain.coagulation) {
      entity.resultCoagPatientPt = domain.coagulation.patientPt;
      entity.resultCoagControlPt = domain.coagulation.controlPt;
      entity.resultCoagInr = domain.coagulation.inr;
      entity.resultCoagActivityPercent = domain.coagulation.activityPercent;
      entity.resultCoagPatientPtt = domain.coagulation.patientPtt;
      entity.resultCoagControlPtt = domain.coagulation.controlPtt;
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

    // Map hematology results
    const hematology = this.hasHematologyResults(entity) ? {
      hematocrit: entity.resultHematologyHematocrit,
      hemoglobin: entity.resultHematologyHemoglobin,
      rbc: entity.resultHematologyRbc,
      wbc: entity.resultHematologyWbc,
      segmenters: entity.resultHematologySegmenters,
      lymphocyte: entity.resultHematologyLymphocyte,
      monocyte: entity.resultHematologyMonocyte,
      basophils: entity.resultHematologyBasophils,
      eosinophils: entity.resultHematologyEosinophils,
      platelet: entity.resultHematologyPlatelet,
      others: entity.resultHematologyOthers,
    } : undefined;

    // Map fecalysis results
    const fecalysis = this.hasFecalysisResults(entity) ? {
      color: entity.resultFecalColor,
      consistency: entity.resultFecalConsistency,
      rbc: entity.resultFecalRbc,
      wbc: entity.resultFecalWbc,
      occultBlood: entity.resultFecalOccultBlood,
      urobilinogen: entity.resultFecalUrobilinogen,
      others: entity.resultFecalOthers,
    } : undefined;

    // Map serology results
    const serology = this.hasSerologyResults(entity) ? {
      ft3: entity.resultSerologyFt3,
      ft4: entity.resultSerologyFt4,
      tsh: entity.resultSerologyTsh,
    } : undefined;

    // Map dengue results
    const dengue = this.hasDengueResults(entity) ? {
      igg: entity.resultDengueIgg,
      igm: entity.resultDengueIgm,
      ns1: entity.resultDengueNs1,
    } : undefined;

    // Map ECG results
    const ecg = this.hasEcgResults(entity) ? {
      av: entity.resultEcgAv,
      qrs: entity.resultEcgQrs,
      axis: entity.resultEcgAxis,
      pr: entity.resultEcgPr,
      qt: entity.resultEcgQt,
      stT: entity.resultEcgStT,
      rhythm: entity.resultEcgRhythm,
      others: entity.resultEcgOthers,
      interpretation: entity.resultEcgInterpretation,
      interpreter: entity.resultEcgInterpreter,
    } : undefined;

    // Map coagulation results
    const coagulation = this.hasCoagulationResults(entity) ? {
      patientPt: entity.resultCoagPatientPt,
      controlPt: entity.resultCoagControlPt,
      inr: entity.resultCoagInr,
      activityPercent: entity.resultCoagActivityPercent,
      patientPtt: entity.resultCoagPatientPtt,
      controlPtt: entity.resultCoagControlPtt,
    } : undefined;

    return new LabTestResult(
      entity.labRequestId,
      entity.patientId,
      entity.dateTested || new Date(), // Handle nullable dateTested
      bloodChemistry,
      urinalysis,
      hematology,
      fecalysis,
      serology,
      dengue,
      ecg,
      coagulation,
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

  private hasHematologyResults(entity: LabTestResultEntity): boolean {
    return !!(
      entity.resultHematologyHematocrit ||
      entity.resultHematologyHemoglobin ||
      entity.resultHematologyRbc ||
      entity.resultHematologyWbc ||
      entity.resultHematologySegmenters ||
      entity.resultHematologyLymphocyte ||
      entity.resultHematologyMonocyte ||
      entity.resultHematologyBasophils ||
      entity.resultHematologyEosinophils ||
      entity.resultHematologyPlatelet ||
      entity.resultHematologyOthers
    );
  }

  private hasFecalysisResults(entity: LabTestResultEntity): boolean {
    return !!(
      entity.resultFecalColor ||
      entity.resultFecalConsistency ||
      entity.resultFecalRbc ||
      entity.resultFecalWbc ||
      entity.resultFecalOccultBlood ||
      entity.resultFecalUrobilinogen ||
      entity.resultFecalOthers
    );
  }

  private hasSerologyResults(entity: LabTestResultEntity): boolean {
    return !!(
      entity.resultSerologyFt3 ||
      entity.resultSerologyFt4 ||
      entity.resultSerologyTsh
    );
  }

  private hasDengueResults(entity: LabTestResultEntity): boolean {
    return !!(
      entity.resultDengueIgg ||
      entity.resultDengueIgm ||
      entity.resultDengueNs1
    );
  }

  private hasEcgResults(entity: LabTestResultEntity): boolean {
    return !!(
      entity.resultEcgAv ||
      entity.resultEcgQrs ||
      entity.resultEcgAxis ||
      entity.resultEcgPr ||
      entity.resultEcgQt ||
      entity.resultEcgStT ||
      entity.resultEcgRhythm ||
      entity.resultEcgOthers ||
      entity.resultEcgInterpretation ||
      entity.resultEcgInterpreter
    );
  }

  private hasCoagulationResults(entity: LabTestResultEntity): boolean {
    return !!(
      entity.resultCoagPatientPt ||
      entity.resultCoagControlPt ||
      entity.resultCoagInr ||
      entity.resultCoagActivityPercent ||
      entity.resultCoagPatientPtt ||
      entity.resultCoagControlPtt
    );
  }
}