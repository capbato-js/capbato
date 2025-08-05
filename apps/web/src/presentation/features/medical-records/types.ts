export interface Prescription {
  id: string;
  patientNumber: string;
  patientName: string;
  doctor: string;
  datePrescribed: string;
  medications: string;
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
