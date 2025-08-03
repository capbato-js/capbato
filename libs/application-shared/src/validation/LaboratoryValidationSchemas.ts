import { z } from 'zod';

/**
 * Zod schemas for Laboratory command validation
 * These schemas define the validation rules and generate TypeScript types
 */

// Lab Request Status Schema
export const LabRequestStatusSchema = z.enum(['pending', 'complete', 'cancelled']);

// Lab Request Test Fields Schema
const LabTestFieldSchema = z.string().optional();

// Lab Request Validation Schemas
export const CreateLabRequestCommandSchema = z.object({
  patient_id: z.string().min(1, 'Patient ID is required'),
  patient_name: z.string().min(1, 'Patient name is required').max(255, 'Patient name cannot exceed 255 characters'),
  age_gender: z.string().min(1, 'Age and gender information is required'),
  request_date: z.string().datetime('Invalid date format').transform((val) => new Date(val)),
  others: z.string().optional(),
  
  // Basic Tests
  cbc_with_platelet: LabTestFieldSchema,
  pregnancy_test: LabTestFieldSchema,
  urinalysis: LabTestFieldSchema,
  fecalysis: LabTestFieldSchema,
  occult_blood_test: LabTestFieldSchema,
  
  // Hepatitis Tests
  hepa_b_screening: LabTestFieldSchema,
  hepa_a_screening: LabTestFieldSchema,
  hepatitis_profile: LabTestFieldSchema,
  
  // STD Tests
  vdrl_rpr: LabTestFieldSchema,
  
  // Other Tests
  dengue_ns1: LabTestFieldSchema,
  ca_125_cea_psa: LabTestFieldSchema,
  
  // Blood Chemistry Results
  fbs: LabTestFieldSchema,
  bun: LabTestFieldSchema,
  creatinine: LabTestFieldSchema,
  blood_uric_acid: LabTestFieldSchema,
  lipid_profile: LabTestFieldSchema,
  sgot: LabTestFieldSchema,
  sgpt: LabTestFieldSchema,
  alp: LabTestFieldSchema,
  sodium_na: LabTestFieldSchema,
  potassium_k: LabTestFieldSchema,
  hbalc: LabTestFieldSchema,
  
  // Other Tests
  ecg: LabTestFieldSchema,
  t3: LabTestFieldSchema,
  t4: LabTestFieldSchema,
  ft3: LabTestFieldSchema,
  ft4: LabTestFieldSchema,
  tsh: LabTestFieldSchema,
}).refine((data) => {
  // Check if at least one test is selected
  const testFields = [
    data.cbc_with_platelet, data.pregnancy_test, data.urinalysis, data.fecalysis,
    data.occult_blood_test, data.hepa_b_screening, data.hepa_a_screening,
    data.hepatitis_profile, data.vdrl_rpr, data.dengue_ns1, data.ca_125_cea_psa,
    data.fbs, data.bun, data.creatinine, data.blood_uric_acid, data.lipid_profile,
    data.sgot, data.sgpt, data.alp, data.sodium_na, data.potassium_k, data.hbalc,
    data.ecg, data.t3, data.t4, data.ft3, data.ft4, data.tsh
  ];
  
  const hasSelectedTest = testFields.some(field => 
    field && field.trim() !== '' && field.toLowerCase() !== 'no'
  );
  
  return hasSelectedTest;
}, {
  message: 'At least one laboratory test must be selected',
});

export const UpdateLabRequestCommandSchema = z.object({
  id: z.string().min(1, 'ID cannot be empty'),
  patient_id: z.string().min(1, 'Patient ID is required').optional(),
  patient_name: z.string().min(1, 'Patient name is required').max(255).optional(),
  age_gender: z.string().min(1, 'Age and gender information is required').optional(),
  request_date: z.string().datetime().transform((val) => new Date(val)).optional(),
  status: LabRequestStatusSchema.optional(),
  date_taken: z.string().datetime().transform((val) => new Date(val)).optional(),
  others: z.string().optional(),
  
  // Test fields - same as create but all optional
  cbc_with_platelet: LabTestFieldSchema,
  pregnancy_test: LabTestFieldSchema,
  urinalysis: LabTestFieldSchema,
  fecalysis: LabTestFieldSchema,
  occult_blood_test: LabTestFieldSchema,
  hepa_b_screening: LabTestFieldSchema,
  hepa_a_screening: LabTestFieldSchema,
  hepatitis_profile: LabTestFieldSchema,
  vdrl_rpr: LabTestFieldSchema,
  dengue_ns1: LabTestFieldSchema,
  ca_125_cea_psa: LabTestFieldSchema,
  fbs: LabTestFieldSchema,
  bun: LabTestFieldSchema,
  creatinine: LabTestFieldSchema,
  blood_uric_acid: LabTestFieldSchema,
  lipid_profile: LabTestFieldSchema,
  sgot: LabTestFieldSchema,
  sgpt: LabTestFieldSchema,
  alp: LabTestFieldSchema,
  sodium_na: LabTestFieldSchema,
  potassium_k: LabTestFieldSchema,
  hbalc: LabTestFieldSchema,
  ecg: LabTestFieldSchema,
  t3: LabTestFieldSchema,
  t4: LabTestFieldSchema,
  ft3: LabTestFieldSchema,
  ft4: LabTestFieldSchema,
  tsh: LabTestFieldSchema,
});

