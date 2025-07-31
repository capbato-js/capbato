// Data Transfer Objects for Patient operations

export interface PatientDto {
  id: string;
  patientNumber: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  dateOfBirth: string; // YYYY-MM-DD format
  age: number; // Computed dynamically from dateOfBirth
  gender: string;
  contactNumber: string;
  address: string;
  
  // Guardian Information
  guardianName?: string;
  guardianGender?: string;
  guardianRelationship?: string;
  guardianContactNumber?: string;
  guardianAddress?: string;
  
  createdAt: string;
  updatedAt: string;
}

export interface CreatePatientDto {
  firstName: string;
  lastName: string;
  middleName?: string;
  dateOfBirth: string; // YYYY-MM-DD format
  gender: string;
  contactNumber: string;
  address: string;
  
  // Guardian Information (optional but complete when provided)
  guardianName?: string;
  guardianGender?: string;
  guardianRelationship?: string;
  guardianContactNumber?: string;
  guardianAddress?: string;
}

export interface PatientStatsDto {
  total: number;
  byGender: {
    male: number;
    female: number;
  };
  byAge: {
    children: number; // 0-17
    adults: number;   // 18-59
    seniors: number;  // 60+
  };
}

export interface PatientListDto {
  id: string;
  patientNumber: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  age: number;
  gender: string;
  dateOfBirth: string;
}