import { LabRequest } from '@nx-starter/domain';
import { BloodChemistry } from '@nx-starter/domain';
import { LabRequestPatientInfo } from '@nx-starter/domain';
import { LabRequestTests } from '@nx-starter/domain';
import { LabRequestStatus } from '@nx-starter/domain';
import { BloodChemistryPatientInfo } from '@nx-starter/domain';
import { BloodChemistryResults } from '@nx-starter/domain';
import {
  LabRequestDto,
  BloodChemistryDto,
  CreateLabRequestCommand,
  CreateBloodChemistryCommand,
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
      dateTaken: labRequest.dateTaken?.toISOString(),
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
      dateTaken: bloodChemistry.dateTaken.toISOString(),
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

    return new BloodChemistry(
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
}