export const DeleteLabRequestCommandSchema = z.object({
  id: z.string().min(1, 'ID cannot be empty'),
});

export const UpdateLabRequestResultsCommandSchema = z.object({
  patientId: z.string().min(1, 'Patient ID is required'),
  requestDate: z.string().datetime('Invalid date format').transform((val) => new Date(val)),
  status: LabRequestStatusSchema.optional(),
  date_taken: z.string().datetime().transform((val) => new Date(val)).optional(),
  
  // Result fields
  fbs: LabTestFieldSchema,
  bun: LabTestFieldSchema,
  creatinine: LabTestFieldSchema,
  blood_uric_acid: LabTestFieldSchema,
  lipid_profile: LabTestFieldSchema,
  sgot: LabTestFieldSchema,
  sgpt: LabTestFieldSchema,
  alp: LabTestFieldSchema,
  sodium_na: LabTestFieldSchema,
  potassium_k: LabTestFieldSchema,
  hbalc: LabTestFieldSchema,
  ecg: LabTestFieldSchema,
  t3: LabTestFieldSchema,
  t4: LabTestFieldSchema,
  ft3: LabTestFieldSchema,
  ft4: LabTestFieldSchema,
  tsh: LabTestFieldSchema,
});

// Blood Chemistry Validation Schemas
const NumericResultSchema = z.number().min(0).optional();

export const CreateBloodChemistryCommandSchema = z.object({
  patient_name: z.string().min(1, 'Patient name is required').max(255, 'Patient name cannot exceed 255 characters'),
  age: z.number().int().min(0, 'Age must be positive').max(200, 'Age cannot exceed 200'),
  sex: z.string().min(1, 'Sex is required').refine(
    (val) => ['M', 'F', 'Male', 'Female', 'male', 'female'].includes(val),
    'Sex must be M, F, Male, or Female'
  ),
  date_taken: z.string().datetime('Invalid date format').transform((val) => new Date(val)),
  
  // Blood Chemistry Results
  fbs: NumericResultSchema,
  bun: NumericResultSchema,
  creatinine: NumericResultSchema,
  uric_acid: NumericResultSchema,
  cholesterol: NumericResultSchema,
  triglycerides: NumericResultSchema,
  hdl: NumericResultSchema,
  ldl: NumericResultSchema,
  vldl: NumericResultSchema,
  sodium: NumericResultSchema,
  potassium: NumericResultSchema,
  chloride: NumericResultSchema,
  calcium: NumericResultSchema,
  sgot: NumericResultSchema,
  sgpt: NumericResultSchema,
  rbs: NumericResultSchema,
  alk_phosphatase: NumericResultSchema,
  total_protein: NumericResultSchema,
  albumin: NumericResultSchema,
  globulin: NumericResultSchema,
  ag_ratio: NumericResultSchema,
  total_bilirubin: NumericResultSchema,
  direct_bilirubin: NumericResultSchema,
  indirect_bilirubin: NumericResultSchema,
  ionised_calcium: NumericResultSchema,
  magnesium: NumericResultSchema,
  hbalc: NumericResultSchema,
  ogtt_30min: NumericResultSchema,
  ogtt_1hr: NumericResultSchema,
  ogtt_2hr: NumericResultSchema,
  ppbs_2hr: NumericResultSchema,
  inor_phosphorus: NumericResultSchema,
}).refine((data) => {
  // Check if at least one result is provided
  const resultFields = [
    data.fbs, data.bun, data.creatinine, data.uric_acid, data.cholesterol,
    data.triglycerides, data.hdl, data.ldl, data.vldl, data.sodium,
    data.potassium, data.chloride, data.calcium, data.sgot, data.sgpt,
    data.rbs, data.alk_phosphatase, data.total_protein, data.albumin,
    data.globulin, data.ag_ratio, data.total_bilirubin, data.direct_bilirubin,
    data.indirect_bilirubin, data.ionised_calcium, data.magnesium,
    data.hbalc, data.ogtt_30min, data.ogtt_1hr, data.ogtt_2hr,
    data.ppbs_2hr, data.inor_phosphorus
  ];
  
  const hasResult = resultFields.some(field => field !== undefined && field !== null);
  return hasResult;
}, {
  message: 'At least one blood chemistry result must be provided',
});

