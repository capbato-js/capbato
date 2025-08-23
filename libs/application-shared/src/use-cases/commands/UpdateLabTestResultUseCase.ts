import { injectable, inject } from 'tsyringe';
import { LabTestResult } from '@nx-starter/domain';
import { ILabTestResultRepository, LabTestResultNotFoundException } from '@nx-starter/domain';
import { TOKENS } from '../../di/tokens';
import { UpdateLabTestResultCommand } from '../../validation/LaboratoryValidationSchemas';

/**
 * Use case for updating lab test results
 * Implements the business logic for updating existing test results
 */
@injectable()
export class UpdateLabTestResultUseCase {
  constructor(
    @inject(TOKENS.LabTestResultRepository)
    private labTestResultRepository: ILabTestResultRepository
  ) {}

  async execute(command: UpdateLabTestResultCommand): Promise<LabTestResult> {
    // 1. Validate lab test result exists
    const existingLabTestResult = await this.labTestResultRepository.getById(command.id);
    if (!existingLabTestResult) {
      throw new LabTestResultNotFoundException(`Lab test result with ID ${command.id} not found`);
    }

    // 2. Update the lab test result entity
    const updatedLabTestResult = new LabTestResult(
      command.labRequestId || existingLabTestResult.labRequestId,
      existingLabTestResult.patientId,
      command.dateTested ? new Date(command.dateTested) : existingLabTestResult.dateTested,
      command.bloodChemistry !== undefined ? command.bloodChemistry : existingLabTestResult.bloodChemistry,
      command.urinalysis !== undefined ? command.urinalysis : existingLabTestResult.urinalysis,
      command.hematology !== undefined ? command.hematology : existingLabTestResult.hematology,
      command.fecalysis !== undefined ? command.fecalysis : existingLabTestResult.fecalysis,
      command.serology !== undefined ? command.serology : existingLabTestResult.serology,
      existingLabTestResult.dengue, // Keep existing dengue results (not updated by command)
      command.ecg !== undefined ? command.ecg : existingLabTestResult.ecg,
      command.coagulation !== undefined ? command.coagulation : existingLabTestResult.coagulation,
      command.remarks !== undefined ? command.remarks : existingLabTestResult.remarks,
      existingLabTestResult.id,
      existingLabTestResult.createdAt,
      new Date() // updatedAt
    );

    // 3. Save the updated lab test result
    const result = await this.labTestResultRepository.update(updatedLabTestResult);
    return result;
  }
}
