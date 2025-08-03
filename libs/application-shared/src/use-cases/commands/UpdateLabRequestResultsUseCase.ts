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
        updatedLabRequest = updatedLabRequest.complete(command.dateTaken || new Date());
      } else if (command.status === 'cancelled') {
        updatedLabRequest = updatedLabRequest.cancel();
      }
    }

    // Update test results if provided
    const testUpdates: Record<string, string> = {};
    if (command.fbs) testUpdates['fbs'] = command.fbs;
    if (command.bun) testUpdates['bun'] = command.bun;
    if (command.creatinine) testUpdates['creatinine'] = command.creatinine;
    if (command.bloodUricAcid) testUpdates['bloodUricAcid'] = command.bloodUricAcid;
    if (command.lipidProfile) testUpdates['lipidProfile'] = command.lipidProfile;
    if (command.sgot) testUpdates['sgot'] = command.sgot;
    if (command.sgpt) testUpdates['sgpt'] = command.sgpt;
    if (command.alp) testUpdates['alp'] = command.alp;
    if (command.sodiumNa) testUpdates['sodiumNa'] = command.sodiumNa;
    if (command.potassiumK) testUpdates['potassiumK'] = command.potassiumK;
    if (command.hbalc) testUpdates['hbalc'] = command.hbalc;
    if (command.ecg) testUpdates['ecg'] = command.ecg;
    if (command.t3) testUpdates['t3'] = command.t3;
    if (command.t4) testUpdates['t4'] = command.t4;
    if (command.ft3) testUpdates['ft3'] = command.ft3;
    if (command.ft4) testUpdates['ft4'] = command.ft4;
    if (command.tsh) testUpdates['tsh'] = command.tsh;

    if (Object.keys(testUpdates).length > 0) {
      const updatedTests = updatedLabRequest.tests.updateResults(testUpdates);
      updatedLabRequest = updatedLabRequest.updateResults(updatedTests, command.dateTaken);
    }

    // Save the updated lab request
    await this.labRequestRepository.update(updatedLabRequest);
  }
}
