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
  patientId: z.string().min(1, 'Patient ID is required'),
  patientName: z.string().min(1, 'Patient name is required').max(255, 'Patient name cannot exceed 255 characters'),
  ageGender: z.string().min(1, 'Age and gender information is required'),
  requestDate: z.string().datetime('Invalid date format').transform((val) => new Date(val)),
  others: z.string().optional(),
  
  // Basic Tests
  cbcWithPlatelet: LabTestFieldSchema,
  pregnancyTest: LabTestFieldSchema,
  urinalysis: LabTestFieldSchema,
  fecalysis: LabTestFieldSchema,
  occultBloodTest: LabTestFieldSchema,
  
  // Hepatitis Tests
  hepaBScreening: LabTestFieldSchema,
  hepaAScreening: LabTestFieldSchema,
  hepatitisProfile: LabTestFieldSchema,
  
  // STD Tests
  vdrlRpr: LabTestFieldSchema,
  
  // Other Tests
  dengueNs1: LabTestFieldSchema,
  ca125CeaPsa: LabTestFieldSchema,
  
  // Blood Chemistry Results
  fbs: LabTestFieldSchema,
  bun: LabTestFieldSchema,
  creatinine: LabTestFieldSchema,
  bloodUricAcid: LabTestFieldSchema,
  lipidProfile: LabTestFieldSchema,
  sgot: LabTestFieldSchema,
  sgpt: LabTestFieldSchema,
  alp: LabTestFieldSchema,
  sodiumNa: LabTestFieldSchema,
  potassiumK: LabTestFieldSchema,
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
    data.cbcWithPlatelet, data.pregnancyTest, data.urinalysis, data.fecalysis,
    data.occultBloodTest, data.hepaBScreening, data.hepaAScreening,
    data.hepatitisProfile, data.vdrlRpr, data.dengueNs1, data.ca125CeaPsa,
    data.fbs, data.bun, data.creatinine, data.bloodUricAcid, data.lipidProfile,
    data.sgot, data.sgpt, data.alp, data.sodiumNa, data.potassiumK, data.hbalc,
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
  patientId: z.string().min(1, 'Patient ID is required').optional(),
  patientName: z.string().min(1, 'Patient name is required').max(255).optional(),
  ageGender: z.string().min(1, 'Age and gender information is required').optional(),
  requestDate: z.string().datetime().transform((val) => new Date(val)).optional(),
  status: LabRequestStatusSchema.optional(),
  dateTaken: z.string().datetime().transform((val) => new Date(val)).optional(),
  others: z.string().optional(),
  
  // Test fields - same as create but all optional
  cbcWithPlatelet: LabTestFieldSchema,
  pregnancyTest: LabTestFieldSchema,
  urinalysis: LabTestFieldSchema,
  fecalysis: LabTestFieldSchema,
  occultBloodTest: LabTestFieldSchema,
  hepaBScreening: LabTestFieldSchema,
  hepaAScreening: LabTestFieldSchema,
  hepatitisProfile: LabTestFieldSchema,
  vdrlRpr: LabTestFieldSchema,
  dengueNs1: LabTestFieldSchema,
  ca125CeaPsa: LabTestFieldSchema,
  fbs: LabTestFieldSchema,
  bun: LabTestFieldSchema,
  creatinine: LabTestFieldSchema,
  bloodUricAcid: LabTestFieldSchema,
  lipidProfile: LabTestFieldSchema,
  sgot: LabTestFieldSchema,
  sgpt: LabTestFieldSchema,
  alp: LabTestFieldSchema,
  sodiumNa: LabTestFieldSchema,
  potassiumK: LabTestFieldSchema,
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
  dateTaken: z.string().datetime().transform((val) => new Date(val)).optional(),
  
  // Result fields
  fbs: LabTestFieldSchema,
  bun: LabTestFieldSchema,
  creatinine: LabTestFieldSchema,
  bloodUricAcid: LabTestFieldSchema,
  lipidProfile: LabTestFieldSchema,
  sgot: LabTestFieldSchema,
  sgpt: LabTestFieldSchema,
  alp: LabTestFieldSchema,
  sodiumNa: LabTestFieldSchema,
  potassiumK: LabTestFieldSchema,
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
  patientName: z.string().min(1, 'Patient name is required').max(255, 'Patient name cannot exceed 255 characters'),
  age: z.number().int().min(0, 'Age must be positive').max(200, 'Age cannot exceed 200'),
  sex: z.string().min(1, 'Sex is required').refine(
    (val) => ['M', 'F', 'Male', 'Female', 'male', 'female'].includes(val),
    'Sex must be M, F, Male, or Female'
  ),
  dateTaken: z.string().datetime('Invalid date format').transform((val) => new Date(val)),
  
  // Blood Chemistry Results
  fbs: NumericResultSchema,
  bun: NumericResultSchema,
  creatinine: NumericResultSchema,
  uricAcid: NumericResultSchema,
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
  alkPhosphatase: NumericResultSchema,
  totalProtein: NumericResultSchema,
  albumin: NumericResultSchema,
  globulin: NumericResultSchema,
  agRatio: NumericResultSchema,
  totalBilirubin: NumericResultSchema,
  directBilirubin: NumericResultSchema,
  indirectBilirubin: NumericResultSchema,
  ionisedCalcium: NumericResultSchema,
  magnesium: NumericResultSchema,
  hbalc: NumericResultSchema,
  ogtt30min: NumericResultSchema,
  ogtt1hr: NumericResultSchema,
  ogtt2hr: NumericResultSchema,
  ppbs2hr: NumericResultSchema,
  inorPhosphorus: NumericResultSchema,
}).refine((data) => {
  // Check if at least one result is provided
  const resultFields = [
    data.fbs, data.bun, data.creatinine, data.uricAcid, data.cholesterol,
    data.triglycerides, data.hdl, data.ldl, data.vldl, data.sodium,
    data.potassium, data.chloride, data.calcium, data.sgot, data.sgpt,
    data.rbs, data.alkPhosphatase, data.totalProtein, data.albumin,
    data.globulin, data.agRatio, data.totalBilirubin, data.directBilirubin,
    data.indirectBilirubin, data.ionisedCalcium, data.magnesium,
    data.hbalc, data.ogtt30min, data.ogtt1hr, data.ogtt2hr,
    data.ppbs2hr, data.inorPhosphorus
  ];
  
  const hasResult = resultFields.some(field => field !== undefined && field !== null);
  return hasResult;
}, {
  message: 'At least one blood chemistry result must be provided',
});

