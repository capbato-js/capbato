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

// Lab Test Result validation schemas
export const BloodChemistryResultsSchema = z.object({
  fbs: z.number().min(0).max(1000).optional(),
  bun: z.number().min(0).max(300).optional(),
  creatinine: z.number().min(0).max(50).optional(),
  uricAcid: z.number().min(0).max(50).optional(),
  cholesterol: z.number().min(0).max(1000).optional(),
  triglycerides: z.number().min(0).max(2000).optional(),
  hdl: z.number().min(0).max(300).optional(),
  ldl: z.number().min(0).max(500).optional(),
  vldl: z.number().min(0).max(200).optional(),
  sodium: z.number().min(0).max(200).optional(),
  potassium: z.number().min(0).max(20).optional(),
  sgot: z.number().min(0).max(1000).optional(),
  sgpt: z.number().min(0).max(1000).optional(),
  alkPhosphatase: z.number().min(0).max(1000).optional(),
  hba1c: z.number().min(0).max(20).optional(),
}).optional();

export const UrinalysisResultsSchema = z.object({
  color: z.string().max(100).optional(),
  transparency: z.string().max(100).optional(),
  specificGravity: z.string().max(50).optional(),
  ph: z.string().max(50).optional(),
  protein: z.string().max(50).optional(),
  glucose: z.string().max(50).optional(),
  epithelialCells: z.string().max(100).optional(),
  redCells: z.string().max(50).optional(),
  pusCells: z.string().max(50).optional(),
  mucusThread: z.string().max(100).optional(),
  amorphousUrates: z.string().max(100).optional(),
  amorphousPhosphate: z.string().max(100).optional(),
  crystals: z.string().max(100).optional(),
  bacteria: z.string().max(100).optional(),
  others: z.string().max(255).optional(),
  pregnancyTest: z.string().max(50).optional(),
}).optional();

export const HematologyResultsSchema = z.object({
  hematocrit: z.string().max(50).optional(),
  hemoglobin: z.string().max(50).optional(),
  rbc: z.string().max(50).optional(),
  wbc: z.string().max(50).optional(),
  segmenters: z.string().max(50).optional(),
  lymphocyte: z.string().max(50).optional(),
  monocyte: z.string().max(50).optional(),
  basophils: z.string().max(50).optional(),
  eosinophils: z.string().max(50).optional(),
  platelet: z.string().max(50).optional(),
  others: z.string().max(255).optional(),
}).optional();

export const FecalysisResultsSchema = z.object({
  color: z.string().max(100).optional(),
  consistency: z.string().max(100).optional(),
  rbc: z.string().max(50).optional(),
  wbc: z.string().max(50).optional(),
  occultBlood: z.string().max(50).optional(),
  urobilinogen: z.string().max(50).optional(),
  others: z.string().max(255).optional(),
}).optional();

export const SerologyResultsSchema = z.object({
  ft3: z.number().min(0).max(50).optional(),
  ft4: z.number().min(0).max(50).optional(),
  tsh: z.number().min(0).max(100).optional(),
}).optional();

export const DengueResultsSchema = z.object({
  igg: z.string().max(50).optional(),
  igm: z.string().max(50).optional(),
  ns1: z.string().max(50).optional(),
}).optional();

export const EcgResultsSchema = z.object({
  av: z.string().max(100).optional(),
  qrs: z.string().max(100).optional(),
  axis: z.string().max(100).optional(),
  pr: z.string().max(100).optional(),
  qt: z.string().max(100).optional(),
  stT: z.string().max(100).optional(),
  rhythm: z.string().max(100).optional(),
  others: z.string().max(255).optional(),
  interpretation: z.string().max(500).optional(),
  interpreter: z.string().max(255).optional(),
}).optional();

export const CoagulationResultsSchema = z.object({
  patientPt: z.string().max(50).optional(),
  controlPt: z.string().max(50).optional(),
  inr: z.string().max(50).optional(),
  activityPercent: z.string().max(50).optional(),
  patientPtt: z.string().max(50).optional(),
  controlPtt: z.string().max(50).optional(),
}).optional();

