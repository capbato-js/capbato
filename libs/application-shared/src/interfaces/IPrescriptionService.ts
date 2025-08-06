import { Prescription } from '@nx-starter/domain';
import { CreatePrescriptionCommand, UpdatePrescriptionCommand } from '../validation/PrescriptionValidationSchemas';

/**
 * Interface for Prescription Command Service following CQRS pattern
 * Handles all write operations for prescriptions
 */
export interface IPrescriptionCommandService {
  /**
   * Create a new prescription
   */
  createPrescription(command: CreatePrescriptionCommand): Promise<Prescription>;

  /**
   * Update an existing prescription
   */
  updatePrescription(id: string, command: UpdatePrescriptionCommand): Promise<Prescription>;

  /**
   * Delete a prescription
   */
  deletePrescription(id: string): Promise<void>;
}

/**
 * Interface for Prescription Query Service following CQRS pattern
 * Handles all read operations for prescriptions
 */
export interface IPrescriptionQueryService {
  /**
   * Get all prescriptions
   */
  getAllPrescriptions(): Promise<Prescription[]>;

  /**
   * Get prescription by ID
   */
  getPrescriptionById(id: string): Promise<Prescription>;

  /**
   * Get prescriptions by patient ID
   */
  getPrescriptionsByPatientId(patientId: string): Promise<Prescription[]>;

  /**
   * Get prescriptions by doctor ID
   */
  getPrescriptionsByDoctorId(doctorId: string): Promise<Prescription[]>;

  /**
   * Get active prescriptions
   */
  getActivePrescriptions(): Promise<Prescription[]>;

  /**
   * Get expired prescriptions
   */
  getExpiredPrescriptions(): Promise<Prescription[]>;

  /**
   * Get prescriptions by medication name
   */
  getPrescriptionsByMedicationName(medicationName: string): Promise<Prescription[]>;
}