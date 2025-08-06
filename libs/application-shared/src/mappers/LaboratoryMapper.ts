import { LabRequest } from '@nx-starter/domain';
import { BloodChemistry } from '@nx-starter/domain';
import { UrinalysisResult } from '@nx-starter/domain';
import { HematologyResult } from '@nx-starter/domain';
import { FecalysisResult } from '@nx-starter/domain';
import { SerologyResult } from '@nx-starter/domain';
import { LabRequestPatientInfo } from '@nx-starter/domain';
import { LabRequestTests } from '@nx-starter/domain';
import { LabRequestStatus } from '@nx-starter/domain';
import { LabRequestId } from '@nx-starter/domain';
import { BloodChemistryPatientInfo } from '@nx-starter/domain';
import { BloodChemistryResults } from '@nx-starter/domain';
import {
  LabRequestDto,
  BloodChemistryDto,
  LabTestDto,
  CreateLabRequestCommand,
  CreateBloodChemistryCommand,
  CreateUrinalysisResultCommand,
  UpdateUrinalysisResultCommand,
  CreateHematologyResultCommand,
  UpdateHematologyResultCommand,
  CreateFecalysisResultCommand,
  UpdateFecalysisResultCommand,
  CreateSerologyResultCommand,
  UpdateSerologyResultCommand,
} from '../dto/LaboratoryDto';

/**
 * Static mapper class for Laboratory entities
 * Handles transformation between domain entities and DTOs
 */
export class LaboratoryMapper {
  /**
   * Convert LabRequest domain entity to DTO
   */
  static toLabRequestDto(labRequest: LabRequest): LabRequestDto {
    return {
      id: labRequest.id?.value,
      patient: {
        id: labRequest.patientInfo.patientId,
        patientNumber: labRequest.patientInfo.patientNumber,
        firstName: labRequest.patientInfo.firstName,
        lastName: labRequest.patientInfo.lastName,
        name: labRequest.patientInfo.patientName,
        ageGender: labRequest.patientInfo.ageGender,
      },
      requestDate: labRequest.requestDate.toISOString(),
      status: labRequest.status.value,
      dateTaken: labRequest.dateTaken ? (labRequest.dateTaken instanceof Date ? labRequest.dateTaken.toISOString() : new Date(labRequest.dateTaken).toISOString()) : undefined,
      others: labRequest.others,
      selectedTests: labRequest.tests.getSelectedTests(),
      createdAt: labRequest.createdAt.toISOString(),
      updatedAt: labRequest.updatedAt?.toISOString(),
    };
  }

  /**
   * Convert array of LabRequest domain entities to DTOs
   */
  static toLabRequestDtoArray(labRequests: LabRequest[]): LabRequestDto[] {
    return labRequests.map(labRequest => this.toLabRequestDto(labRequest));
  }

  /**
   * Convert array of LabRequest domain entities to LabTestDto format for frontend
   */
  static toLabTestDtoArray(labRequests: LabRequest[], patientId?: string): LabTestDto[] {
    // Filter by patient if specified
    const filteredRequests = patientId 
      ? labRequests.filter(request => request.patientInfo.patientId === patientId)
      : labRequests;

    return filteredRequests.map(request => this.toLabTestDto(request));
  }

  /**
   * Convert LabRequest to LabTestDto format for frontend
   */
  static toLabTestDto(labRequest: LabRequest): LabTestDto {
    // Get selected tests
    const selectedTests = labRequest.tests.getSelectedTests();
    
    // Determine test category from selected tests
    const testCategory = this.determineTestCategory(selectedTests);
    
    // Generate display names for the tests
    const testDisplayNames = selectedTests.map(test => this.formatTestName(test));
    
    // Map status
    const status = this.mapStatusToFrontend(labRequest.status.value);

    // Create backward compatibility testName for transition period
    const testName = this.generateLegacyTestName(testCategory, testDisplayNames);

    return {
      id: labRequest.id?.value || '',
      testCategory,
      tests: selectedTests,
      testDisplayNames,
      date: labRequest.requestDate.toISOString().split('T')[0], // Format as YYYY-MM-DD
      status,
      results: labRequest.status.value === 'complete' ? 'Available' : undefined,
      patientId: labRequest.patientInfo.patientId,
      // Backward compatibility
      testName,
    };
  }

