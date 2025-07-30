export interface Appointment {
  id: string;
  patientNumber: string;
  patientName: string;
  reasonForVisit: string;
  date: string; // YYYY-MM-DD format
  time: string; // HH:MM AM/PM format
  doctor: string;
  status: 'pending' | 'confirmed' | 'cancelled';
}
