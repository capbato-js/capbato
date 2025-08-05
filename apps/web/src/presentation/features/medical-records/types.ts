export interface Medication {
  id?: string;
  name: string;
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
  patientNumber: string;
  patientName: string;
  testType: string;
  datePerformed: string;
  status: 'Pending' | 'Completed' | 'In Progress';
  results?: string;
}

export interface LabTest {
  id: string;
  testName: string;
  date: string;
  status: 'Complete' | 'Confirmed' | 'Pending' | 'In Progress';
  results?: string;
}
