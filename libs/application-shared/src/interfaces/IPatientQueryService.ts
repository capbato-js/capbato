import { Patient } from '../domain/Patient';

export interface IPatientQueryService {
  getAllPatients(): Promise<Patient[]>;
  getPatientById(id: string): Promise<Patient>;
}