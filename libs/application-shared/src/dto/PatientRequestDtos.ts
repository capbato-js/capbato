// Request DTOs for Patient API endpoints
// These are used by the controllers for request body validation

export interface CreatePatientRequestDto {
  firstName: string;
  lastName: string;
  middleName?: string;
  dateOfBirth: string; // YYYY-MM-DD format
  gender: string;
  contactNumber: string;
  
  // Address Information
  houseNumber?: string;
  streetName?: string;
  province?: string;
  cityMunicipality?: string;
  barangay?: string;
  
  // Guardian Information (optional but complete when provided)
  guardianName?: string;
  guardianGender?: string;
  guardianRelationship?: string;
  guardianContactNumber?: string;
  
  // Guardian Address Information
  guardianHouseNumber?: string;
  guardianStreetName?: string;
  guardianProvince?: string;
  guardianCityMunicipality?: string;
  guardianBarangay?: string;
}

export interface UpdatePatientRequestDto {
  id: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  dateOfBirth: string; // YYYY-MM-DD format
  gender: string;
  contactNumber: string;
  
  // Address Information
  houseNumber?: string;
  streetName?: string;
  province?: string;
  cityMunicipality?: string;
  barangay?: string;
  
  // Guardian Information (optional but complete when provided)
  guardianName?: string;
  guardianGender?: string;
  guardianRelationship?: string;
  guardianContactNumber?: string;
  
  // Guardian Address Information
  guardianHouseNumber?: string;
  guardianStreetName?: string;
  guardianProvince?: string;
  guardianCityMunicipality?: string;
  guardianBarangay?: string;
}

// Response types for consistent API responses
export type PatientResponse = {
  success: true;
  data: import('./PatientDto').PatientDto;
  message?: string;
};

export type PatientListResponse = {
  success: true;
  data: import('./PatientDto').PatientListDto[];
  message?: string;
};

export type PatientStatsResponse = {
  success: true;
  data: import('./PatientDto').PatientStatsDto;
  message?: string;
};

export type PatientOperationResponse = {
  success: true;
  data?: null;
  message: string;
};