import { injectable, inject } from 'tsyringe';
import { TOKENS } from '../../di/tokens';
import { CreateBloodChemistryCommand } from '../../dto/LaboratoryDto';
import { BloodChemistry, BloodChemistryPatientInfo, BloodChemistryResults, ILabRequestRepository, LabRequestId } from '@nx-starter/domain';
import { LabRequestNotFoundException } from '@nx-starter/domain';

/**
 * Use case for adding blood chemistry results to existing lab requests
 * This should NOT create new records - only update existing lab requests with results
 */
@injectable()
export class CreateBloodChemistryUseCase {
  constructor(
    @inject(TOKENS.LabRequestRepository) private readonly labRequestRepository: ILabRequestRepository
  ) {}

  async execute(command: CreateBloodChemistryCommand): Promise<BloodChemistry> {
    if (!command.labRequestId) {
      throw new Error('Lab Request ID is required to add blood chemistry results');
    }

    console.log('🔄 Adding blood chemistry results to existing lab request:', command.labRequestId);
    
    // Find the lab request by ID
    const labRequestId = new LabRequestId(command.labRequestId);
    const labRequest = await this.labRequestRepository.findById(labRequestId);
    
    if (!labRequest) {
      throw new LabRequestNotFoundException(command.labRequestId);
    }

    // Update the lab request status to complete
    const completedLabRequest = labRequest.complete(command.dateTaken);
    
    // Save the updated lab request
    await this.labRequestRepository.update(completedLabRequest);

    console.log('✅ Lab request updated with blood chemistry results - no new record created');

    // Return a mock BloodChemistry object for API response compatibility
    // This is just for the response - no actual blood chemistry record is created
    const patientInfo = new BloodChemistryPatientInfo({
      patientId: command.patientId || 'unknown',
      patientName: command.patientName,
      age: command.age,
      sex: command.sex
    });

    const results = new BloodChemistryResults({
      fbs: command.fbs,
      bun: command.bun,
      creatinine: command.creatinine,
      uricAcid: command.uricAcid,
      cholesterol: command.cholesterol,
      sgot: command.sgot,
      sgpt: command.sgpt,
      alkPhosphatase: command.alkPhosphatase,
      sodium: command.sodium,
      potassium: command.potassium,
      hbalc: command.hbalc
    });

    const mockBloodChemistry = BloodChemistry.create(
      patientInfo,
      command.dateTaken,
      results,
      command.labRequestId
    );

    return mockBloodChemistry;
  }
}
