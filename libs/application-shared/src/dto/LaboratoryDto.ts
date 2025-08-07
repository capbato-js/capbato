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
  LaboratoryValidationSchemas,
} from '../validation/LaboratoryValidationSchemas';

// Request DTOs for API endpoints
export interface CreateLabRequestRequestDto {
  patient_id: string;
  patient_name: string;
  age_gender: string;
  request_date: string;
  others?: string;
  
  // Basic Tests
  cbc_with_platelet?: string;
  pregnancy_test?: string;
  urinalysis?: string;
  fecalysis?: string;
  occult_blood_test?: string;
  
  // Hepatitis Tests
  hepa_b_screening?: string;
  hepa_a_screening?: string;
  hepatitis_profile?: string;
  
  // STD Tests
  vdrl_rpr?: string;
  
  // Other Tests
  dengue_ns1?: string;
  ca_125_cea_psa?: string;
  
  // Blood Chemistry Results
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
  
  // Other Tests
  ecg?: string;
  t3?: string;
  t4?: string;
  ft3?: string;
  ft4?: string;
  tsh?: string;
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
  testCategory: 'BLOOD_CHEMISTRY' | 'URINALYSIS' | 'FECALYSIS' | 'CBC' | 'THYROID_FUNCTION';
  tests: string[]; // Array of test IDs like ['fbs', 'bun', 'creatinine']
  testDisplayNames?: string[]; // Optional formatted names like ['FBS', 'BUN', 'Creatinine']
  date: string;
  status: 'Complete' | 'Confirmed' | 'Pending' | 'In Progress';
  results?: string;
  patientId?: string;
  // Backward compatibility - computed display value
  testName?: string; // Deprecated: Use testCategory and tests instead
}

export interface LabTestListResponse {
  success: boolean;
  data: LabTestDto[];
  message?: string;
}
