export interface Appointment {
  id: string;
  appointmentNumber?: number; // Queue number based on time slot
  patientNumber: string;
  patientName: string;
  reasonForVisit: string | string[];
  date: string; // YYYY-MM-DD format
  time: string; // HH:MM AM/PM format
  doctor: string;
  status: 'confirmed' | 'completed' | 'cancelled';
}
