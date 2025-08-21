export interface Medication {
  id?: string;
  name?: string; // Frontend compatibility
  medicationName?: string; // API compatibility
  dosage: string;
  frequency: string;
  duration: string;
  instructions?: string;
}

export interface Prescription {
  id: string;
  patientNumber: string;
  patientName: string;
  patientId?: string;
  doctor: string;
  doctorId?: string;
  datePrescribed: string;
  medications: string | Medication[]; // Support both legacy string and new structured format
  notes?: string;
}

export interface LaboratoryResult {
  id: string;
  patientId: string; // Add patient ID field
  patientNumber: string;
  patientName: string;
  testType: string;
  datePerformed: string;
  status: 'Pending' | 'Completed' | 'In Progress';
  results?: string;
}

export interface LabTest {
  id: string;
  testCategory: 'BLOOD_CHEMISTRY' | 'URINALYSIS' | 'FECALYSIS' | 'CBC' | 'THYROID_FUNCTION';
  tests: string[]; // Array of test IDs like ['blood_chemistry_fbs', 'blood_chemistry_bun', 'blood_chemistry_creatinine']
  testDisplayNames?: string[]; // Optional formatted names like ['FBS', 'BUN', 'Creatinine']
  date: string;
  status: 'Completed' | 'Confirmed' | 'Pending' | 'In Progress';
  results?: string;
  patientId?: string;
  // Backward compatibility - computed display value
  testName?: string; // Deprecated: Use testCategory and tests instead
}
