// Command DTOs for CQRS pattern
// TypeScript types are now generated from Zod schemas for consistency

// Re-export command types from validation schemas
export type {
  CreateLabRequestCommand,
  UpdateLabRequestCommand,
  DeleteLabRequestCommand,
  UpdateLabRequestResultsCommand,
  CreateBloodChemistryCommand,
  UpdateBloodChemistryCommand,
  DeleteBloodChemistryCommand,
  CreateUrinalysisResultCommand,
  UpdateUrinalysisResultCommand,
  DeleteUrinalysisResultCommand,
  CreateHematologyResultCommand,
  UpdateHematologyResultCommand,
  DeleteHematologyResultCommand,
  CreateFecalysisResultCommand,
  UpdateFecalysisResultCommand,
  DeleteFecalysisResultCommand,
  CreateSerologyResultCommand,
  UpdateSerologyResultCommand,
  DeleteSerologyResultCommand,
  CreateLabTestResultCommand,
  UpdateLabTestResultCommand,
  DeleteLabTestResultCommand,
} from '../validation/LaboratoryValidationSchemas';

// Re-export validation schemas for backward compatibility
export {
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
  CreateLabTestResultCommandSchema,
  UpdateLabTestResultCommandSchema,
  DeleteLabTestResultCommandSchema,
  LaboratoryValidationSchemas,
} from '../validation/LaboratoryValidationSchemas';

// Request DTOs for API endpoints
export interface CreateLabRequestRequestDto {
  patientId: string;
  requestDate: string;
  others?: string;
  
  // Grouped test categories
  routine?: {
    cbcWithPlatelet?: boolean;
    pregnancyTest?: boolean;
    urinalysis?: boolean;
    fecalysis?: boolean;
    occultBloodTest?: boolean;
  };
  
  serology?: {
    hepatitisBScreening?: boolean;
    hepatitisAScreening?: boolean;
    hepatitisCScreening?: boolean;
    hepatitisProfile?: boolean;
    vdrlRpr?: boolean;
    crp?: boolean;
    dengueNs1?: boolean;
    aso?: boolean;
    crf?: boolean;
    raRf?: boolean;
    tumorMarkers?: boolean;
    ca125?: boolean;
    cea?: boolean;
    psa?: boolean;
    betaHcg?: boolean;
  };
  
  bloodChemistry?: {
    fbs?: boolean;
    bun?: boolean;
    creatinine?: boolean;
    bloodUricAcid?: boolean;
    lipidProfile?: boolean;
    sgot?: boolean;
    sgpt?: boolean;
    alkalinePhosphatase?: boolean;
    sodium?: boolean;
    potassium?: boolean;
    hba1c?: boolean;
  };
  
  miscellaneous?: {
    ecg?: boolean;
  };
  
  thyroid?: {
    t3?: boolean;
    t4?: boolean;
    ft3?: boolean;
    ft4?: boolean;
    tsh?: boolean;
  };
}

export interface UpdateLabRequestRequestDto {
  id: string;
  patient_id?: string;
  patient_name?: string;
  age_gender?: string;
  request_date?: string;
  status?: string;
  date_taken?: string;
  others?: string;
  
  // Test fields - all optional for updates
  cbc_with_platelet?: string;
  pregnancy_test?: string;
  urinalysis?: string;
  fecalysis?: string;
  occult_blood_test?: string;
  hepa_b_screening?: string;
  hepa_a_screening?: string;
  hepatitis_profile?: string;
  vdrl_rpr?: string;
  dengue_ns1?: string;
  ca_125_cea_psa?: string;
  fbs?: string;
  bun?: string;
  creatinine?: string;
  blood_uric_acid?: string;
  lipid_profile?: string;
  sgot?: string;
  sgpt?: string;
  alp?: string;
  sodium_na?: string;
  potassium_k?: string;
  hbalc?: string;
  ecg?: string;
  t3?: string;
  t4?: string;
  ft3?: string;
  ft4?: string;
  tsh?: string;
}

export interface UpdateLabRequestResultsRequestDto {
  patientId: string;
  requestDate: string;
  status?: string;
  date_taken?: string;
  
  // Result fields
  fbs?: string;
  bun?: string;
  creatinine?: string;
  blood_uric_acid?: string;
  lipid_profile?: string;
  sgot?: string;
  sgpt?: string;
  alp?: string;
  sodium_na?: string;
  potassium_k?: string;
  hbalc?: string;
  ecg?: string;
  t3?: string;
  t4?: string;
  ft3?: string;
  ft4?: string;
  tsh?: string;
}

