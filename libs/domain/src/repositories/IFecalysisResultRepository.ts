import { FecalysisResult } from '../entities/FecalysisResult';
import { FecalysisResultId } from '../value-objects/FecalysisResultId';

export interface FecalysisResultRepositoryFilter {
  patientId?: string;
  dateFrom?: Date;
  dateTo?: Date;
  labRequestId?: string;
}

export interface IFecalysisResultRepository {
  save(fecalysisResult: FecalysisResult): Promise<FecalysisResult>;
  findById(id: FecalysisResultId): Promise<FecalysisResult | null>;
  findAll(filter?: FecalysisResultRepositoryFilter): Promise<FecalysisResult[]>;
  findByPatientId(patientId: string): Promise<FecalysisResult[]>;
  findByLabRequestId(labRequestId: string): Promise<FecalysisResult[]>;
  update(fecalysisResult: FecalysisResult): Promise<FecalysisResult>;
  delete(id: FecalysisResultId): Promise<void>;
}
