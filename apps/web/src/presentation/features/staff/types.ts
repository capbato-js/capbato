export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  contactNumber: string;
}

export interface ScheduleEntry {
  date: string; // YYYY-MM-DD format
  note: string;
  details?: string;
}