export const CreateLabTestResultCommandSchema = z.object({
  labRequestId: z.string()
    .min(1, 'Lab request ID cannot be empty')
    .regex(/^[0-9a-fA-F]{32}$/, 'Lab request ID must be a valid dashless UUID format (32 hexadecimal characters)'),
  dateTested: z.string().datetime().describe('Date and time when tests were performed'),
  doctorId: z.string()
    .regex(/^[0-9a-fA-F]{32}$/, 'Doctor ID must be a valid dashless UUID format (32 hexadecimal characters)')
    .optional(),
  bloodChemistry: BloodChemistryResultsSchema,
  urinalysis: UrinalysisResultsSchema,
  hematology: HematologyResultsSchema,
  fecalysis: FecalysisResultsSchema,
  serology: SerologyResultsSchema,
  dengue: DengueResultsSchema,
  ecg: EcgResultsSchema,
  coagulation: CoagulationResultsSchema,
  remarks: z.string().max(500).optional(),
}).refine(
  (data) => data.bloodChemistry || data.urinalysis || data.hematology || data.fecalysis || data.serology || data.dengue || data.ecg || data.coagulation,
  {
    message: 'At least one test result type must be provided',
    path: ['testResults'],
  }
).refine(
  (data) => {
    // Check if any provided test result has actual values
    const categories = [
      data.bloodChemistry,
      data.urinalysis,
      data.hematology,
      data.fecalysis,
      data.serology,
      data.dengue,
      data.ecg,
      data.coagulation
    ];
    
    for (const category of categories) {
      if (category) {
        const values = Object.values(category);
        const hasValues = values.some(value => value !== undefined && value !== null && value !== '');
        if (hasValues) {
          return true;
        }
      }
    }
    
    return false;
  },
  {
    message: 'Test result objects must contain actual result values, not empty objects',
    path: ['testResults'],
  }
);

export const LabTestResultIdSchema = z.string()
  .min(1, 'Lab test result ID cannot be empty')
  .regex(/^[0-9a-fA-F]{32}$/, 'Lab test result ID must be a valid dashless UUID format (32 hexadecimal characters)');

export const DeleteLabTestResultCommandSchema = z.object({
  id: z.string().min(1, 'ID cannot be empty'),
});

export const UpdateLabTestResultCommandSchema = z.object({
  id: z.string().min(1, 'ID cannot be empty'),
  labRequestId: z.string()
    .min(1, 'Lab request ID cannot be empty')
    .regex(/^[0-9a-fA-F]{32}$/, 'Lab request ID must be a valid dashless UUID format (32 hexadecimal characters)')
    .optional(),
  dateTested: z.string().datetime().describe('Date and time when tests were performed').optional(),
  doctorId: z.string()
    .regex(/^[0-9a-fA-F]{32}$/, 'Doctor ID must be a valid dashless UUID format (32 hexadecimal characters)')
    .optional(),
  bloodChemistry: BloodChemistryResultsSchema.optional(),
  urinalysis: UrinalysisResultsSchema.optional(),
  hematology: HematologyResultsSchema.optional(),
  fecalysis: FecalysisResultsSchema.optional(),
  serology: SerologyResultsSchema.optional(),
  dengue: DengueResultsSchema.optional(),
  ecg: EcgResultsSchema.optional(),
  coagulation: CoagulationResultsSchema.optional(),
  remarks: z.string().max(500).optional(),
}).refine(
  (data) => {
    // For updates, allow partial updates - if any test result field is provided, it should have values
    const categories = [
      data.bloodChemistry,
      data.urinalysis,
      data.hematology,
      data.fecalysis,
      data.serology,
      data.dengue,
      data.ecg,
      data.coagulation
    ];
    
    // If no test categories are provided, that's fine for partial updates
    const providedCategories = categories.filter(cat => cat !== undefined);
    if (providedCategories.length === 0) {
      return true; // Allow updates with no test result changes
    }
    
    // Check if provided categories have actual values
    for (const category of providedCategories) {
      if (category) {
        const values = Object.values(category);
        const hasValues = values.some(value => value !== undefined && value !== null && value !== '');
        if (hasValues) {
          return true;
        }
      }
    }
    
    return false;
  },
  {
    message: 'Provided test result objects must contain actual result values, not empty objects',
    path: ['testResults'],
  }
);

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
export type CreateLabTestResultCommand = z.infer<typeof CreateLabTestResultCommandSchema>;
export type UpdateLabTestResultCommand = z.infer<typeof UpdateLabTestResultCommandSchema>;
export type DeleteLabTestResultCommand = z.infer<typeof DeleteLabTestResultCommandSchema>;
export type HematologyResults = z.infer<typeof HematologyResultsSchema>;
export type FecalysisResults = z.infer<typeof FecalysisResultsSchema>;
export type SerologyResults = z.infer<typeof SerologyResultsSchema>;
export type DengueResults = z.infer<typeof DengueResultsSchema>;
export type EcgResults = z.infer<typeof EcgResultsSchema>;
export type CoagulationResults = z.infer<typeof CoagulationResultsSchema>;

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
  CreateLabTestResultCommandSchema,
  UpdateLabTestResultCommandSchema,
  DeleteLabTestResultCommandSchema,
  LabTestResultIdSchema,
} as const;
