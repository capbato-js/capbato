import { injectable, inject } from 'tsyringe';
import { TOKENS } from '../../di/tokens';
import { ILabTestResultRepository } from '@nx-starter/domain';
import { LabTestResult, LabTestResultNotFoundException } from '@nx-starter/domain';

/**
 * Query handler for retrieving lab test result by lab request ID
 * Follows CQRS pattern - separate from command operations
 */
@injectable()
export class GetLabTestResultByLabRequestIdQueryHandler {
  constructor(
    @inject(TOKENS.LabTestResultRepository) private readonly labTestResultRepository: ILabTestResultRepository
  ) {}

  async execute(labRequestId: string): Promise<LabTestResult> {
    const labTestResult = await this.labTestResultRepository.getByLabRequestId(labRequestId);
    
    if (!labTestResult) {
      throw new LabTestResultNotFoundException(`No lab test result found for lab request ID: ${labRequestId}`);
    }
    
    return labTestResult;
  }
}