export const UpdateBloodChemistryCommandSchema = z.object({
  id: z.string().min(1, 'ID cannot be empty'),
  patientName: z.string().min(1, 'Patient name is required').max(255).optional(),
  age: z.number().int().min(0).max(200).optional(),
  sex: z.string().refine(
    (val) => ['M', 'F', 'Male', 'Female', 'male', 'female'].includes(val),
    'Sex must be M, F, Male, or Female'
  ).optional(),
  dateTaken: z.string().datetime().transform((val) => new Date(val)).optional(),
  
  // All result fields optional for updates
  fbs: NumericResultSchema,
  bun: NumericResultSchema,
  creatinine: NumericResultSchema,
  uricAcid: NumericResultSchema,
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
  alkPhosphatase: NumericResultSchema,
  totalProtein: NumericResultSchema,
  albumin: NumericResultSchema,
  globulin: NumericResultSchema,
  agRatio: NumericResultSchema,
  totalBilirubin: NumericResultSchema,
  directBilirubin: NumericResultSchema,
  indirectBilirubin: NumericResultSchema,
  ionisedCalcium: NumericResultSchema,
  magnesium: NumericResultSchema,
  hbalc: NumericResultSchema,
  ogtt30min: NumericResultSchema,
  ogtt1hr: NumericResultSchema,
  ogtt2hr: NumericResultSchema,
  ppbs2hr: NumericResultSchema,
  inorPhosphorus: NumericResultSchema,
});

export const DeleteBloodChemistryCommandSchema = z.object({
  id: z.string().min(1, 'ID cannot be empty'),
});

// ID validation schemas - Dashless UUID format
export const LabRequestIdSchema = z.string()
  .min(1, 'Lab request ID cannot be empty')
  .regex(/^[0-9a-fA-F]{32}$/, 'Lab request ID must be a valid dashless UUID format (32 hexadecimal characters)');

export const BloodChemistryIdSchema = z.string()
  .min(1, 'Blood chemistry ID cannot be empty')
  .regex(/^[0-9a-fA-F]{32}$/, 'Blood chemistry ID must be a valid dashless UUID format (32 hexadecimal characters)');

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
