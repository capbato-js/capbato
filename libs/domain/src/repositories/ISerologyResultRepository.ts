import { SerologyResult } from '../entities/SerologyResult';
import { SerologyResultId } from '../value-objects/SerologyResultId';

export interface SerologyResultRepositoryFilter {
  patientId?: string;
  dateFrom?: Date;
  dateTo?: Date;
  labRequestId?: string;
}

export interface ISerologyResultRepository {
  save(serologyResult: SerologyResult): Promise<SerologyResult>;
  findById(id: SerologyResultId): Promise<SerologyResult | null>;
  findAll(filter?: SerologyResultRepositoryFilter): Promise<SerologyResult[]>;
  findByPatientId(patientId: string): Promise<SerologyResult[]>;
  findByLabRequestId(labRequestId: string): Promise<SerologyResult[]>;
  update(serologyResult: SerologyResult): Promise<SerologyResult>;
  delete(id: SerologyResultId): Promise<void>;
}