  /**
   * Convert array of BloodChemistry domain entities to LabTestDto format for frontend
   */
  static bloodChemistryToLabTestDtoArray(bloodChemistryResults: BloodChemistry[]): LabTestDto[] {
    return bloodChemistryResults.map(result => this.bloodChemistryToLabTestDto(result));
  }

  /**
   * Convert BloodChemistry to LabTestDto format for frontend
   */
  static bloodChemistryToLabTestDto(bloodChemistry: BloodChemistry): LabTestDto {
    // Extract test names from blood chemistry results
    const results = bloodChemistry.results;
    const availableTests: string[] = [];
    const displayNames: string[] = [];

    // Check which tests have values and build test names
    if (results.fbs !== undefined) {
      availableTests.push('fbs');
      displayNames.push('FBS');
    }
    if (results.bun !== undefined) {
      availableTests.push('bun');
      displayNames.push('BUN');
    }
    if (results.creatinine !== undefined) {
      availableTests.push('creatinine');
      displayNames.push('Creatinine');
    }
    if (results.uricAcid !== undefined) {
      availableTests.push('bloodUricAcid');
      displayNames.push('Uric Acid');
    }
    if (results.cholesterol !== undefined) {
      availableTests.push('cholesterol');
      displayNames.push('Cholesterol');
    }
    if (results.triglycerides !== undefined) {
      availableTests.push('triglycerides');
      displayNames.push('Triglycerides');
    }
    if (results.hdl !== undefined) {
      availableTests.push('hdl');
      displayNames.push('HDL');
    }
    if (results.ldl !== undefined) {
      availableTests.push('ldl');
      displayNames.push('LDL');
    }
    if (results.sgot !== undefined) {
      availableTests.push('sgot');
      displayNames.push('SGOT');
    }
    if (results.sgpt !== undefined) {
      availableTests.push('sgpt');
      displayNames.push('SGPT');
    }

    // Create test name
    const testName = displayNames.length > 0 
      ? `BLOOD CHEMISTRY: ${displayNames.join(', ')}`
      : 'BLOOD CHEMISTRY';

    return {
      id: bloodChemistry.id?.value || '',
      testCategory: 'BLOOD_CHEMISTRY',
      tests: availableTests,
      testDisplayNames: displayNames,
      date: bloodChemistry.dateTaken.toISOString().split('T')[0], // Format as YYYY-MM-DD
      status: 'Complete', // Blood chemistry results are always complete once created
      results: 'Available',
      patientId: bloodChemistry.patient.name, // Use patient name as ID for now
      testName,
    };
  }

  /**
   * Generate a human-readable test name from selected tests
   */
  private static generateTestName(selectedTests: string[], tests: LabRequestTests): string {
    if (selectedTests.length === 0) {
      return 'Lab Test';
    }

    // Group tests by category
    const bloodChemistryTests = ['fbs', 'bun', 'creatinine', 'bloodUricAcid', 'lipidProfile', 'sgot', 'sgpt', 'hbalc'];
    const routineTests = ['urinalysis', 'fecalysis', 'cbcWithPlatelet', 'pregnancyTest'];
    const thyroidTests = ['t3', 't4', 'ft3', 'ft4', 'tsh'];

    const bloodChemistry = selectedTests.filter(test => bloodChemistryTests.includes(test));
    const routine = selectedTests.filter(test => routineTests.includes(test));
    const thyroid = selectedTests.filter(test => thyroidTests.includes(test));

    // Build test name based on categories
    if (bloodChemistry.length > 0) {
      const testNames = bloodChemistry.map(test => this.formatTestName(test)).join(', ');
      return `BLOOD CHEMISTRY: ${testNames}`;
    } else if (routine.length > 0) {
      if (routine.includes('urinalysis')) {
        return routine.length === 1 ? 'URINALYSIS' : 'URINALYSIS: Complete Panel';
      } else if (routine.includes('fecalysis')) {
        return routine.length === 1 ? 'FECALYSIS' : 'FECALYSIS: Comprehensive';
      } else {
        return routine.map(test => this.formatTestName(test)).join(', ');
      }
    } else if (thyroid.length > 0) {
      const testNames = thyroid.map(test => this.formatTestName(test)).join(', ');
      return `THYROID FUNCTION: ${testNames}`;
    }

    // Fallback for other tests
    return selectedTests.map(test => this.formatTestName(test)).join(', ');
  }

