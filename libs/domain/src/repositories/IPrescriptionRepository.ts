import { Prescription } from '../entities/Prescription';

export interface IPrescriptionRepository {
  getAll(): Promise<Prescription[]>;
  create(prescription: Prescription): Promise<string>;
  update(id: string, changes: Partial<Prescription>): Promise<void>;
  delete(id: string): Promise<void>;
  getById(id: string): Promise<Prescription | undefined>;
  getByPatientId(patientId: string): Promise<Prescription[]>;
  getByDoctorId(doctorId: string): Promise<Prescription[]>;
  getActive(): Promise<Prescription[]>;
  getExpired(): Promise<Prescription[]>;
  getByMedicationName(medicationName: string): Promise<Prescription[]>;
}