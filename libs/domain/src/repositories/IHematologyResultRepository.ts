import { HematologyResult } from '../entities/HematologyResult';
import { HematologyResultId } from '../value-objects/HematologyResultId';

export interface HematologyResultRepositoryFilter {
  patientId?: string;
  dateFrom?: Date;
  dateTo?: Date;
  labRequestId?: string;
}

export interface IHematologyResultRepository {
  save(hematologyResult: HematologyResult): Promise<HematologyResult>;
  findById(id: HematologyResultId): Promise<HematologyResult | null>;
  findAll(filter?: HematologyResultRepositoryFilter): Promise<HematologyResult[]>;
  findByPatientId(patientId: string): Promise<HematologyResult[]>;
  findByLabRequestId(labRequestId: string): Promise<HematologyResult[]>;
  update(hematologyResult: HematologyResult): Promise<HematologyResult>;
  delete(id: HematologyResultId): Promise<void>;
}