  /**
   * Format individual test name for display
   */
  private static formatTestName(test: string): string {
    const formatMap: Record<string, string> = {
      fbs: 'FBS',
      bun: 'BUN',
      creatinine: 'Creatinine',
      bloodUricAcid: 'Uric Acid',
      lipidProfile: 'Lipid Profile',
      sgot: 'SGOT',
      sgpt: 'SGPT',
      hbalc: 'HBA1C',
      urinalysis: 'URINALYSIS',
      fecalysis: 'FECALYSIS',
      cbcWithPlatelet: 'CBC with Platelet',
      pregnancyTest: 'Pregnancy Test',
      t3: 'T3',
      t4: 'T4',
      ft3: 'FT3',
      ft4: 'FT4',
      tsh: 'TSH',
    };

    return formatMap[test] || test.toUpperCase();
  }

  /**
   * Determine test category from selected tests
   */
  private static determineTestCategory(selectedTests: string[]): 'BLOOD_CHEMISTRY' | 'URINALYSIS' | 'FECALYSIS' | 'CBC' | 'THYROID_FUNCTION' {
    const bloodChemistryTests = ['fbs', 'bun', 'creatinine', 'bloodUricAcid', 'lipidProfile', 'sgot', 'sgpt', 'hbalc'];
    const thyroidTests = ['t3', 't4', 'ft3', 'ft4', 'tsh'];
    
    if (selectedTests.includes('urinalysis')) {
      return 'URINALYSIS';
    } else if (selectedTests.includes('fecalysis')) {
      return 'FECALYSIS';
    } else if (selectedTests.includes('cbcWithPlatelet')) {
      return 'CBC';
    } else if (selectedTests.some(test => thyroidTests.includes(test))) {
      return 'THYROID_FUNCTION';
    } else if (selectedTests.some(test => bloodChemistryTests.includes(test))) {
      return 'BLOOD_CHEMISTRY';
    }

    // Default fallback
    return 'BLOOD_CHEMISTRY';
  }

  /**
   * Generate legacy testName for backward compatibility during transition
   */
  private static generateLegacyTestName(testCategory: string, testDisplayNames: string[]): string {
    if (testDisplayNames.length === 0) {
      return 'Lab Test';
    }

    // Handle single test categories
    if (testCategory === 'URINALYSIS' && testDisplayNames.length === 1) {
      return 'URINALYSIS';
    } else if (testCategory === 'FECALYSIS' && testDisplayNames.length === 1) {
      return 'FECALYSIS';
    }

    // Handle multiple tests or specific naming
    if (testCategory === 'URINALYSIS' && testDisplayNames.length > 1) {
      return 'URINALYSIS: Complete Panel';
    } else if (testCategory === 'FECALYSIS' && testDisplayNames.length > 1) {
      return 'FECALYSIS: Comprehensive';
    } else if (testCategory === 'THYROID_FUNCTION') {
      return `THYROID FUNCTION: ${testDisplayNames.join(', ')}`;
    } else {
      return `${testCategory.replace('_', ' ')}: ${testDisplayNames.join(', ')}`;
    }
  }

  /**
   * Map backend status to frontend status format
   */
  private static mapStatusToFrontend(backendStatus: string): 'Complete' | 'Confirmed' | 'Pending' | 'In Progress' {
    const statusMap: Record<string, 'Complete' | 'Confirmed' | 'Pending' | 'In Progress'> = {
      'complete': 'Complete',
      'confirmed': 'Confirmed', 
      'pending': 'Pending',
      'in_progress': 'In Progress',
      'in-progress': 'In Progress',
    };

    return statusMap[backendStatus.toLowerCase()] || 'Pending';
  }

