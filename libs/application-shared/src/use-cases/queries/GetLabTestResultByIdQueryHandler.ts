import { injectable, inject } from 'tsyringe';
import { TOKENS } from '../../di/tokens';
import { ILabTestResultRepository } from '@nx-starter/domain';
import { LabTestResult, LabTestResultNotFoundException } from '@nx-starter/domain';

/**
 * Query handler for retrieving lab test result by ID
 * Follows CQRS pattern - separate from command operations
 */
@injectable()
export class GetLabTestResultByIdQueryHandler {
  constructor(
    @inject(TOKENS.LabTestResultRepository) private readonly labTestResultRepository: ILabTestResultRepository
  ) {}

  async execute(id: string): Promise<LabTestResult> {
    const labTestResult = await this.labTestResultRepository.getById(id);
    
    if (!labTestResult) {
      throw new LabTestResultNotFoundException(id);
    }
    
    return labTestResult;
  }
}
