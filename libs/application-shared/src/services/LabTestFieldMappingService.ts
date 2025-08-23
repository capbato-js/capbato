/**
 * LabTestFieldMappingService - Single Source of Truth for Lab Test Field Mapping
 * 
 * This service provides the definitive mapping between lab requests and enabled result fields.
 * It's used by:
 * 1. CreateLabTestResultUseCase for validation (which fields are required)
 * 2. LaboratoryMapper for field enabling (which fields should be enabled in forms)
 * 
 * This ensures validation and field enabling are always in sync.
 */

import { LabTestData } from '@nx-starter/domain';

export interface FieldMappingResult {
  bloodChemistry?: string[];
  urinalysis?: string[];
  fecalysis?: string[];
  hematology?: string[];
  serology?: string[];
  dengue?: string[];
  ecg?: string[];
  coagulation?: string[];
}

export class LabTestFieldMappingService {
  /**
   * Get enabled fields based on lab request - SINGLE SOURCE OF TRUTH
   * Uses same logic as CreateLabTestResultUseCase validation
   */
  static getEnabledFields(requestedTests: LabTestData): FieldMappingResult {
    const enabledFields: FieldMappingResult = {};

    // Blood Chemistry field enabling
    if (requestedTests.bloodChemistry) {
      const bloodChemFields = this.getEnabledBloodChemistryFields(requestedTests.bloodChemistry);
      if (bloodChemFields.length > 0) {
        enabledFields.bloodChemistry = bloodChemFields;
      }
    }

    // Urinalysis field enabling 
    if (requestedTests.routine) {
      const urinalysisFields = this.getEnabledUrinalysisFields(requestedTests.routine);
      if (urinalysisFields.length > 0) {
        enabledFields.urinalysis = urinalysisFields;
      }
    }

    // Fecalysis field enabling
    if (requestedTests.routine) {
      const fecalysisFields = this.getEnabledFecalysisFields(requestedTests.routine);
      if (fecalysisFields.length > 0) {
        enabledFields.fecalysis = fecalysisFields;
      }
    }

    // Hematology/CBC field enabling
    if (requestedTests.routine) {
      const hematologyFields = this.getEnabledHematologyFields(requestedTests.routine);
      if (hematologyFields.length > 0) {
        enabledFields.hematology = hematologyFields;
      }
    }

    // Serology field enabling (Thyroid tests)
    if (requestedTests.thyroid) {
      const serologyFields = this.getEnabledSerologyFields(requestedTests.thyroid);
      if (serologyFields.length > 0) {
        enabledFields.serology = serologyFields;
      }
    }

    // Dengue field enabling
    if (requestedTests.serology) {
      const dengueFields = this.getEnabledDengueFields(requestedTests.serology);
      if (dengueFields.length > 0) {
        enabledFields.dengue = dengueFields;
      }
    }

    // ECG field enabling
    if (requestedTests.miscellaneous) {
      const ecgFields = this.getEnabledEcgFields(requestedTests.miscellaneous);
      if (ecgFields.length > 0) {
        enabledFields.ecg = ecgFields;
      }
    }

    // Coagulation field enabling (placeholder for future implementation)
    // if (requestedTests.coagulation) {
    //   const coagulationFields = this.getEnabledCoagulationFields(requestedTests.coagulation);
    //   if (coagulationFields.length > 0) {
    //     enabledFields.coagulation = coagulationFields;
    //   }
    // }

    return enabledFields;
  }

  /**
   * Blood Chemistry field mapping - matches CreateLabTestResultUseCase validation
   */
  private static getEnabledBloodChemistryFields(bloodChemistry: LabTestData['bloodChemistry']): string[] {
    const enabled: string[] = [];

    // Individual tests (1:1 mapping)
    if (bloodChemistry.fbs) enabled.push('fbs');
    if (bloodChemistry.bun) enabled.push('bun');
    if (bloodChemistry.creatinine) enabled.push('creatinine');
    if (bloodChemistry.bloodUricAcid) enabled.push('uricAcid');
    if (bloodChemistry.sgot) enabled.push('sgot');
    if (bloodChemistry.sgpt) enabled.push('sgpt');
    if (bloodChemistry.hba1c) enabled.push('hba1c');
    if (bloodChemistry.alkalinePhosphatase) enabled.push('alkPhosphatase');
    if (bloodChemistry.sodium) enabled.push('sodium');
    if (bloodChemistry.potassium) enabled.push('potassium');

    // Lipid profile (1:5 mapping) - matches validation logic
    if (bloodChemistry.lipidProfile) {
      enabled.push('cholesterol', 'triglycerides', 'hdl', 'ldl', 'vldl');
    }

    // Optional field - always available when any blood chemistry test is requested
    if (enabled.length > 0) {
      enabled.push('others');
    }

    return enabled;
  }

