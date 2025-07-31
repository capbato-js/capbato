import { injectable, inject } from 'tsyringe';
import { Patient } from '../domain/Patient';
import { IPatientQueryService } from '../interfaces/IPatientQueryService';
import { GetAllPatientsQueryHandler, GetPatientByIdQueryHandler } from '../use-cases/queries/PatientQueryHandlers';
import { TOKENS } from '../di/tokens';

@injectable()
export class PatientQueryService implements IPatientQueryService {
  constructor(
    @inject(TOKENS.GetAllPatientsQueryHandler) 
    private getAllPatientsHandler: GetAllPatientsQueryHandler,
    @inject(TOKENS.GetPatientByIdQueryHandler) 
    private getPatientByIdHandler: GetPatientByIdQueryHandler
  ) {}

  async getAllPatients(): Promise<Patient[]> {
    return await this.getAllPatientsHandler.execute();
  }

  async getPatientById(id: string): Promise<Patient> {
    return await this.getPatientByIdHandler.execute({ id });
  }
}