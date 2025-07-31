export interface Patient {
  id: string;
  patientNumber: string;
  firstName: string;
  lastName: string;
  fullName: string;
  dateOfBirth: string; // YYYY-MM-DD format
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  phoneNumber: string;
  email?: string;
  address: {
    street: string;
    city: string;
    province: string;
    zipCode: string;
  };
  emergencyContact: {
    name: string;
    relationship: string;
    phoneNumber: string;
  };
  medicalHistory?: string[];
  allergies?: string[];
  bloodType?: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export interface PatientFormData {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: 'Male' | 'Female' | 'Other';
  phoneNumber: string;
  email?: string;
  street: string;
  city: string;
  province: string;
  zipCode: string;
  emergencyContactName: string;
  emergencyContactRelationship: string;
  emergencyContactPhone: string;
  medicalHistory?: string;
  allergies?: string;
  bloodType?: string;
}
