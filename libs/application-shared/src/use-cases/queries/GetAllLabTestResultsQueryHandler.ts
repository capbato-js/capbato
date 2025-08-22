import { injectable, inject } from 'tsyringe';
import { TOKENS } from '../../di/tokens';
import { ILabTestResultRepository, LabTestResult } from '@nx-starter/domain';

/**
 * Query handler for retrieving all lab test results
 * Follows CQRS pattern - separate from command operations
 */
@injectable()
export class GetAllLabTestResultsQueryHandler {
  constructor(
    @inject(TOKENS.LabTestResultRepository) private readonly labTestResultRepository: ILabTestResultRepository
  ) {}

  async execute(): Promise<LabTestResult[]> {
    return await this.labTestResultRepository.getAll();
  }
}
