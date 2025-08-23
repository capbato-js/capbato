import { CreateLabTestResultRequestDto } from '../dto/LaboratoryDto';

// Type definitions for category-specific result data
interface BloodChemistryData {
  fbs?: number;
  bun?: number;
  creatinine?: number;
  uricAcid?: number;
  cholesterol?: number;
  triglycerides?: number;
  hdl?: number;
  ldl?: number;
  vldl?: number;
  sodium?: number;
  potassium?: number;
  sgot?: number;
  sgpt?: number;
  hba1c?: number;
  alkPhosphatase?: number;
  totalBilirubin?: number;
  directBilirubin?: number;
  indirectBilirubin?: number;
  totalProtein?: number;
  albumin?: number;
  globulin?: number;
  agRatio?: number;
  inorgPhosphorus?: number;
  others?: string;
}

interface UrinalysisData {
  color?: string;
  transparency?: string;
  specificGravity?: string;
  ph?: string;
  protein?: string;
  glucose?: string;
  epithelialCells?: string;
  redCells?: string;
  pusCells?: string;
  mucusThread?: string;
  amorphousUrates?: string;
  amorphousPhosphate?: string;
  crystals?: string;
  bacteria?: string;
  others?: string;
  pregnancyTest?: string;
}

interface FecalysisData {
  color?: string;
  consistency?: string;
  rbc?: string;
  wbc?: string;
  occultBlood?: string;
  urobilinogen?: string;
  others?: string;
}

interface HematologyData {
  hematocrit?: string;
  hemoglobin?: string;
  rbc?: string;
  wbc?: string;
  segmenters?: string;
  lymphocyte?: string;
  monocyte?: string;
  basophils?: string;
  eosinophils?: string;
  platelet?: string;
  others?: string;
}

interface SerologyData {
  ft3?: number;
  ft4?: number;
  tsh?: number;
}

interface DengueData {
  igg?: string;
  igm?: string;
  ns1?: string;
}

interface EcgData {
  av?: string;
  qrs?: string;
  axis?: string;
  pr?: string;
  qt?: string;
  stT?: string;
  rhythm?: string;
  others?: string;
  interpretation?: string;
  interpreter?: string;
}

interface CoagulationData {
  patientPt?: string;
  controlPt?: string;
  inr?: string;
  activityPercent?: string;
  patientPtt?: string;
  controlPtt?: string;
}

// Interface for API result data structure
interface ApiResultData {
  bloodChemistry?: BloodChemistryData;
  urinalysis?: UrinalysisData;
  fecalysis?: FecalysisData;
  hematology?: HematologyData;
  serology?: SerologyData;
  dengue?: DengueData;
  ecg?: EcgData;
  coagulation?: CoagulationData;
}

/**
 * Transforms flat form data into structured API payload for lab test results
 * Ensures proper data types and category grouping for backend API
 */
export class LabTestResultTransformer {
  /**
   * Transform flat form data to structured API payload
   */
  static transformFormDataToApiPayload(
    formData: Record<string, string>,
    testCategory: string,
    labRequestId: string,
    dateTested: Date,
    remarks?: string
  ): CreateLabTestResultRequestDto {
    const payload: CreateLabTestResultRequestDto = {
      labRequestId,
      dateTested: dateTested.toISOString(),
      remarks: remarks || 'Lab test results submitted'
    };

    // Remove empty/undefined values from form data
    const cleanedFormData = this.cleanFormData(formData);

    // Group fields by category and transform data types
    switch (testCategory) {
      case 'bloodChemistry':
        payload.bloodChemistry = this.transformBloodChemistryData(cleanedFormData);
        break;
      case 'urinalysis':
        payload.urinalysis = this.transformUrinalysisData(cleanedFormData);
        break;
      case 'fecalysis':
        payload.fecalysis = this.transformFecalysisData(cleanedFormData);
        break;
      case 'hematology':
        payload.hematology = this.transformHematologyData(cleanedFormData);
        break;
      case 'serology':
        payload.serology = this.transformSerologyData(cleanedFormData);
        break;
      case 'dengue':
        payload.dengue = this.transformDengueData(cleanedFormData);
        break;
      case 'ecg':
        payload.ecg = this.transformEcgData(cleanedFormData);
        break;
      case 'coagulation':
        payload.coagulation = this.transformCoagulationData(cleanedFormData);
        break;
      default:
        console.warn(`Unknown test category: ${testCategory}`);
        break;
    }

    return payload;
  }

