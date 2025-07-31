import { Patient } from './Patient';

export interface IPatientRepository {
  /**
   * Get all patients
   */
  getAll(): Promise<Patient[]>;

  /**
   * Create a new patient
   * @param patient The patient to create
   * @returns The ID of the created patient
   */
  create(patient: Patient): Promise<string>;

  /**
   * Get patient by ID
   * @param id The patient ID
   * @returns The patient or undefined if not found
   */
  getById(id: string): Promise<Patient | undefined>;

  /**
   * Get patient by patient number
   * @param patientNumber The patient number
   * @returns The patient or undefined if not found
   */
  getByPatientNumber(patientNumber: string): Promise<Patient | undefined>;

  /**
   * Get patient by contact number
   * @param contactNumber The contact number
   * @returns The patient or undefined if not found
   */
  getByContactNumber(contactNumber: string): Promise<Patient | undefined>;

  /**
   * Update patient
   * @param id The patient ID
   * @param changes Partial patient data to update
   */
  update(id: string, changes: Partial<Patient>): Promise<void>;

  /**
   * Delete patient
   * @param id The patient ID
   */
  delete(id: string): Promise<void>;

  /**
   * Get total count of patients
   */
  getTotalCount(): Promise<number>;

  /**
   * Get count of patients by gender
   */
  getCountByGender(): Promise<{ male: number; female: number }>;

  /**
   * Get count of patients by age category
   */
  getCountByAgeCategory(): Promise<{ children: number; adults: number; seniors: number }>;

  /**
   * Count existing patients with the same year-letter prefix for patient number generation
   * @param prefix The prefix (e.g., "2025-J")
   * @returns The count of existing patients with this prefix
   */
  countByPatientNumberPrefix(prefix: string): Promise<number>;

  /**
   * Check if a patient number already exists
   * @param patientNumber The patient number to check
   * @returns True if exists, false otherwise
   */
  existsByPatientNumber(patientNumber: string): Promise<boolean>;

  /**
   * Check if a contact number already exists
   * @param contactNumber The contact number to check
   * @param excludeId Optional ID to exclude from the check (for updates)
   * @returns True if exists, false otherwise
   */
  existsByContactNumber(contactNumber: string, excludeId?: string): Promise<boolean>;

  /**
   * Search patients by name (first, middle, last)
   * @param searchTerm The search term
   * @param limit Optional limit for results
   * @returns Array of matching patients
   */
  searchByName(searchTerm: string, limit?: number): Promise<Patient[]>;

  /**
   * Get patients by age range
   * @param minAge Minimum age (inclusive)
   * @param maxAge Maximum age (inclusive)
   * @returns Array of patients within the age range
   */
  getByAgeRange(minAge: number, maxAge: number): Promise<Patient[]>;

  /**
   * Get patients by gender
   * @param gender The gender to filter by
   * @returns Array of patients with the specified gender
   */
  getByGender(gender: 'Male' | 'Female'): Promise<Patient[]>;

  /**
   * Get patients created within a date range
   * @param startDate Start date (inclusive)
   * @param endDate End date (inclusive)
   * @returns Array of patients created within the date range
   */
  getByDateRange(startDate: Date, endDate: Date): Promise<Patient[]>;

  /**
   * Get patients with guardian information
   * @returns Array of patients who have guardian information
   */
  getWithGuardianInfo(): Promise<Patient[]>;

  /**
   * Get patients without guardian information
   * @returns Array of patients who don't have guardian information
   */
  getWithoutGuardianInfo(): Promise<Patient[]>;
}