export interface CreateBloodChemistryRequestDto {
  patient_name: string;
  age: number;
  sex: string;
  date_taken: string;
  
  // Blood Chemistry Results
  fbs?: number;
  bun?: number;
  creatinine?: number;
  uric_acid?: number;
  cholesterol?: number;
  triglycerides?: number;
  hdl?: number;
  ldl?: number;
  vldl?: number;
  sodium?: number;
  potassium?: number;
  chloride?: number;
  calcium?: number;
  sgot?: number;
  sgpt?: number;
  rbs?: number;
  alk_phosphatase?: number;
  total_protein?: number;
  albumin?: number;
  globulin?: number;
  ag_ratio?: number;
  total_bilirubin?: number;
  direct_bilirubin?: number;
  indirect_bilirubin?: number;
  ionised_calcium?: number;
  magnesium?: number;
  hbalc?: number;
  ogtt_30min?: number;
  ogtt_1hr?: number;
  ogtt_2hr?: number;
  ppbs_2hr?: number;
  inor_phosphorus?: number;
}

export interface UpdateBloodChemistryRequestDto {
  id: string;
  patient_name?: string;
  age?: number;
  sex?: string;
  date_taken?: string;
  
  // All result fields optional for updates
  fbs?: number;
  bun?: number;
  creatinine?: number;
  uric_acid?: number;
  cholesterol?: number;
  triglycerides?: number;
  hdl?: number;
  ldl?: number;
  vldl?: number;
  sodium?: number;
  potassium?: number;
  chloride?: number;
  calcium?: number;
  sgot?: number;
  sgpt?: number;
  rbs?: number;
  alk_phosphatase?: number;
  total_protein?: number;
  albumin?: number;
  globulin?: number;
  ag_ratio?: number;
  total_bilirubin?: number;
  direct_bilirubin?: number;
  indirect_bilirubin?: number;
  ionised_calcium?: number;
  magnesium?: number;
  hbalc?: number;
  ogtt_30min?: number;
  ogtt_1hr?: number;
  ogtt_2hr?: number;
  ppbs_2hr?: number;
  inor_phosphorus?: number;
}

// Response DTOs for API responses
export interface LabRequestDto {
  id?: string;
  patient: {
    id: string;
    patientNumber?: string; // Optional: Proper patient number from PatientEntity
    firstName?: string; // Optional: First name from PatientEntity  
    lastName?: string; // Optional: Last name from PatientEntity
    name: string; // Required: Full name for backward compatibility
    ageGender: string;
  };
  requestDate: string;
  status: string;
  dateTaken?: string;
  others?: string;
  selectedTests: string[];
  createdAt: string;
  updatedAt?: string;
}

export interface BloodChemistryDto {
  id?: string;
  labRequestId?: string;
  patient: {
    name: string;
    age: number;
    sex: string;
  };
  dateTaken: string;
  results: Record<string, number | undefined>;
  hasAbnormalValues: boolean;
  criticalValues: string[];
  createdAt: string;
  updatedAt?: string;
}

// Response type interfaces for consistent API responses
export interface LabRequestResponse {
  success: boolean;
  data: LabRequestDto;
  message?: string;
}

export interface LabRequestListResponse {
  success: boolean;
  data: LabRequestDto[];
  message?: string;
}

export interface BloodChemistryResponse {
  success: boolean;
  data: BloodChemistryDto;
  message?: string;
}

export interface BloodChemistryListResponse {
  success: boolean;
  data: BloodChemistryDto[];
  message?: string;
}

export interface LaboratoryOperationResponse {
  success: boolean;
  message: string;
}

// New LabTest DTOs for frontend integration
export interface LabTestDto {
  id: string;
  testCategory: 'bloodChemistry' | 'urinalysis' | 'fecalysis' | 'hematology' | 'serology' | 'dengue' | 'ecg' | 'coagulation';
  tests: string[]; // Array of test IDs like ['fbs', 'bun', 'creatinine']
  testDisplayNames?: string[]; // Optional formatted names like ['FBS', 'BUN', 'Creatinine']
  date: string;
  status: 'Completed' | 'Confirmed' | 'Pending' | 'In Progress' | 'Cancelled';
  results?: string;
  patientId?: string;
  enabledFields: string[]; // Backend-driven field enabling based on original lab request
  // Backward compatibility - computed display value
  testName?: string; // Deprecated: Use testCategory and tests instead
}

export interface LabTestListResponse {
  success: boolean;
  data: LabTestDto[];
  message?: string;
}

