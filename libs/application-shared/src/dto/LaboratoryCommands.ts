// Command DTOs for CQRS pattern
// TypeScript types are now generated from Zod schemas for consistency

import {
  CreateLabRequestCommandSchema,
  UpdateLabRequestCommandSchema,
  DeleteLabRequestCommandSchema,
  UpdateLabRequestResultsCommandSchema,
  CreateBloodChemistryCommandSchema,
  UpdateBloodChemistryCommandSchema,
  DeleteBloodChemistryCommandSchema,
} from '../validation/LaboratoryValidationSchemas';

// Re-export command types from validation schemas
export type {
  CreateLabRequestCommand,
  UpdateLabRequestCommand,
  DeleteLabRequestCommand,
  UpdateLabRequestResultsCommand,
  CreateBloodChemistryCommand,
  UpdateBloodChemistryCommand,
  DeleteBloodChemistryCommand,
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
  LaboratoryValidationSchemas,
} from '../validation/LaboratoryValidationSchemas';

// Response DTOs
export interface LabRequestDto {
  id: string;
  patientId: string;
  patientName: string;
  ageGender: string;
  requestDate: string;
  status: string;
  dateTaken?: string;
  others?: string;
  tests: {
    cbcWithPlatelet?: string;
    pregnancyTest?: string;
    urinalysis?: string;
    fecalysis?: string;
    occultBloodTest?: string;
    hepaBScreening?: string;
    hepaAScreening?: string;
    hepatitisProfile?: string;
    vdrlRpr?: string;
    dengueNs1?: string;
    ca125CeaPsa?: string;
    fbs?: string;
    bun?: string;
    creatinine?: string;
    bloodUricAcid?: string;
    lipidProfile?: string;
    sgot?: string;
    sgpt?: string;
    alp?: string;
    sodiumNa?: string;
    potassiumK?: string;
    hbalc?: string;
    ecg?: string;
    t3?: string;
    t4?: string;
    ft3?: string;
    ft4?: string;
    tsh?: string;
  };
  createdAt: string;
  updatedAt?: string;
}

export interface BloodChemistryDto {
  id: string;
  patientName: string;
  age: number;
  sex: string;
  dateTaken: string;
  results: {
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
    chloride?: number;
    calcium?: number;
    sgot?: number;
    sgpt?: number;
    rbs?: number;
    alkPhosphatase?: number;
    totalProtein?: number;
    albumin?: number;
    globulin?: number;
    agRatio?: number;
    totalBilirubin?: number;
    directBilirubin?: number;
    indirectBilirubin?: number;
    ionisedCalcium?: number;
    magnesium?: number;
    hbalc?: number;
    ogtt30min?: number;
    ogtt1hr?: number;
    ogtt2hr?: number;
    ppbs2hr?: number;
    inorPhosphorus?: number;
  };
  createdAt: string;
  updatedAt?: string;
}

export interface CompletedLabTestDto {
  patientId: string;
  patientName: string;
  labTest: string;
  date: string;
  status: string;
}

// Request DTOs for input validation
export interface CreateLabRequestRequestDto {
  patient_id: string;
  patient_name: string;
  age_gender: string;
  request_date: string;
  others?: string;
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

export interface CreateBloodChemistryRequestDto {
  patient_name: string;
  age: number;
  sex: string;
  date_taken: string;
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

// Response types for API endpoints
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

export interface CompletedLabTestListResponse {
  success: boolean;
  data: CompletedLabTestDto[];
  message?: string;
}

export interface LabRequestOperationResponse {
  success: boolean;
  message: string;
}
