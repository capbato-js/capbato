import { injectable, inject } from 'tsyringe';
import { TOKENS } from '../../di/tokens';
import { ILabRequestRepository } from '@nx-starter/domain';
import { LabRequest, LabRequestPatientInfo } from '@nx-starter/domain';
import { IPatientRepository } from '../../domain/IPatientRepository';

/**
 * Query handler for retrieving all lab requests
 * Follows CQRS pattern - separate from command operations
 * Enhanced to include patient information enrichment
 */
@injectable()
export class GetAllLabRequestsQueryHandler {
  constructor(
    @inject(TOKENS.LabRequestRepository) private readonly labRequestRepository: ILabRequestRepository,
    @inject(TOKENS.PatientRepository) private readonly patientRepository: IPatientRepository
  ) {}

  async execute(): Promise<LabRequest[]> {
    const labRequests = await this.labRequestRepository.findAll();
    
    // Enrich lab requests with patient information
    const enrichedLabRequests = await Promise.all(
      labRequests.map(async (labRequest) => {
        try {
          // First try to get patient details by the ID stored in the lab request
          let patient = await this.patientRepository.getById(labRequest.patientInfo.patientId);
          
          // If patient not found by the stored ID, try to find by patient name (which might actually be the patient ID)
          if (!patient && labRequest.patientInfo.patientName) {
            console.log(`Patient not found with ID ${labRequest.patientInfo.patientId}, trying to find by name: ${labRequest.patientInfo.patientName}`);
            patient = await this.patientRepository.getById(labRequest.patientInfo.patientName);
          }
          
          if (patient) {
            console.log(`Found patient: ${patient.firstName} ${patient.lastName} (${patient.patientNumber})`);
            // Create enriched patient info with full patient details
            const enrichedPatientInfo = new LabRequestPatientInfo({
              patientId: patient.id || labRequest.patientInfo.patientId, // Use the correct patient ID
              patientName: `${patient.firstName} ${patient.lastName}${patient.middleName ? ` ${patient.middleName}` : ''}`,
              ageGender: labRequest.patientInfo.ageGender,
              patientNumber: patient.patientNumber,
              firstName: patient.firstName,
              lastName: patient.lastName,
            });

            // Create new LabRequest with enriched patient info
            return new LabRequest(
              enrichedPatientInfo,
              labRequest.requestDate,
              labRequest.tests,
              labRequest.status,
              labRequest.id?.value,
              labRequest.dateTaken,
              labRequest.others,
              labRequest.createdAt,
              labRequest.updatedAt
            );
          } else {
            console.warn(`No patient found for lab request ${labRequest.id?.value} with patient ID: ${labRequest.patientInfo.patientId} or name: ${labRequest.patientInfo.patientName}`);
          }
        } catch (error) {
          // Log error but don't fail the entire request
          console.warn(`Failed to enrich patient data for lab request ${labRequest.id?.value}:`, error);
        }
        
        return labRequest;
      })
    );
    
    return enrichedLabRequests;
  }
}
