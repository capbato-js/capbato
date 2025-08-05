// Data Transfer Objects for Prescription operations
// Unified version combining frontend and backend DTOs

export interface PrescriptionDto {
  id: string;
  patientId: string;
  doctorId: string;
  medicationName: string;
  dosage: string;
  instructions: string;
  prescribedDate: string;
  expiryDate?: string;
  isActive: boolean;
  createdAt: string;
}

export interface CreatePrescriptionDto {
  patientId: string;
  doctorId: string;
  medicationName: string;
  dosage: string;
  instructions: string;
  prescribedDate?: string;
  expiryDate?: string;
  isActive?: boolean;
}

export interface UpdatePrescriptionDto {
  medicationName?: string;
  dosage?: string;
  instructions?: string;
  expiryDate?: string;
  isActive?: boolean;
}

export interface PrescriptionStatsDto {
  totalCount: number;
  activeCount: number;
  expiredCount: number;
  inactiveCount: number;
  mostPrescribedMedications: Array<{
    medication: string;
    count: number;
  }>;
}

export interface PrescriptionFilterDto {
  patientId?: string;
  doctorId?: string;
  medicationName?: string;
  isActive?: boolean;
  isExpired?: boolean;
}