/**
 * Form types for laboratory feature
 */

// Lab Request Form Data
export interface LabRequestFormData {
  // Patient Information
  patient_id: string;
  patient_name: string;
  age_gender: string;
  request_date: string;
  others?: string;
  
  // Selected tests - using checkbox values (boolean)
  selectedTests: {
    // Basic Tests
    cbc_with_platelet?: boolean;
    pregnancy_test?: boolean;
    urinalysis?: boolean;
    fecalysis?: boolean;
    occult_blood_test?: boolean;
    
    // Hepatitis Tests
    hepa_b_screening?: boolean;
    hepa_a_screening?: boolean;
    hepatitis_profile?: boolean;
    
    // STD Tests
    vdrl_rpr?: boolean;
    
    // Other Tests
    dengue_ns1?: boolean;
    ca_125_cea_psa?: boolean;
    
    // Blood Chemistry Tests
    fbs?: boolean;
    bun?: boolean;
    creatinine?: boolean;
    blood_uric_acid?: boolean;
    lipid_profile?: boolean;
    sgot?: boolean;
    sgpt?: boolean;
    alp?: boolean;
    sodium_na?: boolean;
    potassium_k?: boolean;
    hbalc?: boolean;
    
    // Other Tests
    ecg?: boolean;
    t3?: boolean;
    t4?: boolean;
    ft3?: boolean;
    ft4?: boolean;
    tsh?: boolean;
  };
}

export interface PatientInfo {
  id: string;
  name: string;
  age: number;
  gender: string;
}

// Test categories for form organization
export interface TestCategory {
  key: string;
  label: string;
  tests: TestField[];
}

export interface TestField {
  key: string;
  label: string;
  price?: number;
  fieldName: keyof LabRequestFormData['selectedTests'];
}