  /**
   * Convert BloodChemistry domain entity to DTO
   */
  static toBloodChemistryDto(bloodChemistry: BloodChemistry): BloodChemistryDto {
    return {
      id: bloodChemistry.id?.value,
      patient: {
        name: bloodChemistry.patientInfo.patientName,
        age: bloodChemistry.patientInfo.age,
        sex: bloodChemistry.patientInfo.sex,
      },
      dateTaken: bloodChemistry.dateTaken instanceof Date ? bloodChemistry.dateTaken.toISOString() : new Date(bloodChemistry.dateTaken).toISOString(),
      results: bloodChemistry.results.results as Record<string, number | undefined>,
      hasAbnormalValues: bloodChemistry.hasAbnormalResults(),
      criticalValues: bloodChemistry.results.getCriticalValues(),
      createdAt: bloodChemistry.createdAt.toISOString(),
      updatedAt: bloodChemistry.updatedAt?.toISOString(),
    };
  }

  /**
   * Convert array of BloodChemistry domain entities to DTOs
   */
  static toBloodChemistryDtoArray(bloodChemistries: BloodChemistry[]): BloodChemistryDto[] {
    return bloodChemistries.map(bloodChemistry => this.toBloodChemistryDto(bloodChemistry));
  }

  /**
   * Convert CreateLabRequestCommand to LabRequest domain entity
   */
  static fromCreateLabRequestCommand(command: CreateLabRequestCommand): LabRequest {
    const patientInfo = new LabRequestPatientInfo({
      patientId: command.patientId,
      patientName: command.patientName,
      ageGender: command.ageGender,
    });

    const tests = new LabRequestTests({
      cbcWithPlatelet: command.cbcWithPlatelet,
      pregnancyTest: command.pregnancyTest,
      urinalysis: command.urinalysis,
      fecalysis: command.fecalysis,
      occultBloodTest: command.occultBloodTest,
      hepaBScreening: command.hepaBScreening,
      hepaAScreening: command.hepaAScreening,
      hepatitisProfile: command.hepatitisProfile,
      vdrlRpr: command.vdrlRpr,
      dengueNs1: command.dengueNs1,
      ca125CeaPsa: command.ca125CeaPsa,
      fbs: command.fbs,
      bun: command.bun,
      creatinine: command.creatinine,
      bloodUricAcid: command.bloodUricAcid,
      lipidProfile: command.lipidProfile,
      sgot: command.sgot,
      sgpt: command.sgpt,
      alp: command.alp,
      sodiumNa: command.sodiumNa,
      potassiumK: command.potassiumK,
      hbalc: command.hbalc,
      ecg: command.ecg,
      t3: command.t3,
      t4: command.t4,
      ft3: command.ft3,
      ft4: command.ft4,
      tsh: command.tsh,
    });

    const status = LabRequestStatus.create('pending');

    return new LabRequest(
      patientInfo,
      command.requestDate,
      tests,
      status,
      undefined, // no ID for new entities
      undefined, // no date taken initially
      command.others
    );
  }

  /**
   * Convert CreateBloodChemistryCommand to BloodChemistry domain entity
   */
  static fromCreateBloodChemistryCommand(command: CreateBloodChemistryCommand): BloodChemistry {
    const patientInfo = new BloodChemistryPatientInfo({
      patientName: command.patientName,
      age: command.age,
      sex: command.sex,
    });

    const results = new BloodChemistryResults({
      fbs: command.fbs,
      bun: command.bun,
      creatinine: command.creatinine,
      uricAcid: command.uricAcid,
      cholesterol: command.cholesterol,
      triglycerides: command.triglycerides,
      hdl: command.hdl,
      ldl: command.ldl,
      vldl: command.vldl,
      sodium: command.sodium,
      potassium: command.potassium,
      chloride: command.chloride,
      calcium: command.calcium,
      sgot: command.sgot,
      sgpt: command.sgpt,
      rbs: command.rbs,
      alkPhosphatase: command.alkPhosphatase,
      totalProtein: command.totalProtein,
      albumin: command.albumin,
      globulin: command.globulin,
      agRatio: command.agRatio,
      totalBilirubin: command.totalBilirubin,
      directBilirubin: command.directBilirubin,
      indirectBilirubin: command.indirectBilirubin,
      ionisedCalcium: command.ionisedCalcium,
      magnesium: command.magnesium,
      hbalc: command.hbalc,
      ogtt30min: command.ogtt30min,
      ogtt1hr: command.ogtt1hr,
      ogtt2hr: command.ogtt2hr,
      ppbs2hr: command.ppbs2hr,
      inorPhosphorus: command.inorPhosphorus,
    });

    return BloodChemistry.create(
      patientInfo,
      command.dateTaken,
      results
    );
  }

