import { 
  PrescriptionListResponse,
  PrescriptionResponse,
  PrescriptionOperationResponse,
  CreatePrescriptionRequestDto,
  UpdatePrescriptionRequestDto,
} from '@nx-starter/application-shared';

/**
 * Interface for Prescription API Service
 * Follows Clean Architecture - adapters for external API communication
 */
export interface IPrescriptionApiService {
  /**
   * Get all prescriptions
   */
  getAllPrescriptions(): Promise<PrescriptionListResponse>;

  /**
   * Get prescription by ID
   */
  getPrescriptionById(id: string): Promise<PrescriptionResponse>;

  /**
   * Create a new prescription
   */
  createPrescription(prescriptionData: CreatePrescriptionRequestDto): Promise<PrescriptionResponse>;

  /**
   * Update an existing prescription
   */
  updatePrescription(id: string, updateData: UpdatePrescriptionRequestDto): Promise<PrescriptionOperationResponse>;

  /**
   * Delete a prescription
   */
  deletePrescription(id: string): Promise<PrescriptionOperationResponse>;

  /**
   * Get prescriptions by patient ID
   */
  getPrescriptionsByPatientId(patientId: string): Promise<PrescriptionListResponse>;

  /**
   * Get prescriptions by doctor ID
   */
  getPrescriptionsByDoctorId(doctorId: string): Promise<PrescriptionListResponse>;

  /**
   * Get active prescriptions
   */
  getActivePrescriptions(): Promise<PrescriptionListResponse>;

  /**
   * Get expired prescriptions
   */
  getExpiredPrescriptions(): Promise<PrescriptionListResponse>;

  /**
   * Get prescriptions by medication name
   */
  getPrescriptionsByMedicationName(medicationName: string): Promise<PrescriptionListResponse>;
}