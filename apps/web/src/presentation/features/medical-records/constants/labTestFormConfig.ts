// Configuration for different lab test form types and their fields
import { z } from 'zod';

export interface LabTestFieldConfig {
  id: string;
  label: string;
  normalRange?: string;
  column: 'left' | 'right';
  order: number;
}

export interface LabTestTypeConfig {
  title: string;
  fields: LabTestFieldConfig[];
}

// Blood Chemistry Test Configuration
const BLOOD_CHEMISTRY_FIELDS: LabTestFieldConfig[] = [
  // Left Column Fields
  { id: 'fbs', label: 'FBS', normalRange: '3.3-6.10 mmol/L', column: 'left', order: 1 },
  { id: 'bun', label: 'BUN', normalRange: '2.86-8.20 mmol/L', column: 'left', order: 2 },
  { id: 'creatinine', label: 'CREATININE', normalRange: '53-115 umol/L', column: 'left', order: 3 },
  { id: 'uricAcid', label: 'URIC ACID', normalRange: '0.15-0.41 mmol/L', column: 'left', order: 4 },
  { id: 'cholesterol', label: 'CHOLESTEROL', normalRange: '3.35-7.37 mmol/L', column: 'left', order: 5 },
  { id: 'triglycerides', label: 'TRIGLYCERIDES', normalRange: '0.56-1.69 mmol/L', column: 'left', order: 6 },
  { id: 'hdl', label: 'HDL', normalRange: '1.04-1.55 mmol/L', column: 'left', order: 7 },
  { id: 'ldl', label: 'LDL', normalRange: '1.7-4.5 mmol/L', column: 'left', order: 8 },
  { id: 'vldl', label: 'VLDL', normalRange: '0.0-1.04 mmol/L', column: 'left', order: 9 },
  { id: 'sodium', label: 'SODIUM', normalRange: '135-145 mmol/L', column: 'left', order: 10 },
  { id: 'potassium', label: 'POTASSIUM', normalRange: '3.50-5.50 mmol/L', column: 'left', order: 11 },
  { id: 'chloride', label: 'CHLORIDE', normalRange: '95-107 mmol/L', column: 'left', order: 12 },
  { id: 'calcium', label: 'CALCIUM', normalRange: '2.02-2.60 mEq/L', column: 'left', order: 13 },
  { id: 'sgot', label: 'SGOT', normalRange: '0-38 U/L', column: 'left', order: 14 },
  { id: 'sgpt', label: 'SGPT', normalRange: '0-40 U/L', column: 'left', order: 15 },
  { id: 'rbs', label: 'RBS', normalRange: '7.1-11.1 mmol/L', column: 'left', order: 16 },

  // Right Column Fields  
  { id: 'alkPhosphatase', label: 'Alk. Phosphatase', normalRange: '53 - 90 U/L', column: 'right', order: 1 },
  { id: 'totalProtein', label: 'Total Protein', normalRange: '66 - 88 g/L', column: 'right', order: 2 },
  { id: 'albumin', label: 'Albumin', normalRange: '35-52 g/L', column: 'right', order: 3 },
  { id: 'globulin', label: 'Globulin', normalRange: '31-36 g/L', column: 'right', order: 4 },
  { id: 'agRatio', label: 'A/G Ratio', normalRange: '1.13-2.10:1', column: 'right', order: 5 },
  { id: 'totalBilirubin', label: 'Total Bilirubin', normalRange: 'up to 20.40 µmol/L', column: 'right', order: 6 },
  { id: 'directBilirubin', label: 'Direct Bilirubin', normalRange: 'up to 6.80 µmol/L', column: 'right', order: 7 },
  { id: 'indirectBilirubin', label: 'Indirect Bilirubin', normalRange: 'up to 13.60 µmol/L', column: 'right', order: 8 },
  { id: 'ionisedCalcium', label: 'Ionised Calcium', normalRange: '1.13-1.32 mmol/L', column: 'right', order: 9 },
  { id: 'magnesium', label: 'Magnesium', normalRange: '0.65-1.05 mmol/L', column: 'right', order: 10 },
  { id: 'hba1c', label: 'HBa1c', normalRange: '4.0 - 6.0 %', column: 'right', order: 11 },
  { id: 'ogtt30mins', label: 'OGTT 30mins', normalRange: '0-10.48 mmol/L', column: 'right', order: 12 },
  { id: 'ogtt1hr', label: '1st Hour', normalRange: '0-6.70 mmol/L', column: 'right', order: 13 },
  { id: 'ogtt2hr', label: '2nd Hour', normalRange: '0-6.10 mmol/L', column: 'right', order: 14 },
  { id: 'ppbs2hr', label: '2 Hours PPBS', normalRange: '2.3-7.1 mmol/L', column: 'right', order: 15 },
  { id: 'inorgPhosphorus', label: 'Inor. Phosphorus', normalRange: '0.83-1.45 mmol/L', column: 'right', order: 16 },
];