  /**
   * Remove empty, undefined, or whitespace-only values
   */
  private static cleanFormData(formData: Record<string, string>): Record<string, string> {
    return Object.entries(formData)
      .filter(([, value]) => value !== undefined && value !== null && value.toString().trim() !== '')
      .reduce((acc, [key, value]) => ({ ...acc, [key]: value.toString().trim() }), {});
  }

  /**
   * Transform blood chemistry fields with proper numeric conversion
   */
  private static transformBloodChemistryData(formData: Record<string, string>): BloodChemistryData | undefined {
    const bloodChemistry: Record<string, number | string> = {};

    // Numeric fields that need conversion to numbers
    const numericFields = [
      'fbs', 'bun', 'creatinine', 'uricAcid', 'cholesterol', 'triglycerides',
      'hdl', 'ldl', 'vldl', 'sodium', 'potassium', 'sgot', 'sgpt', 'hba1c',
      'alkPhosphatase', 'totalBilirubin', 'directBilirubin', 'indirectBilirubin',
      'totalProtein', 'albumin', 'globulin', 'agRatio', 'inorgPhosphorus'
    ];

    // Process numeric fields
    numericFields.forEach(field => {
      if (formData[field]) {
        const numValue = parseFloat(formData[field]);
        if (!isNaN(numValue)) {
          bloodChemistry[field] = numValue;
        }
      }
    });

    // String fields (if any)
    const stringFields = ['others'];
    stringFields.forEach(field => {
      if (formData[field]) {
        bloodChemistry[field] = formData[field];
      }
    });

    return Object.keys(bloodChemistry).length > 0 ? bloodChemistry as BloodChemistryData : undefined;
  }

  /**
   * Transform urinalysis fields (mixed string/numeric)
   */
  private static transformUrinalysisData(formData: Record<string, string>): UrinalysisData | undefined {
    const urinalysis: Record<string, string> = {};

    // String fields for urinalysis
    const stringFields = [
      'color', 'transparency', 'specificGravity', 'ph', 'protein', 'glucose',
      'epithelialCells', 'redCells', 'pusCells', 'mucusThread', 'amorphousUrates',
      'amorphousPhosphate', 'crystals', 'bacteria', 'others', 'pregnancyTest'
    ];

    stringFields.forEach(field => {
      if (formData[field]) {
        urinalysis[field] = formData[field];
      }
    });

    return Object.keys(urinalysis).length > 0 ? urinalysis as UrinalysisData : undefined;
  }

  /**
   * Transform fecalysis fields (mostly strings)
   */
  private static transformFecalysisData(formData: Record<string, string>): FecalysisData | undefined {
    const fecalysis: Record<string, string> = {};

    const stringFields = ['color', 'consistency', 'rbc', 'wbc', 'occultBlood', 'urobilinogen', 'others'];

    stringFields.forEach(field => {
      if (formData[field]) {
        fecalysis[field] = formData[field];
      }
    });

    return Object.keys(fecalysis).length > 0 ? fecalysis as FecalysisData : undefined;
  }

  /**
   * Transform hematology fields (all strings according to DTO)
   */
  private static transformHematologyData(formData: Record<string, string>): HematologyData | undefined {
    const hematology: Record<string, string> = {};

    // All fields are strings according to the DTO
    const stringFields = [
      'hematocrit', 'hemoglobin', 'rbc', 'wbc', 'segmenters', 
      'lymphocyte', 'monocyte', 'basophils', 'eosinophils', 'platelet', 'others'
    ];
    
    stringFields.forEach(field => {
      if (formData[field]) {
        hematology[field] = formData[field];
      }
    });

    return Object.keys(hematology).length > 0 ? hematology as HematologyData : undefined;
  }

