// Query DTOs for CQRS pattern
// Unified version (identical in both frontend and backend)

/**
 * Query for getting all prescriptions
 */
export type GetAllPrescriptionsQuery = object;

/**
 * Query for getting a single prescription by ID
 */
export interface GetPrescriptionByIdQuery {
  id: string;
}

/**
 * Query for getting prescriptions by patient ID
 */
export interface GetPrescriptionsByPatientIdQuery {
  patientId: string;
}

/**
 * Query for getting prescriptions by doctor ID
 */
export interface GetPrescriptionsByDoctorIdQuery {
  doctorId: string;
}

/**
 * Query for getting prescriptions by medication name
 */
export interface GetPrescriptionsByMedicationNameQuery {
  medicationName: string;
}

/**
 * Query for getting active prescriptions
 */
export type GetActivePrescriptionsQuery = object;

/**
 * Query for getting expired prescriptions
 */
export type GetExpiredPrescriptionsQuery = object;

/**
 * Query for getting prescription statistics
 */
export type GetPrescriptionStatsQuery = object;

/**
 * Query response for prescription statistics
 */
export interface PrescriptionStatsQueryResult {
  totalCount: number;
  activeCount: number;
  expiredCount: number;
  inactiveCount: number;
  mostPrescribedMedications: Array<{
    medication: string;
    count: number;
  }>;
}