// Urinalysis Test Configuration - aligned with backend API structure
const URINALYSIS_FIELDS: LabTestFieldConfig[] = [
  { id: 'color', label: 'Color', column: 'left', order: 1 },
  { id: 'transparency', label: 'Transparency', column: 'left', order: 2 },
  { id: 'specificGravity', label: 'Specific Gravity', normalRange: '1.003-1.035', column: 'left', order: 3 },
  { id: 'ph', label: 'pH', normalRange: '4.6-8.0', column: 'left', order: 4 },
  { id: 'protein', label: 'Protein', normalRange: 'Negative', column: 'left', order: 5 },
  { id: 'glucose', label: 'Glucose', normalRange: 'Negative', column: 'left', order: 6 },
  { id: 'epithelialCells', label: 'Epithelial Cells', normalRange: 'Few', column: 'left', order: 7 },
  { id: 'redCells', label: 'Red Cells', normalRange: '0-2/hpf', column: 'right', order: 1 },
  { id: 'pusCells', label: 'Pus Cells', normalRange: '0-5/hpf', column: 'right', order: 2 },
  { id: 'mucusThread', label: 'Mucus Thread', normalRange: 'Few', column: 'right', order: 3 },
  { id: 'amorphousUrates', label: 'Amorphous Urates', normalRange: 'Few', column: 'right', order: 4 },
  { id: 'amorphousPhosphate', label: 'Amorphous Phosphate', normalRange: 'Few', column: 'right', order: 5 },
  { id: 'crystals', label: 'Crystals', normalRange: 'None', column: 'right', order: 6 },
  { id: 'bacteria', label: 'Bacteria', normalRange: 'Few', column: 'right', order: 7 },
  { id: 'others', label: 'Others', column: 'right', order: 8 },
  { id: 'pregnancyTest', label: 'Pregnancy Test', normalRange: 'Negative', column: 'right', order: 9 },
];

// Fecalysis Test Configuration - aligned with backend API structure
const FECALYSIS_FIELDS: LabTestFieldConfig[] = [
  { id: 'color', label: 'Color', column: 'left', order: 1 },
  { id: 'consistency', label: 'Consistency', column: 'left', order: 2 },
  { id: 'rbc', label: 'RBC', normalRange: 'None', column: 'left', order: 3 },
  { id: 'wbc', label: 'WBC', normalRange: 'Few', column: 'left', order: 4 },
  { id: 'occultBlood', label: 'Occult Blood', normalRange: 'Negative', column: 'right', order: 1 },
  { id: 'urobilinogen', label: 'Urobilinogen', normalRange: 'Normal', column: 'right', order: 2 },
  { id: 'others', label: 'Others', column: 'right', order: 3 },
];

// Hematology Test Configuration - aligned with backend API structure
const HEMATOLOGY_FIELDS: LabTestFieldConfig[] = [
  { id: 'hematocrit', label: 'Hematocrit', normalRange: '36-46%', column: 'left', order: 1 },
  { id: 'hemoglobin', label: 'Hemoglobin', normalRange: '12.0-16.0 g/dL', column: 'left', order: 2 },
  { id: 'rbc', label: 'RBC', normalRange: '4.2-5.4 x10^12/L', column: 'left', order: 3 },
  { id: 'wbc', label: 'WBC', normalRange: '4.5-11.0 x10^9/L', column: 'left', order: 4 },
  { id: 'segmenters', label: 'Segmenters', normalRange: '50-70%', column: 'left', order: 5 },
  { id: 'lymphocyte', label: 'Lymphocyte', normalRange: '20-40%', column: 'right', order: 1 },
  { id: 'monocyte', label: 'Monocyte', normalRange: '2-8%', column: 'right', order: 2 },
  { id: 'basophils', label: 'Basophils', normalRange: '0-2%', column: 'right', order: 3 },
  { id: 'eosinophils', label: 'Eosinophils', normalRange: '1-4%', column: 'right', order: 4 },
  { id: 'platelet', label: 'Platelet', normalRange: '150-450 x10^9/L', column: 'right', order: 5 },
  { id: 'others', label: 'Others', column: 'right', order: 6 },
];

// Serology Test Configuration - aligned with backend API structure
const SEROLOGY_FIELDS: LabTestFieldConfig[] = [
  { id: 'ft3', label: 'FT3', normalRange: '3.1-6.8 pmol/L', column: 'left', order: 1 },
  { id: 'ft4', label: 'FT4', normalRange: '12-22 pmol/L', column: 'left', order: 2 },
  { id: 'tsh', label: 'TSH', normalRange: '0.27-4.2 mIU/L', column: 'left', order: 3 },
  { id: 'doctorId', label: 'Doctor', column: 'left', order: 4 },
];