  /**
   * Convert plain object to LabRequest domain entity (for ORM)
   */
  static fromPlainObject(data: Record<string, unknown>): LabRequest {
    const patientInfo = new LabRequestPatientInfo({
      patientId: String(data['patient_id'] || ''),
      patientName: String(data['patient_name'] || ''),
      ageGender: String(data['age_gender'] || ''),
    });

    const tests = new LabRequestTests({
      cbcWithPlatelet: data['cbc_with_platelet'] as string,
      pregnancyTest: data['pregnancy_test'] as string,
      urinalysis: data['urinalysis'] as string,
      fecalysis: data['fecalysis'] as string,
      occultBloodTest: data['occult_blood_test'] as string,
      hepaBScreening: data['hepa_b_screening'] as string,
      hepaAScreening: data['hepa_a_screening'] as string,
      hepatitisProfile: data['hepatitis_profile'] as string,
      vdrlRpr: data['vdrl_rpr'] as string,
      dengueNs1: data['dengue_ns1'] as string,
      ca125CeaPsa: data['ca_125_cea_psa'] as string,
      fbs: data['fbs'] as string,
      bun: data['bun'] as string,
      creatinine: data['creatinine'] as string,
      bloodUricAcid: data['blood_uric_acid'] as string,
      lipidProfile: data['lipid_profile'] as string,
      sgot: data['sgot'] as string,
      sgpt: data['sgpt'] as string,
      alp: data['alp'] as string,
      sodiumNa: data['sodium_na'] as string,
      potassiumK: data['potassium_k'] as string,
      hbalc: data['hbalc'] as string,
      ecg: data['ecg'] as string,
      t3: data['t3'] as string,
      t4: data['t4'] as string,
      ft3: data['ft3'] as string,
      ft4: data['ft4'] as string,
      tsh: data['tsh'] as string,
    });

    const status = LabRequestStatus.create(String(data['status'] || 'pending'));

    return new LabRequest(
      patientInfo,
      new Date(String(data['request_date'])),
      tests,
      status,
      data['id'] as string,
      data['date_taken'] ? new Date(String(data['date_taken'])) : undefined,
      data['others'] as string,
      new Date(String(data['created_at'] || new Date())),
      data['updated_at'] ? new Date(String(data['updated_at'])) : undefined
    );
  }

