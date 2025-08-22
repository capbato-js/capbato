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

// Urinalysis Test Configuration (placeholder for future implementation)
const URINALYSIS_FIELDS: LabTestFieldConfig[] = [
  { id: 'urine_color', label: 'Color', column: 'left', order: 1 },
  { id: 'transparency', label: 'Transparency', column: 'left', order: 2 },
  { id: 'specific_gravity', label: 'Specific Gravity', normalRange: '1.003-1.035', column: 'left', order: 3 },
  { id: 'ph', label: 'pH', normalRange: '4.6-8.0', column: 'left', order: 4 },
  { id: 'protein_urine', label: 'Protein', normalRange: 'Negative', column: 'left', order: 5 },
  { id: 'glucose_urine', label: 'Glucose', normalRange: 'Negative', column: 'left', order: 6 },
  { id: 'ketones', label: 'Ketones', normalRange: 'Negative', column: 'right', order: 1 },
  { id: 'bilirubin_urine', label: 'Bilirubin', normalRange: 'Negative', column: 'right', order: 2 },
  { id: 'blood_urine', label: 'Blood', normalRange: 'Negative', column: 'right', order: 3 },
  { id: 'nitrites', label: 'Nitrites', normalRange: 'Negative', column: 'right', order: 4 },
  { id: 'leukocyte_esterase', label: 'Leukocyte Esterase', normalRange: 'Negative', column: 'right', order: 5 },
];

// Fecalysis Test Configuration (placeholder for future implementation)
const FECALYSIS_FIELDS: LabTestFieldConfig[] = [
  { id: 'fecal_color', label: 'Color', column: 'left', order: 1 },
  { id: 'consistency', label: 'Consistency', column: 'left', order: 2 },
  { id: 'occult_blood_fecal', label: 'Occult Blood', normalRange: 'Negative', column: 'left', order: 3 },
  { id: 'parasites', label: 'Parasites', normalRange: 'None seen', column: 'left', order: 4 },
  { id: 'ova', label: 'Ova', normalRange: 'None seen', column: 'right', order: 1 },
  { id: 'cysts', label: 'Cysts', normalRange: 'None seen', column: 'right', order: 2 },
  { id: 'wbc_fecal', label: 'WBC', normalRange: 'Few', column: 'right', order: 3 },
  { id: 'rbc_fecal', label: 'RBC', normalRange: 'None', column: 'right', order: 4 },
];

// CBC Test Configuration
const CBC_FIELDS: LabTestFieldConfig[] = [
  { id: 'hemoglobin', label: 'Hemoglobin', normalRange: '12.0-16.0 g/dL', column: 'left', order: 1 },
  { id: 'hematocrit', label: 'Hematocrit', normalRange: '36-46%', column: 'left', order: 2 },
  { id: 'rbc_count', label: 'RBC Count', normalRange: '4.2-5.4 x10^12/L', column: 'left', order: 3 },
  { id: 'wbc_count', label: 'WBC Count', normalRange: '4.5-11.0 x10^9/L', column: 'left', order: 4 },
  { id: 'platelet_count', label: 'Platelet Count', normalRange: '150-450 x10^9/L', column: 'right', order: 1 },
  { id: 'mcv', label: 'MCV', normalRange: '80-100 fL', column: 'right', order: 2 },
  { id: 'mch', label: 'MCH', normalRange: '27-33 pg', column: 'right', order: 3 },
  { id: 'mchc', label: 'MCHC', normalRange: '32-36 g/dL', column: 'right', order: 4 },
];

// Thyroid Function Test Configuration
const THYROID_FUNCTION_FIELDS: LabTestFieldConfig[] = [
  { id: 't3', label: 'T3', normalRange: '1.2-2.8 nmol/L', column: 'left', order: 1 },
  { id: 't4', label: 'T4', normalRange: '64-154 nmol/L', column: 'left', order: 2 },
  { id: 'ft3', label: 'FT3', normalRange: '3.1-6.8 pmol/L', column: 'left', order: 3 },
  { id: 'ft4', label: 'FT4', normalRange: '12-22 pmol/L', column: 'right', order: 1 },
  { id: 'tsh', label: 'TSH', normalRange: '0.27-4.2 mIU/L', column: 'right', order: 2 },
];

// Lab Test Type Configurations
export const LAB_TEST_TYPE_CONFIGS: Record<string, LabTestTypeConfig> = {
  BLOOD_CHEMISTRY: {
    title: 'BLOOD CHEMISTRY',
    fields: BLOOD_CHEMISTRY_FIELDS,
  },
  URINALYSIS: {
    title: 'URINALYSIS',
    fields: URINALYSIS_FIELDS,
  },
  FECALYSIS: {
    title: 'FECALYSIS',
    fields: FECALYSIS_FIELDS,
  },
  CBC: {
    title: 'CBC WITH PLATELET',
    fields: CBC_FIELDS,
  },
  THYROID_FUNCTION: {
    title: 'THYROID FUNCTION',
    fields: THYROID_FUNCTION_FIELDS,
  },
};

// Valid test types
export type LabTestType = keyof typeof LAB_TEST_TYPE_CONFIGS;

// Helper function to get test type configuration
export const getLabTestConfig = (testType: LabTestType): LabTestTypeConfig => {
  return LAB_TEST_TYPE_CONFIGS[testType] || LAB_TEST_TYPE_CONFIGS.BLOOD_CHEMISTRY;
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
  const schemaFields: Record<string, z.ZodOptional<z.ZodString>> = {};
  
  config.fields.forEach(field => {
    schemaFields[field.id] = z.string().optional();
  });
  
  return z.object(schemaFields);
};

