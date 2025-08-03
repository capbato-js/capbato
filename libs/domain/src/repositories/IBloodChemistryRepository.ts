import { BloodChemistry } from '../entities/BloodChemistry';
import { BloodChemistryId } from '../value-objects/BloodChemistryId';

export interface BloodChemistryRepositoryFilter {
  status?: 'pending' | 'complete' | 'cancelled';
  patientId?: string;
  dateFrom?: Date;
  dateTo?: Date;
}

export interface IBloodChemistryRepository {
  save(bloodChemistry: BloodChemistry): Promise<BloodChemistry>;
  findById(id: BloodChemistryId): Promise<BloodChemistry | null>;
  findAll(filter?: BloodChemistryRepositoryFilter): Promise<BloodChemistry[]>;
  findByPatientId(patientId: string): Promise<BloodChemistry[]>;
  findCompleted(): Promise<BloodChemistry[]>;
  update(bloodChemistry: BloodChemistry): Promise<BloodChemistry>;
  delete(id: BloodChemistryId): Promise<void>;
}