export const UpdateBloodChemistryCommandSchema = z.object({
  id: z.string().min(1, 'ID cannot be empty'),
  patient_name: z.string().min(1, 'Patient name is required').max(255).optional(),
  age: z.number().int().min(0).max(200).optional(),
  sex: z.string().refine(
    (val) => ['M', 'F', 'Male', 'Female', 'male', 'female'].includes(val),
    'Sex must be M, F, Male, or Female'
  ).optional(),
  date_taken: z.string().datetime().transform((val) => new Date(val)).optional(),
  
  // All result fields optional for updates
  fbs: NumericResultSchema,
  bun: NumericResultSchema,
  creatinine: NumericResultSchema,
  uric_acid: NumericResultSchema,
  cholesterol: NumericResultSchema,
  triglycerides: NumericResultSchema,
  hdl: NumericResultSchema,
  ldl: NumericResultSchema,
  vldl: NumericResultSchema,
  sodium: NumericResultSchema,
  potassium: NumericResultSchema,
  chloride: NumericResultSchema,
  calcium: NumericResultSchema,
  sgot: NumericResultSchema,
  sgpt: NumericResultSchema,
  rbs: NumericResultSchema,
  alk_phosphatase: NumericResultSchema,
  total_protein: NumericResultSchema,
  albumin: NumericResultSchema,
  globulin: NumericResultSchema,
  ag_ratio: NumericResultSchema,
  total_bilirubin: NumericResultSchema,
  direct_bilirubin: NumericResultSchema,
  indirect_bilirubin: NumericResultSchema,
  ionised_calcium: NumericResultSchema,
  magnesium: NumericResultSchema,
  hbalc: NumericResultSchema,
  ogtt_30min: NumericResultSchema,
  ogtt_1hr: NumericResultSchema,
  ogtt_2hr: NumericResultSchema,
  ppbs_2hr: NumericResultSchema,
  inor_phosphorus: NumericResultSchema,
});

export const DeleteBloodChemistryCommandSchema = z.object({
  id: z.string().min(1, 'ID cannot be empty'),
});

// ID validation schemas
export const LabRequestIdSchema = z.string().min(1, 'Lab request ID cannot be empty');
export const BloodChemistryIdSchema = z.string().min(1, 'Blood chemistry ID cannot be empty');

// Export inferred types
export type CreateLabRequestCommand = z.infer<typeof CreateLabRequestCommandSchema>;
export type UpdateLabRequestCommand = z.infer<typeof UpdateLabRequestCommandSchema>;
export type DeleteLabRequestCommand = z.infer<typeof DeleteLabRequestCommandSchema>;
export type UpdateLabRequestResultsCommand = z.infer<typeof UpdateLabRequestResultsCommandSchema>;
export type CreateBloodChemistryCommand = z.infer<typeof CreateBloodChemistryCommandSchema>;
export type UpdateBloodChemistryCommand = z.infer<typeof UpdateBloodChemistryCommandSchema>;
export type DeleteBloodChemistryCommand = z.infer<typeof DeleteBloodChemistryCommandSchema>;

// Validation schema collection
export const LaboratoryValidationSchemas = {
  CreateLabRequestCommandSchema,
  UpdateLabRequestCommandSchema,
  DeleteLabRequestCommandSchema,
  UpdateLabRequestResultsCommandSchema,
  CreateBloodChemistryCommandSchema,
  UpdateBloodChemistryCommandSchema,
  DeleteBloodChemistryCommandSchema,
  LabRequestIdSchema,
  BloodChemistryIdSchema,
} as const;