  /**
   * Convert LabRequest domain entity to plain object (for ORM)
   */
  static toPlainObject(labRequest: LabRequest): Record<string, unknown> {
    return {
      id: labRequest.id?.value,
      patient_id: labRequest.patientInfo.patientId,
      patient_name: labRequest.patientInfo.patientName,
      age_gender: labRequest.patientInfo.ageGender,
      request_date: labRequest.requestDate,
      status: labRequest.status.value,
      date_taken: labRequest.dateTaken,
      others: labRequest.others,
      // Test fields
      cbc_with_platelet: labRequest.tests.tests.cbcWithPlatelet,
      pregnancy_test: labRequest.tests.tests.pregnancyTest,
      urinalysis: labRequest.tests.tests.urinalysis,
      fecalysis: labRequest.tests.tests.fecalysis,
      occult_blood_test: labRequest.tests.tests.occultBloodTest,
      hepa_b_screening: labRequest.tests.tests.hepaBScreening,
      hepa_a_screening: labRequest.tests.tests.hepaAScreening,
      hepatitis_profile: labRequest.tests.tests.hepatitisProfile,
      vdrl_rpr: labRequest.tests.tests.vdrlRpr,
      dengue_ns1: labRequest.tests.tests.dengueNs1,
      ca_125_cea_psa: labRequest.tests.tests.ca125CeaPsa,
      fbs: labRequest.tests.tests.fbs,
      bun: labRequest.tests.tests.bun,
      creatinine: labRequest.tests.tests.creatinine,
      blood_uric_acid: labRequest.tests.tests.bloodUricAcid,
      lipid_profile: labRequest.tests.tests.lipidProfile,
      sgot: labRequest.tests.tests.sgot,
      sgpt: labRequest.tests.tests.sgpt,
      alp: labRequest.tests.tests.alp,
      sodium_na: labRequest.tests.tests.sodiumNa,
      potassium_k: labRequest.tests.tests.potassiumK,
      hbalc: labRequest.tests.tests.hbalc,
      ecg: labRequest.tests.tests.ecg,
      t3: labRequest.tests.tests.t3,
      t4: labRequest.tests.tests.t4,
      ft3: labRequest.tests.tests.ft3,
      ft4: labRequest.tests.tests.ft4,
      tsh: labRequest.tests.tests.tsh,
      created_at: labRequest.createdAt,
      updated_at: labRequest.updatedAt,
    };
  }

  // Urinalysis Result Mappers
  static fromCreateUrinalysisResultCommand(command: CreateUrinalysisResultCommand): UrinalysisResult {
    return UrinalysisResult.create(
      new LabRequestId(command.labRequestId),
      command.patientId,
      command.patientName,
      command.dateTaken,
      {
        age: command.age,
        sex: command.sex,
        color: command.color,
        transparency: command.transparency,
        specificGravity: command.specificGravity,
        ph: command.ph,
        protein: command.protein,
        glucose: command.glucose,
        epithelialCells: command.epithelialCells,
        redCells: command.redCells,
        pusCells: command.pusCells,
        mucusThread: command.mucusThread,
        amorphousUrates: command.amorphousUrates,
        amorphousPhosphate: command.amorphousPhosphate,
        crystals: command.crystals,
        bacteria: command.bacteria,
        others: command.others,
        pregnancyTest: command.pregnancyTest,
      }
    );
  }

  static updateUrinalysisResultFromCommand(existing: UrinalysisResult, command: UpdateUrinalysisResultCommand): UrinalysisResult {
    return existing.update({
      age: command.age,
      sex: command.sex,
      color: command.color,
      transparency: command.transparency,
      specificGravity: command.specificGravity,
      ph: command.ph,
      protein: command.protein,
      glucose: command.glucose,
      epithelialCells: command.epithelialCells,
      redCells: command.redCells,
      pusCells: command.pusCells,
      mucusThread: command.mucusThread,
      amorphousUrates: command.amorphousUrates,
      amorphousPhosphate: command.amorphousPhosphate,
      crystals: command.crystals,
      bacteria: command.bacteria,
      others: command.others,
      pregnancyTest: command.pregnancyTest,
    });
  }

  // Hematology Result Mappers
  static fromCreateHematologyResultCommand(command: CreateHematologyResultCommand): HematologyResult {
    return HematologyResult.create(
      new LabRequestId(command.labRequestId),
      command.patientId,
      command.patientName,
      command.dateTaken,
      {
        age: command.age,
        sex: command.sex,
        hemoglobin: command.hemoglobin,
        hematocrit: command.hematocrit,
        rbc: command.rbc,
        wbc: command.wbc,
        plateletCount: command.plateletCount,
        neutrophils: command.neutrophils,
        lymphocytes: command.lymphocytes,
        monocytes: command.monocytes,
        eosinophils: command.eosinophils,
        basophils: command.basophils,
        mcv: command.mcv,
        mch: command.mch,
        mchc: command.mchc,
        esr: command.esr,
      }
    );
  }

