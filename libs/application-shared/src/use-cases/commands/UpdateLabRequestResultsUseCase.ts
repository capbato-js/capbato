import { injectable, inject } from 'tsyringe';
import { TOKENS } from '../../di/tokens';
import { ILabRequestRepository } from '@nx-starter/domain';
import { LabRequestNotFoundException } from '@nx-starter/domain';
import { UpdateLabRequestResultsCommand } from '../../dto/LaboratoryDto';

/**
 * Use case for updating lab request results
 * Follows the Single Responsibility Principle and CQRS pattern
 */
@injectable()
export class UpdateLabRequestResultsUseCase {
  constructor(
    @inject(TOKENS.LabRequestRepository) private readonly labRequestRepository: ILabRequestRepository
  ) {}

  async execute(command: UpdateLabRequestResultsCommand): Promise<void> {
    // Find lab requests for the patient
    const labRequests = await this.labRequestRepository.findByPatientId(command.patientId);
    
    // Find the specific request by date
    const existingLabRequest = labRequests.find(request => 
      request.requestDate.getTime() === command.requestDate.getTime()
    );
    
    if (!existingLabRequest) {
      throw new LabRequestNotFoundException(`${command.patientId}-${command.requestDate.toISOString()}`);
    }

    // Update the lab request using domain methods
    let updatedLabRequest = existingLabRequest;

    // Update status if provided
    if (command.status) {
      if (command.status === 'completed') {
        updatedLabRequest = updatedLabRequest.complete(command.dateTaken || new Date());
      } else if (command.status === 'cancelled') {
        updatedLabRequest = updatedLabRequest.cancel();
      }
    }

    // Update test results if provided
    const testUpdates: Record<string, string> = {};
    
    // Blood chemistry tests
    if (command.bloodChemistry?.fbs) testUpdates['fbs'] = 'true';
    if (command.bloodChemistry?.bun) testUpdates['bun'] = 'true';
    if (command.bloodChemistry?.creatinine) testUpdates['creatinine'] = 'true';
    if (command.bloodChemistry?.bloodUricAcid) testUpdates['bloodUricAcid'] = 'true';
    if (command.bloodChemistry?.lipidProfile) testUpdates['lipidProfile'] = 'true';
    if (command.bloodChemistry?.sgot) testUpdates['sgot'] = 'true';
    if (command.bloodChemistry?.sgpt) testUpdates['sgpt'] = 'true';
    if (command.bloodChemistry?.alkalinePhosphatase) testUpdates['alp'] = 'true';
    if (command.bloodChemistry?.sodium) testUpdates['sodiumNa'] = 'true';
    if (command.bloodChemistry?.potassium) testUpdates['potassiumK'] = 'true';
    if (command.bloodChemistry?.hba1c) testUpdates['hbalc'] = 'true';
    
    // Miscellaneous tests
    if (command.miscellaneous?.ecg) testUpdates['ecg'] = 'true';
    
    // Thyroid tests
    if (command.thyroid?.t3) testUpdates['t3'] = 'true';
    if (command.thyroid?.t4) testUpdates['t4'] = 'true';
    if (command.thyroid?.ft3) testUpdates['ft3'] = 'true';
    if (command.thyroid?.ft4) testUpdates['ft4'] = 'true';
    if (command.thyroid?.tsh) testUpdates['tsh'] = 'true';

    if (Object.keys(testUpdates).length > 0) {
      const updatedTests = updatedLabRequest.tests.updateResults(testUpdates);
      updatedLabRequest = updatedLabRequest.updateResults(updatedTests, command.dateTaken);
    }

    // Save the updated lab request
    await this.labRequestRepository.update(updatedLabRequest);
  }
}
