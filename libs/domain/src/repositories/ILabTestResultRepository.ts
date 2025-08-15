import { LabTestResult } from '../entities/LabTestResult';

export interface ILabTestResultRepository {
  /**
   * Create a new lab test result
   */
  create(labTestResult: LabTestResult): Promise<LabTestResult>;

  /**
   * Get lab test result by ID
   */
  getById(id: string): Promise<LabTestResult | undefined>;

  /**
   * Get lab test result by lab request ID
   */
  getByLabRequestId(labRequestId: string): Promise<LabTestResult | undefined>;

  /**
   * Get lab test results by patient ID
   */
  getByPatientId(patientId: string): Promise<LabTestResult[]>;

  /**
   * Update an existing lab test result
   */
  update(labTestResult: LabTestResult): Promise<LabTestResult>;

  /**
   * Delete a lab test result
   */
  delete(id: string): Promise<void>;

  /**
   * Get all lab test results
   */
  getAll(): Promise<LabTestResult[]>;
}