  static updateHematologyResultFromCommand(existing: HematologyResult, command: UpdateHematologyResultCommand): HematologyResult {
    return existing.update({
      age: command.age,
      sex: command.sex,
      hemoglobin: command.hemoglobin,
      hematocrit: command.hematocrit,
      rbc: command.rbc,
      wbc: command.wbc,
      plateletCount: command.plateletCount,
      neutrophils: command.neutrophils,
      lymphocytes: command.lymphocytes,
      monocytes: command.monocytes,
      eosinophils: command.eosinophils,
      basophils: command.basophils,
      mcv: command.mcv,
      mch: command.mch,
      mchc: command.mchc,
      esr: command.esr,
    });
  }

  // Fecalysis Result Mappers
  static fromCreateFecalysisResultCommand(command: CreateFecalysisResultCommand): FecalysisResult {
    return FecalysisResult.create(
      new LabRequestId(command.labRequestId),
      command.patientId,
      command.patientName,
      command.dateTaken,
      {
        age: command.age,
        sex: command.sex,
        color: command.color,
        consistency: command.consistency,
        rbc: command.rbc,
        wbc: command.wbc,
        occultBlood: command.occultBlood,
        urobilinogen: command.urobilinogen,
        others: command.others,
      }
    );
  }

  static updateFecalysisResultFromCommand(existing: FecalysisResult, command: UpdateFecalysisResultCommand): FecalysisResult {
    return existing.update({
      age: command.age,
      sex: command.sex,
      color: command.color,
      consistency: command.consistency,
      rbc: command.rbc,
      wbc: command.wbc,
      occultBlood: command.occultBlood,
      urobilinogen: command.urobilinogen,
      others: command.others,
    });
  }

  // Serology Result Mappers
  static fromCreateSerologyResultCommand(command: CreateSerologyResultCommand): SerologyResult {
    return SerologyResult.create(
      new LabRequestId(command.labRequestId),
      command.patientId,
      command.patientName,
      command.dateTaken,
      {
        age: command.age,
        sex: command.sex,
        vdrl: command.vdrl,
        rpr: command.rpr,
        hbsag: command.hbsag,
        antiHcv: command.antiHcv,
        hivTest: command.hivTest,
        pregnancyTest: command.pregnancyTest,
        dengueNs1: command.dengueNs1,
        dengueTourniquet: command.dengueTourniquet,
        weilFelix: command.weilFelix,
        typhidot: command.typhidot,
        bloodType: command.bloodType,
        rhFactor: command.rhFactor,
        others: command.others,
      }
    );
  }

  static updateSerologyResultFromCommand(existing: SerologyResult, command: UpdateSerologyResultCommand): SerologyResult {
    return existing.update({
      age: command.age,
      sex: command.sex,
      vdrl: command.vdrl,
      rpr: command.rpr,
      hbsag: command.hbsag,
      antiHcv: command.antiHcv,
      hivTest: command.hivTest,
      pregnancyTest: command.pregnancyTest,
      dengueNs1: command.dengueNs1,
      dengueTourniquet: command.dengueTourniquet,
      weilFelix: command.weilFelix,
      typhidot: command.typhidot,
      bloodType: command.bloodType,
      rhFactor: command.rhFactor,
      others: command.others,
    });
  }

  // ==================== DTO CONVERSION METHODS ====================

  /**
   * Convert UrinalysisResult domain entity to DTO
   */
  static toUrinalysisResultDto(result: UrinalysisResult): any {
    return {
      id: result.id?.value,
      labRequestId: result.labRequestId?.value,
      patientId: result.patientId,
      patientName: result.patientName,
      dateTaken: result.dateTaken ? (result.dateTaken instanceof Date ? result.dateTaken.toISOString() : new Date(result.dateTaken).toISOString()) : undefined,
      age: result.age,
      sex: result.sex,
      color: result.color,
      transparency: result.transparency,
      specificGravity: result.specificGravity,
      protein: result.protein,
      glucose: result.glucose,
      rbc: result.rbc,
      wbc: result.wbc,
      epithelialCells: result.epithelialCells,
      bacteria: result.bacteria,
      amorphous: result.amorphous,
      others: result.others,
      createdAt: result.createdAt?.toISOString(),
      updatedAt: result.updatedAt?.toISOString(),
    };
  }