  /**
   * Urinalysis field mapping - matches CreateLabTestResultUseCase validation
   */
  private static getEnabledUrinalysisFields(routine: LabTestData['routine']): string[] {
    const enabled: string[] = [];

    if (routine.pregnancyTest) {
      // ONLY pregnancy test enabled - exclusive mapping
      enabled.push('pregnancyTest');
    } else if (routine.urinalysis) {
      // ALL urinalysis fields EXCEPT pregnancy test
      enabled.push(
        'color', 'transparency', 'specificGravity', 'ph', 'protein', 'glucose',
        'epithelialCells', 'redCells', 'pusCells', 'mucusThread', 'amorphousUrates',
        'amorphousPhosphate', 'crystals', 'bacteria', 'others'
      );
    }

    return enabled;
  }

  /**
   * Fecalysis field mapping - matches CreateLabTestResultUseCase validation
   */
  private static getEnabledFecalysisFields(routine: LabTestData['routine']): string[] {
    const enabled: string[] = [];

    if (routine.occultBloodTest) {
      // ONLY occult blood enabled - exclusive mapping
      enabled.push('occultBlood');
    } else if (routine.fecalysis) {
      // ALL fecalysis fields
      enabled.push('color', 'consistency', 'rbc', 'wbc', 'urobilinogen', 'others');
    }

    return enabled;
  }

  /**
   * Hematology/CBC field mapping - matches CreateLabTestResultUseCase validation
   */
  private static getEnabledHematologyFields(routine: LabTestData['routine']): string[] {
    const enabled: string[] = [];

    if (routine.cbcWithPlatelet) {
      // ALL hematology fields - comprehensive test
      enabled.push(
        'hematocrit', 'hemoglobin', 'rbc', 'wbc', 'segmenters',
        'lymphocyte', 'monocyte', 'basophils', 'eosinophils', 'platelet',
        'others'
      );
    }

    return enabled;
  }

  /**
   * Serology field mapping (Thyroid tests) - matches CreateLabTestResultUseCase validation
   */
  private static getEnabledSerologyFields(thyroid: LabTestData['thyroid']): string[] {
    const enabled: string[] = [];

    // Individual thyroid tests (1:1 mapping)
    if (thyroid.ft3) enabled.push('ft3');
    if (thyroid.ft4) enabled.push('ft4');
    if (thyroid.tsh) enabled.push('tsh');

    return enabled;
  }

  /**
   * Dengue field mapping - matches CreateLabTestResultUseCase validation
   */
  private static getEnabledDengueFields(serology: LabTestData['serology']): string[] {
    const enabled: string[] = [];

    if (serology.dengueNs1) {
      // ALL dengue fields when dengue NS1 is requested
      enabled.push('igg', 'igm', 'ns1');
    }

    return enabled;
  }

  /**
   * ECG field mapping - matches CreateLabTestResultUseCase validation
   */
  private static getEnabledEcgFields(miscellaneous: LabTestData['miscellaneous']): string[] {
    const enabled: string[] = [];

    if (miscellaneous.ecg) {
      // ALL ECG fields - comprehensive test
      enabled.push(
        'av', 'qrs', 'axis', 'pr', 'qt', 'stT', 'rhythm',
        'others', 'interpretation', 'interpreter'
      );
    }

    return enabled;
  }

  /**
   * Get enabled fields for a specific category
   */
  static getEnabledFieldsForCategory(
    category: string, 
    requestedTests: LabTestData
  ): string[] {
    const allFields = this.getEnabledFields(requestedTests);
    return allFields[category as keyof FieldMappingResult] || [];
  }

  /**
   * Check if a specific field should be enabled based on requests
   */
  static isFieldEnabled(
    category: string,
    fieldId: string,
    requestedTests: LabTestData
  ): boolean {
    const enabledFields = this.getEnabledFieldsForCategory(category, requestedTests);
    return enabledFields.includes(fieldId);
  }
}
