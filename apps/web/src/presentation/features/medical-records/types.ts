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