// Dengue Test Configuration - separate category with its own form
const DENGUE_FIELDS: LabTestFieldConfig[] = [
  { id: 'igg', label: 'DENGUE IgG', normalRange: 'Negative', column: 'left', order: 1 },
  { id: 'igm', label: 'DENGUE IgM', normalRange: 'Negative', column: 'left', order: 2 },
  { id: 'ns1', label: 'DENGUE NS1', normalRange: 'Negative', column: 'right', order: 1 },
];

// ECG Test Configuration - aligned with backend API structure
const ECG_FIELDS: LabTestFieldConfig[] = [
  { id: 'av', label: 'AV', column: 'left', order: 1 },
  { id: 'qrs', label: 'QRS', column: 'left', order: 2 },
  { id: 'axis', label: 'Axis', column: 'left', order: 3 },
  { id: 'pr', label: 'PR', column: 'left', order: 4 },
  { id: 'qt', label: 'QT', column: 'left', order: 5 },
  { id: 'stT', label: 'ST-T', column: 'right', order: 1 },
  { id: 'rhythm', label: 'Rhythm', column: 'right', order: 2 },
  { id: 'others', label: 'Others', column: 'right', order: 3 },
  { id: 'interpretation', label: 'Interpretation', column: 'right', order: 4 },
  { id: 'interpreter', label: 'Interpreter', column: 'right', order: 5 },
];

// Coagulation Test Configuration - aligned with backend API structure
const COAGULATION_FIELDS: LabTestFieldConfig[] = [
  { id: 'patientPt', label: 'Patient PT', normalRange: '11-13 seconds', column: 'left', order: 1 },
  { id: 'controlPt', label: 'Control PT', normalRange: '11-13 seconds', column: 'left', order: 2 },
  { id: 'inr', label: 'INR', normalRange: '0.8-1.2', column: 'left', order: 3 },
  { id: 'activityPercent', label: 'Activity %', normalRange: '70-100%', column: 'right', order: 1 },
  { id: 'patientPtt', label: 'Patient PTT', normalRange: '25-35 seconds', column: 'right', order: 2 },
  { id: 'controlPtt', label: 'Control PTT', normalRange: '25-35 seconds', column: 'right', order: 3 },
];

// Lab Test Type Configurations - using backend naming conventions
export const LAB_TEST_TYPE_CONFIGS: Record<string, LabTestTypeConfig> = {
  bloodChemistry: {
    title: 'BLOOD CHEMISTRY',
    fields: BLOOD_CHEMISTRY_FIELDS,
  },
  urinalysis: {
    title: 'URINALYSIS',
    fields: URINALYSIS_FIELDS,
  },
  fecalysis: {
    title: 'FECALYSIS',
    fields: FECALYSIS_FIELDS,
  },
  hematology: {
    title: 'HEMATOLOGY (CBC WITH PLATELET)',
    fields: HEMATOLOGY_FIELDS,
  },
  serology: {
    title: 'SEROLOGY & IMMUNOLOGY',
    fields: SEROLOGY_FIELDS,
  },
  dengue: {
    title: 'DENGUE TEST',
    fields: DENGUE_FIELDS,
  },
  ecg: {
    title: 'ELECTROCARDIOGRAM (ECG)',
    fields: ECG_FIELDS,
  },
  coagulation: {
    title: 'COAGULATION STUDIES',
    fields: COAGULATION_FIELDS,
  },
};

// Valid test types
export type LabTestType = keyof typeof LAB_TEST_TYPE_CONFIGS;

// Helper function to get test type configuration
export const getLabTestConfig = (testType: LabTestType): LabTestTypeConfig => {
  return LAB_TEST_TYPE_CONFIGS[testType] || LAB_TEST_TYPE_CONFIGS.bloodChemistry;
};

// Helper function to get fields by column
export const getFieldsByColumn = (testType: LabTestType, column: 'left' | 'right'): LabTestFieldConfig[] => {
  const config = getLabTestConfig(testType);
  return config.fields
    .filter(field => field.column === column)
    .sort((a, b) => a.order - b.order);
};

// Helper function to generate Zod schema for a test type
export const generateLabTestSchema = (testType: LabTestType) => {
  const config = getLabTestConfig(testType);
  const schemaFields: Record<string, z.ZodOptional<z.ZodString> | z.ZodString> = {};

  config.fields.forEach(field => {
    if (field.id === 'doctorId' && testType === 'serology') {
      schemaFields[field.id] = z.string().min(1, 'Doctor selection is required');
    } else {
      schemaFields[field.id] = z.string().optional();
    }
  });

  return z.object(schemaFields);
};