  /**
   * Convert array of UrinalysisResult domain entities to DTOs
   */
  static toUrinalysisResultDtoArray(results: UrinalysisResult[]): any[] {
    return results.map(result => this.toUrinalysisResultDto(result));
  }

  /**
   * Convert HematologyResult domain entity to DTO
   */
  static toHematologyResultDto(result: HematologyResult): any {
    return {
      id: result.id?.value,
      labRequestId: result.labRequestId?.value,
      patientId: result.patientId,
      patientName: result.patientName,
      dateTaken: result.dateTaken ? (result.dateTaken instanceof Date ? result.dateTaken.toISOString() : new Date(result.dateTaken).toISOString()) : undefined,
      age: result.age,
      sex: result.sex,
      hemoglobin: result.hemoglobin,
      hematocrit: result.hematocrit,
      rbc: result.rbc,
      wbc: result.wbc,
      plateletCount: result.plateletCount,
      neutrophils: result.neutrophils,
      lymphocytes: result.lymphocytes,
      monocytes: result.monocytes,
      eosinophils: result.eosinophils,
      basophils: result.basophils,
      mcv: result.mcv,
      mch: result.mch,
      mchc: result.mchc,
      esr: result.esr,
      createdAt: result.createdAt?.toISOString(),
      updatedAt: result.updatedAt?.toISOString(),
    };
  }

  /**
   * Convert array of HematologyResult domain entities to DTOs
   */
  static toHematologyResultDtoArray(results: HematologyResult[]): any[] {
    return results.map(result => this.toHematologyResultDto(result));
  }

  /**
   * Convert FecalysisResult domain entity to DTO
   */
  static toFecalysisResultDto(result: FecalysisResult): any {
    return {
      id: result.id?.value,
      labRequestId: result.labRequestId?.value,
      patientId: result.patientId,
      patientName: result.patientName,
      dateTaken: result.dateTaken ? (result.dateTaken instanceof Date ? result.dateTaken.toISOString() : new Date(result.dateTaken).toISOString()) : undefined,
      age: result.age,
      sex: result.sex,
      color: result.color,
      consistency: result.consistency,
      rbc: result.rbc,
      wbc: result.wbc,
      occultBlood: result.occultBlood,
      urobilinogen: result.urobilinogen,
      others: result.others,
      createdAt: result.createdAt?.toISOString(),
      updatedAt: result.updatedAt?.toISOString(),
    };
  }

  /**
   * Convert array of FecalysisResult domain entities to DTOs
   */
  static toFecalysisResultDtoArray(results: FecalysisResult[]): any[] {
    return results.map(result => this.toFecalysisResultDto(result));
  }

  /**
   * Convert SerologyResult domain entity to DTO
   */
  static toSerologyResultDto(result: SerologyResult): any {
    return {
      id: result.id?.value,
      labRequestId: result.labRequestId?.value,
      patientId: result.patientId,
      patientName: result.patientName,
      dateTaken: result.dateTaken ? (result.dateTaken instanceof Date ? result.dateTaken.toISOString() : new Date(result.dateTaken).toISOString()) : undefined,
      age: result.age,
      sex: result.sex,
      vdrl: result.vdrl,
      rpr: result.rpr,
      hbsag: result.hbsag,
      antiHcv: result.antiHcv,
      hivTest: result.hivTest,
      pregnancyTest: result.pregnancyTest,
      dengueNs1: result.dengueNs1,
      dengueTourniquet: result.dengueTourniquet,
      weilFelix: result.weilFelix,
      typhidot: result.typhidot,
      bloodType: result.bloodType,
      rhFactor: result.rhFactor,
      others: result.others,
      createdAt: result.createdAt?.toISOString(),
      updatedAt: result.updatedAt?.toISOString(),
    };
  }

  /**
   * Convert array of SerologyResult domain entities to DTOs
   */
  static toSerologyResultDtoArray(results: SerologyResult[]): any[] {
    return results.map(result => this.toSerologyResultDto(result));
  }
}
