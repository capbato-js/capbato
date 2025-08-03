import { LabRequest } from '../entities/LabRequest';
import { LabRequestId } from '../value-objects/LabRequestId';

export interface LabRequestRepositoryFilter {
  status?: 'pending' | 'complete' | 'cancelled';
  patientId?: string;
  dateFrom?: Date;
  dateTo?: Date;
}

export interface ILabRequestRepository {
  save(labRequest: LabRequest): Promise<LabRequest>;
  findById(id: LabRequestId): Promise<LabRequest | null>;
  findAll(filter?: LabRequestRepositoryFilter): Promise<LabRequest[]>;
  findByPatientId(patientId: string): Promise<LabRequest[]>;
  findCompleted(): Promise<LabRequest[]>;
  update(labRequest: LabRequest): Promise<LabRequest>;
  delete(id: LabRequestId): Promise<void>;
}
