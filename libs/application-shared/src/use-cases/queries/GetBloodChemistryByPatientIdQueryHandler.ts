import { injectable, inject } from 'tsyringe';
import { IBloodChemistryRepository } from '@nx-starter/domain';
import { BloodChemistry } from '@nx-starter/domain';
import { TOKENS } from '../../di/tokens';

@injectable()
export class GetBloodChemistryByPatientIdQueryHandler {
  constructor(
    @inject(TOKENS.BloodChemistryRepository)
    private readonly bloodChemistryRepository: IBloodChemistryRepository
  ) {}

  async execute(patientId: string): Promise<BloodChemistry[]> {
    return await this.bloodChemistryRepository.findByPatientId(patientId);
  }
}
