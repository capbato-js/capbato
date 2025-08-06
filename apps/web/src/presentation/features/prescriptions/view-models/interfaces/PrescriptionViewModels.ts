import { Prescription } from '@nx-starter/domain';
import { CreatePrescriptionCommand, UpdatePrescriptionCommand } from '@nx-starter/application-shared';

/**
 * View Model interfaces for prescription presentation layer
 * These define the contract between view models and views
 */

export interface PrescriptionListViewModel {
  prescriptions: Prescription[];
  filteredPrescriptions: Prescription[];
  filter: 'all' | 'active' | 'completed' | 'discontinued' | 'on-hold' | 'expired';
  isLoading: boolean;
  error: string | null;
  stats: {
    total: number;
    active: number;
    completed: number;
    discontinued: number;
    onHold: number;
    expired: number;
  };

  // Actions
  setFilter(filter: 'all' | 'active' | 'completed' | 'discontinued' | 'on-hold' | 'expired'): void;
  refreshPrescriptions(): Promise<void>;
  loadPrescriptionsByPatientId(patientId: string): Promise<void>;
  loadPrescriptionsByDoctorId(doctorId: string): Promise<void>;
  clearError(): void;
}

export interface PrescriptionFormViewModel {
  isSubmitting: boolean;
  isGlobalLoading: boolean;
  error: string | null;
  
  // Actions
  createPrescription(data: CreatePrescriptionCommand): Promise<void>;
  updatePrescription(id: string, data: UpdatePrescriptionCommand): Promise<void>;
  handleFormSubmit(data: CreatePrescriptionCommand): Promise<boolean>;
  handleMultipleFormSubmit(commands: CreatePrescriptionCommand[]): Promise<boolean>;
  handleUpdateSubmit(id: string, data: UpdatePrescriptionCommand): Promise<boolean>;
  clearError(): void;
}

export interface PrescriptionItemViewModel {
  prescription: Prescription;
  isDeleting: boolean;
  isUpdating: boolean;

  // Actions
  deletePrescription(): Promise<void>;
  updateStatus(status: 'active' | 'completed' | 'discontinued' | 'on-hold'): Promise<void>;
  
  // View helpers
  getFormattedPrescribedDate(): string;
  getFormattedExpiryDate(): string | null;
  isExpired(): boolean;
  isActive(): boolean;
}

export interface ErrorBannerViewModel {
  hasError: boolean;
  error: string | null;

  // Actions
  dismiss(): void;
  retry(): void;
}