// Lab Test Result DTOs
export interface LabTestResultDto {
  id: string;
  labRequestId: string;
  patientId: string;
  dateTested: string;
  doctorId?: string;
  status: string;
  bloodChemistry?: {
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
    alkPhosphatase?: number;
    hba1c?: number;
  };
  urinalysis?: {
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
  };
  hematology?: {
    hematocrit?: string;
    hematocritCategory?: string; // 'male' | 'female' | 'child' | 'newborn'
    hemoglobin?: string;
    hemoglobinCategory?: string; // 'male' | 'female' | 'child' | 'newborn' | 'pregnant'
    rbc?: string;
    wbc?: string;
    segmenters?: string;
    lymphocyte?: string;
    monocyte?: string;
    basophils?: string;
    eosinophils?: string;
    platelet?: string;
    others?: string;
  };
  fecalysis?: {
    color?: string;
    consistency?: string;
    rbc?: string;
    wbc?: string;
    occultBlood?: string;
    urobilinogen?: string;
    others?: string;
  };
  serology?: {
    ft3?: number;
    ft4?: number;
    tsh?: number;
  };
  dengue?: {
    igg?: string;
    igm?: string;
    ns1?: string;
  };
  ecg?: {
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
  };
  coagulation?: {
    patientPt?: string;
    controlPt?: string;
    inr?: string;
    activityPercent?: string;
    patientPtt?: string;
    controlPtt?: string;
  };
  remarks?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateLabTestResultRequestDto {
  labRequestId: string;
  dateTested: string;
  doctorId?: string;
  bloodChemistry?: {
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
    alkPhosphatase?: number;
    hba1c?: number;
  };
  urinalysis?: {
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
  };
  hematology?: {
    hematocrit?: string;
    hematocritCategory?: string; // 'male' | 'female' | 'child' | 'newborn'
    hemoglobin?: string;
    hemoglobinCategory?: string; // 'male' | 'female' | 'child' | 'newborn' | 'pregnant'
    rbc?: string;
    wbc?: string;
    segmenters?: string;
    lymphocyte?: string;
    monocyte?: string;
    basophils?: string;
    eosinophils?: string;
    platelet?: string;
    others?: string;
  };
  fecalysis?: {
    color?: string;
    consistency?: string;
    rbc?: string;
    wbc?: string;
    occultBlood?: string;
    urobilinogen?: string;
    others?: string;
  };
  serology?: {
    ft3?: number;
    ft4?: number;
    tsh?: number;
  };
  dengue?: {
    igg?: string;
    igm?: string;
    ns1?: string;
  };
  ecg?: {
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
  };
  coagulation?: {
    patientPt?: string;
    controlPt?: string;
    inr?: string;
    activityPercent?: string;
    patientPtt?: string;
    controlPtt?: string;
  };
  remarks?: string;
}

export interface UpdateLabTestResultRequestDto {
  labRequestId?: string;
  dateTested?: string;
  doctorId?: string;
  bloodChemistry?: {
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
    alkPhosphatase?: number;
    hba1c?: number;
  };
  urinalysis?: {
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
    bacteria?: string;
    amorphousUrates?: string;
    casts?: string;
    crystals?: string;
  };
  hematology?: {
    hemoglobin?: string;
    hematocrit?: string;
    wbcCount?: string;
    rbcCount?: string;
    plateletCount?: string;
    mchc?: string;
    mch?: string;
    mcv?: string;
    neutrophils?: string;
    lymphocytes?: string;
    monocytes?: string;
    eosinophils?: string;
    basophils?: string;
  };
  fecalysis?: {
    color?: string;
    consistency?: string;
    microscopicExam?: string;
    occultBlood?: string;
  };
  serology?: {
    vdrl?: string;
    hepatitisB?: string;
    hepatitisA?: string;
    hepatitisC?: string;
    dengueTest?: string;
    typhoidTest?: string;
    pregnancyTest?: string;
  };
  dengue?: {
    igg?: string;
    igm?: string;
    ns1?: string;
  };
  ecg?: {
    rhythm?: string;
    rate?: string;
    findings?: string;
    interpretation?: string;
  };
  coagulation?: {
    bleedingTime?: string;
    clottingTime?: string;
    plateletAggregation?: string;
    prothrombinTime?: string;
    aptt?: string;
    inr?: string;
    activityPercent?: string;
    patientPtt?: string;
    controlPtt?: string;
  };
  remarks?: string;
}

export interface LabTestResultResponse {
  success: boolean;
  data: LabTestResultDto;
  message?: string;
}

export interface LabTestResultListResponse {
  success: boolean;
  data: LabTestResultDto[];
  message?: string;
}