  /**
   * Transform serology fields (thyroid function tests)
   */
  private static transformSerologyData(formData: Record<string, string>): SerologyData | undefined {
    const serology: Record<string, number> = {};

    // Numeric fields for thyroid tests
    const numericFields = ['ft3', 'ft4', 'tsh'];
    numericFields.forEach(field => {
      if (formData[field]) {
        const numValue = parseFloat(formData[field]);
        if (!isNaN(numValue)) {
          serology[field] = numValue;
        }
      }
    });

    return Object.keys(serology).length > 0 ? serology as SerologyData : undefined;
  }

  /**
   * Transform dengue fields (test results)
   */
  private static transformDengueData(formData: Record<string, string>): DengueData | undefined {
    const dengue: Record<string, string> = {};

    const stringFields = ['igg', 'igm', 'ns1'];

    stringFields.forEach(field => {
      if (formData[field]) {
        dengue[field] = formData[field];
      }
    });

    return Object.keys(dengue).length > 0 ? dengue as DengueData : undefined;
  }

  /**
   * Transform ECG fields (mostly strings)
   */
  private static transformEcgData(formData: Record<string, string>): EcgData | undefined {
    const ecg: Record<string, string> = {};

    const stringFields = [
      'av', 'qrs', 'axis', 'pr', 'qt', 'stT', 'rhythm', 'others', 'interpretation', 'interpreter'
    ];

    stringFields.forEach(field => {
      if (formData[field]) {
        ecg[field] = formData[field];
      }
    });

    return Object.keys(ecg).length > 0 ? ecg as EcgData : undefined;
  }

  /**
   * Transform coagulation fields (all strings according to DTO)
   */
  private static transformCoagulationData(formData: Record<string, string>): CoagulationData | undefined {
    const coagulation: Record<string, string> = {};

    // All fields are strings according to the DTO
    const stringFields = ['patientPt', 'controlPt', 'inr', 'activityPercent', 'patientPtt', 'controlPtt'];
    stringFields.forEach(field => {
      if (formData[field]) {
        coagulation[field] = formData[field];
      }
    });

    return Object.keys(coagulation).length > 0 ? coagulation as CoagulationData : undefined;
  }

  /**
   * Validate form data before transformation
   */
  static validateFormData(
    formData: Record<string, string>,
    enabledFields: string[],
    testCategory: string
  ): string[] {
    const errors: string[] = [];
    const cleanedData = this.cleanFormData(formData);

    // Check that at least some enabled fields have values
    const hasAnyData = enabledFields.some(field => cleanedData[field]);

    if (!hasAnyData) {
      errors.push('Please fill in at least one test result field');
      return errors;
    }

    // Validate numeric fields for specific categories
    if (testCategory === 'bloodChemistry') {
      this.validateBloodChemistryFields(cleanedData, errors);
    } else if (testCategory === 'hematology') {
      this.validateHematologyFields(cleanedData, errors);
    } else if (testCategory === 'serology') {
      this.validateSerologyFields(cleanedData, errors);
    } else if (testCategory === 'coagulation') {
      this.validateCoagulationFields(cleanedData, errors);
    }

    return errors;
  }

  private static validateBloodChemistryFields(formData: Record<string, string>, errors: string[]) {
    const numericFields = ['fbs', 'bun', 'creatinine', 'uricAcid', 'cholesterol', 'triglycerides', 'hdl', 'ldl', 'vldl'];
    
    numericFields.forEach(field => {
      if (formData[field]) {
        const numValue = parseFloat(formData[field]);
        if (isNaN(numValue) || numValue < 0) {
          errors.push(`${field.toUpperCase()} must be a valid positive number`);
        }
      }
    });
  }

