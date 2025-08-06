// Data Transfer Objects for Prescription operations
// Unified version combining frontend and backend DTOs

export interface MedicationDto {
  id?: string;
  medicationName: string;
  dosage: string;
  instructions: string;
  frequency: string;
  duration: string;
}

export interface PrescriptionDto {
  id: string;
  patientId: string;
  doctorId: string;
  patient?: {
    id: string;
    patientNumber: string;
    firstName: string;
    lastName: string;
    middleName?: string;
    fullName: string;
  };
  doctor?: {
    id: string;
    firstName: string;
    lastName: string;
    fullName: string;
    specialization?: string;
  };
  medications: MedicationDto[];
  // Legacy single medication fields for backward compatibility
  medicationName: string;
  dosage: string;
  instructions: string;
  frequency: string;
  duration: string;
  prescribedDate: string;
  expiryDate?: string;
  quantity?: string;
  additionalNotes?: string;
  status: 'active' | 'completed' | 'discontinued' | 'on-hold';
  createdAt: string;
}

export interface CreatePrescriptionDto {
  patientId: string;
  doctorId: string;
  medications: Array<{
    medicationName: string;
    dosage: string;
    instructions: string;
    frequency: string;
    duration: string;
  }>;
  prescribedDate?: string;
  expiryDate?: string;
  quantity?: string;
  additionalNotes?: string;
  status?: 'active' | 'completed' | 'discontinued' | 'on-hold';
  // Legacy single medication fields for backward compatibility
  medicationName?: string;
  dosage?: string;
  instructions?: string;
  frequency?: string;
  duration?: string;
}

export interface UpdatePrescriptionDto {
  medications?: Array<{
    id?: string;
    medicationName: string;
    dosage: string;
    instructions: string;
    frequency: string;
    duration: string;
  }>;
  expiryDate?: string;
  quantity?: string;
  additionalNotes?: string;
  status?: 'active' | 'completed' | 'discontinued' | 'on-hold';
  // Legacy single medication fields for backward compatibility
  medicationName?: string;
  dosage?: string;
  instructions?: string;
  frequency?: string;
  duration?: string;
}

export interface PrescriptionStatsDto {
  totalCount: number;
  activeCount: number;
  completedCount: number;
  discontinuedCount: number;
  onHoldCount: number;
  expiredCount: number;
  mostPrescribedMedications: Array<{
    medication: string;
    count: number;
  }>;
}

export interface PrescriptionFilterDto {
  patientId?: string;
  doctorId?: string;
  medicationName?: string;
  status?: 'active' | 'completed' | 'discontinued' | 'on-hold';
  isExpired?: boolean;
}