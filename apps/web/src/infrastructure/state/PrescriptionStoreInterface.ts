import { Prescription } from '@nx-starter/domain';
import type {
  CreatePrescriptionCommand,
  UpdatePrescriptionCommand,
} from '@nx-starter/application-shared';

export type PrescriptionFilter = 'all' | 'active' | 'completed' | 'discontinued' | 'on-hold' | 'expired';

export interface PrescriptionStats {
  total: number;
  active: number;
  completed: number;
  discontinued: number;
  onHold: number;
  expired: number;
}

export interface PrescriptionStore {
  // State
  prescriptions: Prescription[];
  filter: PrescriptionFilter;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;

  // Computed values
  getFilteredPrescriptions(): Prescription[];
  getStats(): PrescriptionStats;
  getIsLoading(): boolean;
  getIsIdle(): boolean;
  getHasError(): boolean;

  // Actions
  loadPrescriptions(): Promise<void>;
  createPrescription(data: CreatePrescriptionCommand): Promise<void>;
  updatePrescription(id: string, updates: UpdatePrescriptionCommand): Promise<void>;
  deletePrescription(id: string): Promise<void>;
  loadPrescriptionsByPatientId(patientId: string): Promise<void>;
  loadPrescriptionsByDoctorId(doctorId: string): Promise<void>;
  loadActivePrescriptions(): Promise<void>;
  loadExpiredPrescriptions(): Promise<void>;
  setFilter(filter: PrescriptionFilter): void;
  clearError(): void;
}