  private static validateHematologyFields(formData: Record<string, string>, errors: string[]) {
    // Note: Hematology fields are strings in the DTO, so no numeric validation needed
    // Just check for empty values if needed
    const requiredFields = ['hematocrit', 'hemoglobin', 'rbc', 'wbc', 'platelet'];
    
    requiredFields.forEach(field => {
      if (formData[field] && formData[field].trim() === '') {
        errors.push(`${field.toUpperCase()} cannot be empty`);
      }
    });
  }

  private static validateSerologyFields(formData: Record<string, string>, errors: string[]) {
    const numericFields = ['ft3', 'ft4', 'tsh'];
    
    numericFields.forEach(field => {
      if (formData[field]) {
        const numValue = parseFloat(formData[field]);
        if (isNaN(numValue) || numValue < 0) {
          errors.push(`${field.toUpperCase()} must be a valid positive number`);
        }
      }
    });
  }

  private static validateCoagulationFields(formData: Record<string, string>, errors: string[]) {
    // Note: Coagulation fields are strings in the DTO, so no numeric validation needed
    // Just check for empty values if needed
    const requiredFields = ['patientPt', 'controlPt', 'inr', 'activityPercent', 'patientPtt', 'controlPtt'];
    
    requiredFields.forEach(field => {
      if (formData[field] && formData[field].trim() === '') {
        errors.push(`${field.replace(/([A-Z])/g, ' $1').toUpperCase()} cannot be empty`);
      }
    });
  }

  /**
   * Transform structured API result data back to flat form data for display
   * Used when viewing existing lab test results
   */
  static transformApiResultToFormData(
    apiResult: ApiResultData,
    testCategory: string
  ): Record<string, string> {
    if (!apiResult || !testCategory) {
      return {};
    }

    // Get the category-specific data from the API result
    const categoryData = (apiResult as Record<string, unknown>)[testCategory];
    if (!categoryData || typeof categoryData !== 'object' || categoryData === null) {
      return {};
    }

    // Convert all values to strings for form display
    const formData: Record<string, string> = {};
    
    Object.entries(categoryData as Record<string, unknown>).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        // Convert all values to strings for form inputs
        formData[key] = String(value);
      }
    });

    return formData;
  }

  /**
   * Get all category-specific fields for a test type
   * Used for validation and form rendering
   */
  static getCategoryFields(testCategory: string): string[] {
    switch (testCategory) {
      case 'bloodChemistry':
        return [
          'fbs', 'bun', 'creatinine', 'uricAcid', 'cholesterol', 'triglycerides',
          'hdl', 'ldl', 'vldl', 'sodium', 'potassium', 'sgot', 'sgpt', 'hba1c',
          'alkPhosphatase', 'totalBilirubin', 'directBilirubin', 'indirectBilirubin',
          'totalProtein', 'albumin', 'globulin', 'agRatio', 'inorgPhosphorus', 'others'
        ];
      case 'urinalysis':
        return [
          'color', 'transparency', 'specificGravity', 'ph', 'protein', 'glucose',
          'epithelialCells', 'redCells', 'pusCells', 'mucusThread', 'amorphousUrates',
          'amorphousPhosphate', 'crystals', 'bacteria', 'others', 'pregnancyTest'
        ];
      case 'fecalysis':
        return ['color', 'consistency', 'rbc', 'wbc', 'occultBlood', 'urobilinogen', 'others'];
      case 'hematology':
        return [
          'hematocrit', 'hemoglobin', 'rbc', 'wbc', 'segmenters', 'lymphocyte',
          'monocyte', 'basophils', 'eosinophils', 'platelet', 'others'
        ];
      case 'serology':
        return ['ft3', 'ft4', 'tsh'];
      case 'dengue':
        return ['igg', 'igm', 'ns1'];
      case 'ecg':
        return ['av', 'qrs', 'axis', 'pr', 'qt', 'stT', 'rhythm', 'others', 'interpretation', 'interpreter'];
      case 'coagulation':
        return ['patientPt', 'controlPt', 'inr', 'activityPercent', 'patientPtt', 'controlPtt'];
      default:
        return [];
    }
  }
}
