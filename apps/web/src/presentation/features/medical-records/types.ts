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
  testCategory: 'bloodChemistry' | 'urinalysis' | 'fecalysis' | 'hematology' | 'serology' | 'dengue' | 'ecg' | 'coagulation';
  tests: string[]; // Array of test IDs like ['fbs', 'bun', 'creatinine']
  testDisplayNames?: string[]; // Optional formatted names like ['FBS', 'BUN', 'Creatinine']
  date: string;
  status: 'Completed' | 'Confirmed' | 'Pending' | 'In Progress';
  results?: string;
  patientId?: string;
  enabledFields: string[]; // Backend-driven field enabling based on original lab request
  // Backward compatibility - computed display value
  testName?: string; // Deprecated: Use testCategory and tests instead
}
