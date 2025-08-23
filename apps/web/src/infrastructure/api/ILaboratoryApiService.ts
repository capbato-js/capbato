import { 
  CreateLabRequestCommand,
  LabRequestResponse,
  LabRequestListResponse,
  LabTestListResponse,
  LaboratoryOperationResponse,
  CreateLabTestResultRequestDto,
  LabTestResultResponse
} from '@nx-starter/application-shared';

/**
 * Interface for Laboratory API operations
 */
export interface ILaboratoryApiService {
  /**
   * Create a new lab request
   */
  createLabRequest(command: CreateLabRequestCommand): Promise<LabRequestResponse>;
  
  /**
   * Get all lab requests
   */
  getAllLabRequests(): Promise<LabRequestListResponse>;
  
  /**
   * Get completed lab requests
   */
  getCompletedLabRequests(): Promise<LabRequestListResponse>;
  
  /**
   * Get lab request by patient ID
   */
  getLabRequestByPatientId(patientId: string): Promise<LabRequestResponse>;
  
  /**
   * Get lab tests by patient ID (formatted for frontend)
   */
  getLabTestsByPatientId(patientId: string): Promise<LabTestListResponse>;
  
  /**
   * Update lab request results
   */
  updateLabRequestResults(
    patientId: string, 
    requestDate: string, 
    results: Record<string, string>
  ): Promise<LaboratoryOperationResponse>;

  /**
   * Create lab test result
   */
  createLabTestResult(request: CreateLabTestResultRequestDto): Promise<LabTestResultResponse>;

  /**
   * Get lab test result by ID
   */
  getLabTestResultById(id: string): Promise<LabTestResultResponse>;

  /**
   * Get lab test result by lab request ID
   */
  getLabTestResultByLabRequestId(labRequestId: string): Promise<LabTestResultResponse>;
}