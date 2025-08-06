import { UrinalysisResult } from '../entities/UrinalysisResult';
import { UrinalysisResultId } from '../value-objects/UrinalysisResultId';

export interface UrinalysisResultRepositoryFilter {
  patientId?: string;
  dateFrom?: Date;
  dateTo?: Date;
  labRequestId?: string;
}

export interface IUrinalysisResultRepository {
  save(urinalysisResult: UrinalysisResult): Promise<UrinalysisResult>;
  findById(id: UrinalysisResultId): Promise<UrinalysisResult | null>;
  findAll(filter?: UrinalysisResultRepositoryFilter): Promise<UrinalysisResult[]>;
  findByPatientId(patientId: string): Promise<UrinalysisResult[]>;
  findByLabRequestId(labRequestId: string): Promise<UrinalysisResult[]>;
  update(urinalysisResult: UrinalysisResult): Promise<UrinalysisResult>;
  delete(id: UrinalysisResultId): Promise<void>;
}
