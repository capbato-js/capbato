import { z } from 'zod';

/**
 * Zod schemas for Laboratory command validation
 * These schemas define the validation rules and generate TypeScript types
 */

// Lab Request Status Schema
export const LabRequestStatusSchema = z.enum(['pending', 'in_progress', 'completed', 'cancelled']);

// Test Category Schemas
const RoutineTestsSchema = z.object({
  cbcWithPlatelet: z.boolean().optional().default(false),
  pregnancyTest: z.boolean().optional().default(false),
  urinalysis: z.boolean().optional().default(false),
  fecalysis: z.boolean().optional().default(false),
  occultBloodTest: z.boolean().optional().default(false),
}).optional();

const SerologyTestsSchema = z.object({
  hepatitisBScreening: z.boolean().optional().default(false),
  hepatitisAScreening: z.boolean().optional().default(false),
  hepatitisCScreening: z.boolean().optional().default(false),
  hepatitisProfile: z.boolean().optional().default(false),
  vdrlRpr: z.boolean().optional().default(false),
  crp: z.boolean().optional().default(false),
  dengueNs1: z.boolean().optional().default(false),
  aso: z.boolean().optional().default(false),
  crf: z.boolean().optional().default(false),
  raRf: z.boolean().optional().default(false),
  tumorMarkers: z.boolean().optional().default(false),
  ca125: z.boolean().optional().default(false),
  cea: z.boolean().optional().default(false),
  psa: z.boolean().optional().default(false),
  betaHcg: z.boolean().optional().default(false),
}).optional();

const BloodChemistryTestsSchema = z.object({
  fbs: z.boolean().optional().default(false),
  bun: z.boolean().optional().default(false),
  creatinine: z.boolean().optional().default(false),
  bloodUricAcid: z.boolean().optional().default(false),
  lipidProfile: z.boolean().optional().default(false),
  sgot: z.boolean().optional().default(false),
  sgpt: z.boolean().optional().default(false),
  alkalinePhosphatase: z.boolean().optional().default(false),
  sodium: z.boolean().optional().default(false),
  potassium: z.boolean().optional().default(false),
  hba1c: z.boolean().optional().default(false),
}).optional();

const MiscellaneousTestsSchema = z.object({
  ecg: z.boolean().optional().default(false),
}).optional();

const ThyroidTestsSchema = z.object({
  t3: z.boolean().optional().default(false),
  t4: z.boolean().optional().default(false),
  ft3: z.boolean().optional().default(false),
  ft4: z.boolean().optional().default(false),
  tsh: z.boolean().optional().default(false),
}).optional();

// Lab Request Validation Schemas
export const CreateLabRequestCommandSchema = z.object({
  patientId: z.string().min(1, 'Patient ID is required'),
  requestDate: z.string().datetime('Invalid date format').transform((val) => new Date(val)),
  others: z.string().optional(),
  
  // Grouped test categories
  routine: RoutineTestsSchema,
  serology: SerologyTestsSchema,
  bloodChemistry: BloodChemistryTestsSchema,
  miscellaneous: MiscellaneousTestsSchema,
  thyroid: ThyroidTestsSchema,
}).refine((data) => {
  // Check if at least one test is selected across all categories
  const hasAnyTest = 
    (data.routine && Object.values(data.routine).some(v => v === true)) ||
    (data.serology && Object.values(data.serology).some(v => v === true)) ||
    (data.bloodChemistry && Object.values(data.bloodChemistry).some(v => v === true)) ||
    (data.miscellaneous && Object.values(data.miscellaneous).some(v => v === true)) ||
    (data.thyroid && Object.values(data.thyroid).some(v => v === true));
  
  return hasAnyTest;
}, {
  message: 'At least one laboratory test must be selected',
});

export const UpdateLabRequestCommandSchema = z.object({
  id: z.string().min(1, 'ID cannot be empty'),
  patientId: z.string().min(1, 'Patient ID is required').optional(),
  requestDate: z.string().datetime().transform((val) => new Date(val)).optional(),
  status: LabRequestStatusSchema.optional(),
  dateTaken: z.string().datetime().transform((val) => new Date(val)).optional(),
  others: z.string().optional(),
  
  // Grouped test categories - all optional for updates
  routine: RoutineTestsSchema.optional(),
  serology: SerologyTestsSchema.optional(),
  bloodChemistry: BloodChemistryTestsSchema.optional(),
  miscellaneous: MiscellaneousTestsSchema.optional(),
  thyroid: ThyroidTestsSchema.optional(),
});

export const DeleteLabRequestCommandSchema = z.object({
  id: z.string().min(1, 'ID cannot be empty'),
});

