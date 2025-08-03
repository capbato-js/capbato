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
      if (command.status === 'complete') {
        updatedLabRequest = updatedLabRequest.complete(command.date_taken || new Date());
      } else if (command.status === 'cancelled') {
        updatedLabRequest = updatedLabRequest.cancel();
      }
    }

    // Update test results if provided
    const testUpdates: Record<string, string> = {};
    if (command.fbs) testUpdates['fbs'] = command.fbs;
    if (command.bun) testUpdates['bun'] = command.bun;
    if (command.creatinine) testUpdates['creatinine'] = command.creatinine;
    if (command.blood_uric_acid) testUpdates['bloodUricAcid'] = command.blood_uric_acid;
    if (command.lipid_profile) testUpdates['lipidProfile'] = command.lipid_profile;
    if (command.sgot) testUpdates['sgot'] = command.sgot;
    if (command.sgpt) testUpdates['sgpt'] = command.sgpt;
    if (command.alp) testUpdates['alp'] = command.alp;
    if (command.sodium_na) testUpdates['sodiumNa'] = command.sodium_na;
    if (command.potassium_k) testUpdates['potassiumK'] = command.potassium_k;
    if (command.hbalc) testUpdates['hbalc'] = command.hbalc;
    if (command.ecg) testUpdates['ecg'] = command.ecg;
    if (command.t3) testUpdates['t3'] = command.t3;
    if (command.t4) testUpdates['t4'] = command.t4;
    if (command.ft3) testUpdates['ft3'] = command.ft3;
    if (command.ft4) testUpdates['ft4'] = command.ft4;
    if (command.tsh) testUpdates['tsh'] = command.tsh;

    if (Object.keys(testUpdates).length > 0) {
      const updatedTests = updatedLabRequest.tests.updateResults(testUpdates);
      updatedLabRequest = updatedLabRequest.updateResults(updatedTests, command.date_taken);
    }

    // Save the updated lab request
    await this.labRequestRepository.update(updatedLabRequest);
  }
}