export const UpdateLabRequestResultsCommandSchema = z.object({
  patientId: z.string().min(1, 'Patient ID is required'),
  requestDate: z.string().datetime('Invalid date format').transform((val) => new Date(val)),
  status: LabRequestStatusSchema.optional(),
  dateTaken: z.string().datetime().transform((val) => new Date(val)).optional(),
  
  // Grouped test categories for result updates
  routine: RoutineTestsSchema.optional(),
  serology: SerologyTestsSchema.optional(),
  bloodChemistry: BloodChemistryTestsSchema.optional(),
  miscellaneous: MiscellaneousTestsSchema.optional(),
  thyroid: ThyroidTestsSchema.optional(),
});

// Blood Chemistry Validation Schemas
const NumericResultSchema = z.number().min(0).optional();

export const CreateBloodChemistryCommandSchema = z.object({
  labRequestId: z.string().optional(),
  patientId: z.string().optional(),
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

// Urinalysis Result Validation Schemas
export const CreateUrinalysisResultCommandSchema = z.object({
  labRequestId: z.string().min(1, 'Lab request ID is required'),
  patientId: z.string().min(1, 'Patient ID is required'),
  patientName: z.string().min(1, 'Patient name is required'),
  age: z.string().optional(),
  sex: z.string().optional(),
  dateTaken: z.string().datetime('Invalid date format').transform((val) => new Date(val)),
  color: z.string().optional(),
  transparency: z.string().optional(),
  specificGravity: z.string().optional(),
  ph: z.string().optional(),
  protein: z.string().optional(),
  glucose: z.string().optional(),
  epithelialCells: z.string().optional(),
  redCells: z.string().optional(),
  pusCells: z.string().optional(),
  mucusThread: z.string().optional(),
  amorphousUrates: z.string().optional(),
  amorphousPhosphate: z.string().optional(),
  crystals: z.string().optional(),
  bacteria: z.string().optional(),
  others: z.string().optional(),
  pregnancyTest: z.string().optional(),
});

export const UpdateUrinalysisResultCommandSchema = CreateUrinalysisResultCommandSchema.partial().extend({
  id: z.string().min(1, 'ID is required for update'),
});

export const DeleteUrinalysisResultCommandSchema = z.object({
  id: z.string().min(1, 'ID cannot be empty'),
});

// Hematology Result Validation Schemas
export const CreateHematologyResultCommandSchema = z.object({
  labRequestId: z.string().min(1, 'Lab request ID is required'),
  patientId: z.string().min(1, 'Patient ID is required'),
  patientName: z.string().min(1, 'Patient name is required'),
  age: z.string().optional(),
  sex: z.string().optional(),
  dateTaken: z.string().datetime('Invalid date format').transform((val) => new Date(val)),
  hemoglobin: z.string().optional(),
  hematocrit: z.string().optional(),
  rbc: z.string().optional(),
  wbc: z.string().optional(),
  plateletCount: z.string().optional(),
  neutrophils: z.string().optional(),
  lymphocytes: z.string().optional(),
  monocytes: z.string().optional(),
  eosinophils: z.string().optional(),
  basophils: z.string().optional(),
  mcv: z.string().optional(),
  mch: z.string().optional(),
  mchc: z.string().optional(),
  esr: z.string().optional(),
});

export const UpdateHematologyResultCommandSchema = CreateHematologyResultCommandSchema.partial().extend({
  id: z.string().min(1, 'ID is required for update'),
});

export const DeleteHematologyResultCommandSchema = z.object({
  id: z.string().min(1, 'ID cannot be empty'),
});

// Fecalysis Result Validation Schemas
export const CreateFecalysisResultCommandSchema = z.object({
  labRequestId: z.string().min(1, 'Lab request ID is required'),
  patientId: z.string().min(1, 'Patient ID is required'),
  patientName: z.string().min(1, 'Patient name is required'),
  age: z.string().optional(),
  sex: z.string().optional(),
  dateTaken: z.string().datetime('Invalid date format').transform((val) => new Date(val)),
  color: z.string().optional(),
  consistency: z.string().optional(),
  rbc: z.string().optional(),
  wbc: z.string().optional(),
  occultBlood: z.string().optional(),
  urobilinogen: z.string().optional(),
  others: z.string().optional(),
});

export const UpdateFecalysisResultCommandSchema = CreateFecalysisResultCommandSchema.partial().extend({
  id: z.string().min(1, 'ID is required for update'),
});

export const DeleteFecalysisResultCommandSchema = z.object({
  id: z.string().min(1, 'ID cannot be empty'),
});

// Serology Result Validation Schemas
export const CreateSerologyResultCommandSchema = z.object({
  labRequestId: z.string().min(1, 'Lab request ID is required'),
  patientId: z.string().min(1, 'Patient ID is required'),
  patientName: z.string().min(1, 'Patient name is required'),
  age: z.string().optional(),
  sex: z.string().optional(),
  dateTaken: z.string().datetime('Invalid date format').transform((val) => new Date(val)),
  vdrl: z.string().optional(),
  rpr: z.string().optional(),
  hbsag: z.string().optional(),
  antiHcv: z.string().optional(),
  hivTest: z.string().optional(),
  pregnancyTest: z.string().optional(),
  dengueNs1: z.string().optional(),
  dengueTourniquet: z.string().optional(),
  weilFelix: z.string().optional(),
  typhidot: z.string().optional(),
  bloodType: z.string().optional(),
  rhFactor: z.string().optional(),
  others: z.string().optional(),
});

export const UpdateSerologyResultCommandSchema = CreateSerologyResultCommandSchema.partial().extend({
  id: z.string().min(1, 'ID is required for update'),
});

export const DeleteSerologyResultCommandSchema = z.object({
  id: z.string().min(1, 'ID cannot be empty'),
});

// ID validation schemas for new entities
export const UrinalysisResultIdSchema = z.string()
  .min(1, 'Urinalysis result ID cannot be empty')
  .regex(/^[0-9a-fA-F]{32}$/, 'Urinalysis result ID must be a valid dashless UUID format (32 hexadecimal characters)');

export const HematologyResultIdSchema = z.string()
  .min(1, 'Hematology result ID cannot be empty')
  .regex(/^[0-9a-fA-F]{32}$/, 'Hematology result ID must be a valid dashless UUID format (32 hexadecimal characters)');

export const FecalysisResultIdSchema = z.string()
  .min(1, 'Fecalysis result ID cannot be empty')
  .regex(/^[0-9a-fA-F]{32}$/, 'Fecalysis result ID must be a valid dashless UUID format (32 hexadecimal characters)');

export const SerologyResultIdSchema = z.string()
  .min(1, 'Serology result ID cannot be empty')
  .regex(/^[0-9a-fA-F]{32}$/, 'Serology result ID must be a valid dashless UUID format (32 hexadecimal characters)');

// Export inferred types
export type CreateLabRequestCommand = z.infer<typeof CreateLabRequestCommandSchema>;
export type UpdateLabRequestCommand = z.infer<typeof UpdateLabRequestCommandSchema>;
export type DeleteLabRequestCommand = z.infer<typeof DeleteLabRequestCommandSchema>;
export type UpdateLabRequestResultsCommand = z.infer<typeof UpdateLabRequestResultsCommandSchema>;
export type CreateBloodChemistryCommand = z.infer<typeof CreateBloodChemistryCommandSchema>;
export type UpdateBloodChemistryCommand = z.infer<typeof UpdateBloodChemistryCommandSchema>;
export type DeleteBloodChemistryCommand = z.infer<typeof DeleteBloodChemistryCommandSchema>;
export type CreateUrinalysisResultCommand = z.infer<typeof CreateUrinalysisResultCommandSchema>;
export type UpdateUrinalysisResultCommand = z.infer<typeof UpdateUrinalysisResultCommandSchema>;
export type DeleteUrinalysisResultCommand = z.infer<typeof DeleteUrinalysisResultCommandSchema>;
export type CreateHematologyResultCommand = z.infer<typeof CreateHematologyResultCommandSchema>;
export type UpdateHematologyResultCommand = z.infer<typeof UpdateHematologyResultCommandSchema>;
export type DeleteHematologyResultCommand = z.infer<typeof DeleteHematologyResultCommandSchema>;
export type CreateFecalysisResultCommand = z.infer<typeof CreateFecalysisResultCommandSchema>;
export type UpdateFecalysisResultCommand = z.infer<typeof UpdateFecalysisResultCommandSchema>;
export type DeleteFecalysisResultCommand = z.infer<typeof DeleteFecalysisResultCommandSchema>;
export type CreateSerologyResultCommand = z.infer<typeof CreateSerologyResultCommandSchema>;
export type UpdateSerologyResultCommand = z.infer<typeof UpdateSerologyResultCommandSchema>;
export type DeleteSerologyResultCommand = z.infer<typeof DeleteSerologyResultCommandSchema>;

// Validation schema collection
export const LaboratoryValidationSchemas = {
  CreateLabRequestCommandSchema,
  UpdateLabRequestCommandSchema,
  DeleteLabRequestCommandSchema,
  UpdateLabRequestResultsCommandSchema,
  CreateBloodChemistryCommandSchema,
  UpdateBloodChemistryCommandSchema,
  DeleteBloodChemistryCommandSchema,
  CreateUrinalysisResultCommandSchema,
  UpdateUrinalysisResultCommandSchema,
  DeleteUrinalysisResultCommandSchema,
  CreateHematologyResultCommandSchema,
  UpdateHematologyResultCommandSchema,
  DeleteHematologyResultCommandSchema,
  CreateFecalysisResultCommandSchema,
  UpdateFecalysisResultCommandSchema,
  DeleteFecalysisResultCommandSchema,
  CreateSerologyResultCommandSchema,
  UpdateSerologyResultCommandSchema,
  DeleteSerologyResultCommandSchema,
  LabRequestIdSchema,
  BloodChemistryIdSchema,
  UrinalysisResultIdSchema,
  HematologyResultIdSchema,
  FecalysisResultIdSchema,
  SerologyResultIdSchema,
} as const;
